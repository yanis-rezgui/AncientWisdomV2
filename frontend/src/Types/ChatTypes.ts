/* =========================
   MESSAGE
========================= */

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
    _id: string;
    role: ChatRole;
    content: string;
    createdAt: string;

    // Uniquement côté client (messages optimistes)
    pending?: boolean;
    error?: boolean;
}


/* =========================
   CONVERSATION
========================= */

export interface Conversation {
    _id: string;
    title: string;
    lastMessageAt: string;
    messagesCount: number;
    createdAt: string;
}

export interface ConversationPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
}


/* =========================
   API RESPONSES
========================= */

// GET /hermes/conversations
export interface ConversationsResponse {
    conversations: Conversation[];
    pagination: ConversationPagination;
}

// GET /hermes/conversations/:id/messages
export interface ConversationMessagesResponse {
    conversation: Pick<Conversation, "_id" | "title" | "lastMessageAt" | "messagesCount">;
    messages: ChatMessage[];
    pagination: ConversationPagination;
}

// POST /hermes/chat
export interface SendMessageResponse {
    reply: string;
    conversationId: string;
}