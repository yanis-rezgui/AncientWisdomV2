import mongoose from "mongoose";
import Conversation from "../../models/Hermes/conversation.model.js";
import Message from "../../models/Hermes/message.model.js";

const parsePagination = (query, defaultLimit, maxLimit) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || defaultLimit, 1), maxLimit);
  return { page, limit, skip: (page - 1) * limit };
};

// GET /conversations?page=1&limit=20
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page, limit, skip } = parsePagination(req.query, 20, 50);

    const filter = { user: userId, isArchived: false };

    const [conversations, total] = await Promise.all([
      Conversation.find(filter)
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("title lastMessageAt messagesCount createdAt")
        .lean(),
      Conversation.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        conversations,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + conversations.length < total,
        },
      },
    });
  } catch (error) {
    console.error("getConversations error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch conversations.",
    });
  }
};

// GET /conversations/:id/messages?page=1&limit=30
// page 1 = les messages les plus récents ; page 2 = les plus anciens avant eux
export const getConversationMessages = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id.",
      });
    }

    const conversation = await Conversation.findOne({ _id: id, user: userId })
      .select("title lastMessageAt messagesCount")
      .lean();

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    const { page, limit, skip } = parsePagination(req.query, 30, 100);

    const filter = { conversation: id, user: userId };

    const [messages, total] = await Promise.all([
      Message.find(filter)
        .sort({ createdAt: -1, _id: -1 })
        .skip(skip)
        .limit(limit)
        .select("role content createdAt")
        .lean(),
      Message.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        conversation,
        messages: messages.reverse(), // ordre chronologique pour l'affichage
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + messages.length < total,
        },
      },
    });
  } catch (error) {
    console.error("getConversationMessages error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to fetch messages.",
    });
  }
};

// DELETE /conversations/:id
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid conversation id.",
      });
    }

    const conversation = await Conversation.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found.",
      });
    }

    await Message.deleteMany({ conversation: id, user: userId });

    return res.status(200).json({
      success: true,
      message: "Conversation deleted successfully.",
    });
  } catch (error) {
    console.error("deleteConversation error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Unable to delete conversation.",
    });
  }
};