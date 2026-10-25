import { Router } from "express";
import { chatWithHermes, checkHermesHealth } from "../controllers/Hermes/hermes.controller.js";
import {
  getConversations,
  getConversationMessages,
  deleteConversation,
} from "../controllers/Hermes/conversation.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { hermesChatLimiter } from "../middlewares/hermesRateLimit.middleware.js";

const router = Router();

router.post("/chat", authorize, hermesChatLimiter, chatWithHermes);

router.get("/health", authorize, checkHermesHealth);

router.get("/conversations", authorize, getConversations);
router.get("/conversations/:id/messages", authorize, getConversationMessages);
router.delete("/conversations/:id", authorize, deleteConversation);

export default router;