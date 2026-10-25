import rateLimit from "express-rate-limit";

export const hermesChatLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 requêtes par minute et par utilisateur
  standardHeaders: "draft-7",
  legacyHeaders: false,
  // Doit passer APRÈS authorize pour que req.user existe
  keyGenerator: (req) => req.user._id.toString(),
  handler: (req, res) =>
    res.status(429).json({
      success: false,
      message: "Too many messages. Please wait a moment before trying again.",
    }),
});