import mongoose from "mongoose";
import { HERMES_AI_URL, HERMES_INTERNAL_KEY } from "../../config/env.js";
import Conversation from "../../models/Hermes/conversation.model.js";
import Message from "../../models/Hermes/message.model.js";

const HISTORY_LIMIT = 10; // 10 messages = 5 échanges (mets 20 pour 10 échanges)

export const chatWithHermes = async (req, res) => {
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

    // 2. Appel au service FastAPI
    const response = await fetch(`${HERMES_AI_URL}/api/v1/chat/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Internal-Key": HERMES_INTERNAL_KEY,
      },
      body: JSON.stringify({ message: cleanMessage, history }),
      signal: AbortSignal.timeout(60000),
    });

    const data = await response.json();

    if (!response.ok) {
      return res
        .status([429, 502].includes(response.status) ? response.status : 502)
        .json({
          success: false,
          message: data.detail || "Hermes AI could not process the request.",
        });
    }

    // 3. On crée la conversation seulement si l'IA a répondu
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
    if (error.name === "TimeoutError") {
      return res.status(504).json({
        success: false,
        message: "Hermes AI took too long to respond.",
      });
    }

    console.error("Hermes AI error:", error.message);

    return res.status(502).json({
      success: false,
      message: "Unable to reach Hermes AI.",
    });
  }
};



export const checkHermesHealth = async (req, res) => {
  try {
    const response = await fetch(
      `${HERMES_AI_URL}/health`,
      {
        signal: AbortSignal.timeout(65000),
      }
    );

    const data = await response.json();

    return res.status(response.ok ? 200 : 502).json({
      status: response.ok ? "ok" : "unavailable",
      hermes: data,
    });
  } catch (error) {
    return res.status(502).json({
      status: "unavailable",
      message: "Hermes AI is unreachable.",
    });
  }
};