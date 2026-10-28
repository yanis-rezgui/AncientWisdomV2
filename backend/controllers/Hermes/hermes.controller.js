import mongoose from "mongoose";
import { HERMES_AI_URL, HERMES_INTERNAL_KEY } from "../../config/env.js";
import Conversation from "../../models/Hermes/conversation.model.js";
import Message from "../../models/Hermes/message.model.js";

const HISTORY_LIMIT = 10; // 10 messages = 5 échanges (mets 20 pour 10 échanges)

// Budget de temps d'une requête /chat, sous la limite d'environ 100 s de l'hébergeur
const REQUEST_BUDGET_MS = 95000;
const WAKE_WAIT_MS = 80000; // attente maximale du réveil de FastAPI dans /chat
const LLM_MIN_MS = 15000; // temps minimum laissé au LLM

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Réessaie tant que Hermes renvoie autre chose que du JSON (service en train de se réveiller)
async function callHermes(url, options, { maxWaitMs = 85000, retryDelayMs = 4000 } = {}) {
  const start = Date.now();

  while (true) {
    const remaining = maxWaitMs - (Date.now() - start);

    try {
      const response = await fetch(url, {
        ...options,
        signal: AbortSignal.timeout(Math.max(remaining, 1000)),
      });

      const contentType = response.headers.get("content-type") || "";
      const raw = await response.text();

      if (contentType.includes("application/json")) {
        return { response, data: JSON.parse(raw) };
      }

      console.warn(
        `Hermes non-JSON (status ${response.status}), service probablement en réveil...`
      );
    } catch (err) {
      if (err.name === "TimeoutError") throw err;
      // erreur réseau pendant le réveil (ECONNRESET, fetch failed...) -> on réessaie
      console.warn("Hermes network error, retry:", err.message);
    }

    if (Date.now() - start + retryDelayMs >= maxWaitMs) {
      const e = new Error("Hermes AI did not wake up in time");
      e.name = "WakeTimeoutError";
      throw e;
    }

    await sleep(retryDelayMs);
  }
}

/* -------------------------------------------------------------------------- */
/*  Réveil de FastAPI : une seule requête longue, partagée entre tous les appels */
/* -------------------------------------------------------------------------- */

let hermesAwake = false;
let lastOkAt = 0;
let wakeInFlight = null;

const AWAKE_TTL_MS = 10 * 60 * 1000; // l'hébergeur gratuit endort le service après ~15 min d'inactivité

const isAwake = () => hermesAwake && Date.now() - lastOkAt < AWAKE_TTL_MS;

const markAwake = () => {
  hermesAwake = true;
  lastOkAt = Date.now();
};

const markAsleep = () => {
  hermesAwake = false;
};

function ensureWake() {
  if (wakeInFlight) return wakeInFlight;

  wakeInFlight = callHermes(
    `${HERMES_AI_URL}/health`,
    { method: "GET", headers: { Accept: "application/json" } },
    { maxWaitMs: 120000, retryDelayMs: 3000 }
  )
    .then(({ response }) => {
      if (response.ok) markAwake();
      return response.ok;
    })
    .catch(() => false)
    .finally(() => {
      wakeInFlight = null;
    });

  return wakeInFlight;
}

// Attend le réveil au maximum `ms` millisecondes (ensureWake ne rejette jamais)
const waitForWake = (ms) =>
  new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), ms);

    ensureWake().then((ok) => {
      clearTimeout(timer);
      resolve(ok);
    });
  });

/* -------------------------------------------------------------------------- */
/*  POST /chat                                                                */
/* -------------------------------------------------------------------------- */

export const chatWithHermes = async (req, res) => {
  const startedAt = Date.now();

  try {
    if (!HERMES_AI_URL || !HERMES_INTERNAL_KEY) {
      return res.status(500).json({
        success: false,
        message: "Hermes AI is not configured.",
      });
    }

    const { message, conversationId } = req.body;

    if (
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 4000
    ) {
      return res.status(400).json({
        success: false,
        message: "A valid message is required (maximum 4000 characters).",
      });
    }

    const cleanMessage = message.trim();
    const userId = req.user._id; // adapte selon ce que ton middleware authorize met dans req.user

    let conversation = null;
    let history = [];

    // 1. Conversation existante : vérifier la propriété + charger l'historique
    if (conversationId) {
      if (!mongoose.isValidObjectId(conversationId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid conversation id.",
        });
      }

      conversation = await Conversation.findOne({
        _id: conversationId,
        user: userId,
      });

      if (!conversation) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found.",
        });
      }

      const lastMessages = await Message.find({
        conversation: conversation._id,
        user: userId,
      })
        .sort({ createdAt: -1, _id: -1 })
        .limit(HISTORY_LIMIT)
        .select("role content -_id")
        .lean();

      history = lastMessages.reverse(); // ordre chronologique
    }

    // 2. S'assurer que FastAPI est réveillé
    if (!isAwake()) {
      const awake = await waitForWake(WAKE_WAIT_MS);

      if (!awake) {
        return res.status(504).json({
          success: false,
          message: "Hermes AI is waking up, please retry in a few seconds.",
        });
      }
    }

    // 3. Appel au LLM : il ne dispose que du temps restant du budget global
    const llmBudgetMs = Math.max(
      REQUEST_BUDGET_MS - (Date.now() - startedAt),
      LLM_MIN_MS
    );

    const { response, data } = await callHermes(
      `${HERMES_AI_URL}/api/v1/chat/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-Internal-Key": HERMES_INTERNAL_KEY,
        },
        body: JSON.stringify({ message: cleanMessage, history }),
      },
      { maxWaitMs: llmBudgetMs }
    );

    if (!response.ok) {
      return res
        .status([429, 502].includes(response.status) ? response.status : 502)
        .json({
          success: false,
          message: data.detail || "Hermes AI could not process the request.",
        });
    }

    markAwake();

    // 4. On crée la conversation seulement si l'IA a répondu
    //    (évite les conversations vides en cas d'erreur)
    if (!conversation) {
      conversation = await Conversation.create({
        user: userId,
        title: cleanMessage.slice(0, 60),
      });
    }

    await Message.insertMany(
      [
        {
          conversation: conversation._id,
          user: userId,
          role: "user",
          content: cleanMessage,
        },
        {
          conversation: conversation._id,
          user: userId,
          role: "assistant",
          content: data.reply,
        },
      ],
      { ordered: true }
    );

    await Conversation.updateOne(
      { _id: conversation._id },
      { $inc: { messagesCount: 2 }, $set: { lastMessageAt: new Date() } }
    );

    return res.status(200).json({
      success: true,
      data: {
        reply: data.reply,
        conversationId: conversation._id,
      },
    });
  } catch (error) {
    // Le service s'est rendormi en cours de route : on force un nouveau réveil au prochain appel
    if (error.name === "WakeTimeoutError") {
      markAsleep();

      return res.status(504).json({
        success: false,
        message: "Hermes AI is waking up, please retry in a few seconds.",
      });
    }

    // Le service est réveillé mais le LLM a mis trop de temps à répondre
    if (error.name === "TimeoutError") {
      return res.status(504).json({
        success: false,
        message: "Hermes took too long to answer, please try again.",
      });
    }

    console.error("Hermes AI error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Unable to reach Hermes AI.",
    });
  }
};

/* -------------------------------------------------------------------------- */
/*  GET /health                                                               */
/* -------------------------------------------------------------------------- */

export const checkHermesHealth = async (req, res) => {
  if (isAwake()) return res.status(200).json({ status: "ok" });

  void ensureWake(); // pas de await : on répond tout de suite
  return res.status(200).json({ status: "waking" });
};