import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";

import { useAuthContext } from "./AuthContext"; // adapte le chemin
import { useConversationContext } from "./ConversationContext";
import type {
    ChatMessage,
    ConversationMessagesResponse,
    SendMessageResponse,
} from "../Types/ChatTypes";
import { useHermesWarmup, type HermesStatus } from "../Hooks/useHermesWarmup";

export const HERMES_MAX_MESSAGE_LENGTH = 4000;
const MESSAGES_LIMIT = 30;

interface HermesContextType {
    messages: ChatMessage[];

    conversationId: string | null;
    conversationTitle: string;

    sendMessage: (content: string) => Promise<boolean>;
    sending: boolean;

    retryMessage: (messageId: string) => Promise<void>;

    loadConversation: (id: string) => Promise<void>;
    loadingMessages: boolean;

    loadMoreMessages: () => Promise<void>;
    loadingMoreMessages: boolean;
    hasMoreMessages: boolean;

    newChat: () => void;

    // Supprime une conversation et remet le chat à zéro si c'était la conversation active
    removeConversation: (id: string) => Promise<boolean>;

    errorMsg: string;
    clearError: () => void;
    hermesStatus: HermesStatus;
}

const HermesContext = createContext<HermesContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/hermes`;

export const HermesProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { token } = useAuthContext();
    const { refreshConversations, deleteConversation } = useConversationContext();

    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [conversationId, setConversationId] = useState<string | null>(null);
    const [conversationTitle, setConversationTitle] = useState<string>("");

    const [sending, setSending] = useState<boolean>(false);
    const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
    const [loadingMoreMessages, setLoadingMoreMessages] = useState<boolean>(false);

    const [messagesPage, setMessagesPage] = useState<number>(1);
    const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(false);

    const [errorMsg, setErrorMsg] = useState<string>("");

    // Refs : évitent les valeurs périmées dans les fonctions async
    const conversationIdRef = useRef<string | null>(null);
    // Incrémenté à chaque changement de conversation : les réponses d'une
    // ancienne conversation ne doivent pas écraser la conversation affichée
    const sessionRef = useRef<number>(0);

    const clearError = useCallback(() => setErrorMsg(""), []);

    const hermesStatus = useHermesWarmup(token);

    // Nouveau chat
    const newChat = useCallback((): void => {
        sessionRef.current += 1;
        conversationIdRef.current = null;

        setConversationId(null);
        setConversationTitle("");
        setMessages([]);
        setMessagesPage(1);
        setHasMoreMessages(false);
        setSending(false);
        setLoadingMessages(false);
        setLoadingMoreMessages(false);
        setErrorMsg("");
    }, []);

    // POST /api/v1/hermes/chat
    const sendMessage = useCallback(
        async (content: string): Promise<boolean> => {
            const trimmed = content.trim();

            if (!trimmed || sending) return false;

            if (trimmed.length > HERMES_MAX_MESSAGE_LENGTH) {
                setErrorMsg(
                    `Your message is too long (maximum ${HERMES_MAX_MESSAGE_LENGTH} characters).`
                );
                return false;
            }

            if (!token) {
                setErrorMsg("Please sign in to chat with Hermes.");
                return false;
            }

            const session = sessionRef.current;
            const tempId = `temp-${Date.now()}`;

            const userMessage: ChatMessage = {
                _id: tempId,
                role: "user",
                content: trimmed,
                createdAt: new Date().toISOString(),
                pending: true,
            };

            // Affichage optimiste du message de l'utilisateur
            setMessages((prev) => [...prev, userMessage]);
            setSending(true);
            setErrorMsg("");

            try {
                const res = await fetch(`${API_URL}/chat`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        message: trimmed,
                        ...(conversationIdRef.current
                            ? { conversationId: conversationIdRef.current }
                            : {}),
                    }),
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error || data.message || "Hermes could not answer right now"
                    );
                }

                const payload = data.data as SendMessageResponse;

                // L'utilisateur a changé de conversation pendant l'attente
                if (session === sessionRef.current) {
                    const assistantMessage: ChatMessage = {
                        _id: `assistant-${Date.now()}`,
                        role: "assistant",
                        content: payload.reply,
                        createdAt: new Date().toISOString(),
                    };

                    setMessages((prev) => [
                        ...prev.map((m) =>
                            m._id === tempId ? { ...m, pending: false } : m
                        ),
                        assistantMessage,
                    ]);

                    // Première réponse : le serveur vient de créer la conversation
                    if (!conversationIdRef.current) {
                        conversationIdRef.current = payload.conversationId;
                        setConversationId(payload.conversationId);
                        setConversationTitle(trimmed.slice(0, 60));
                    }
                }

                // Met à jour la sidebar (nouvelle conversation / ordre / compteur)
                await refreshConversations();

                return true;
            } catch (err) {
                console.error(err);

                if (session === sessionRef.current) {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m._id === tempId
                                ? { ...m, pending: false, error: true }
                                : m
                        )
                    );

                    setErrorMsg(
                        err instanceof Error
                            ? err.message
                            : "Hermes could not answer right now"
                    );
                }

                return false;
            } finally {
                if (session === sessionRef.current) {
                    setSending(false);
                }
            }
        },
        [token, sending, refreshConversations]
    );

    // Renvoyer un message en échec
    const retryMessage = useCallback(
        async (messageId: string): Promise<void> => {
            const failed = messages.find((m) => m._id === messageId && m.error);

            if (!failed) return;

            setMessages((prev) => prev.filter((m) => m._id !== messageId));
            await sendMessage(failed.content);
        },
        [messages, sendMessage]
    );

    // GET /api/v1/hermes/conversations/:id/messages?page=1&limit=30
    const loadConversation = useCallback(
        async (id: string): Promise<void> => {
            if (!token || id === conversationIdRef.current) return;

            sessionRef.current += 1;
            const session = sessionRef.current;

            conversationIdRef.current = id;

            setConversationId(id);
            setConversationTitle("");
            setMessages([]);
            setMessagesPage(1);
            setHasMoreMessages(false);
            setSending(false);
            setLoadingMessages(true);
            setErrorMsg("");

            try {
                const params = new URLSearchParams({
                    page: "1",
                    limit: MESSAGES_LIMIT.toString(),
                });

                const res = await fetch(
                    `${API_URL}/conversations/${id}/messages?${params.toString()}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error || data.message || "Error in fetching messages"
                    );
                }

                if (session !== sessionRef.current) return;

                const payload = data.data as ConversationMessagesResponse;

                setMessages(payload.messages ?? []);
                setConversationTitle(payload.conversation?.title ?? "");
                setMessagesPage(1);
                setHasMoreMessages(payload.pagination?.hasMore ?? false);
            } catch (err) {
                console.error(err);

                if (session === sessionRef.current) {
                    const message =
                        err instanceof Error
                            ? err.message
                            : "Error in fetching messages";

                    // Conversation introuvable (supprimée, autre compte...) : on repart de zéro
                    newChat();
                    setErrorMsg(message);
                }
            } finally {
                if (session === sessionRef.current) {
                    setLoadingMessages(false);
                }
            }
        },
        [token, newChat]
    );

    // Charger les messages plus anciens (scroll vers le haut)
    const loadMoreMessages = useCallback(async (): Promise<void> => {
        const id = conversationIdRef.current;

        if (!token || !id || !hasMoreMessages || loadingMoreMessages) return;

        const session = sessionRef.current;
        const nextPage = messagesPage + 1;

        setLoadingMoreMessages(true);

        try {
            const params = new URLSearchParams({
                page: nextPage.toString(),
                limit: MESSAGES_LIMIT.toString(),
            });

            const res = await fetch(
                `${API_URL}/conversations/${id}/messages?${params.toString()}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in fetching older messages"
                );
            }

            if (session !== sessionRef.current) return;

            const payload = data.data as ConversationMessagesResponse;
            const older = payload.messages ?? [];

            // Dédoublonnage : des messages ont pu être ajoutés depuis le premier chargement
            setMessages((prev) => {
                const ids = new Set(prev.map((m) => m._id));
                return [...older.filter((m) => !ids.has(m._id)), ...prev];
            });

            setMessagesPage(nextPage);
            setHasMoreMessages(payload.pagination?.hasMore ?? false);
        } catch (err) {
            console.error(err);

            if (session === sessionRef.current) {
                setErrorMsg(
                    err instanceof Error
                        ? err.message
                        : "Error in fetching older messages"
                );
            }
        } finally {
            if (session === sessionRef.current) {
                setLoadingMoreMessages(false);
            }
        }
    }, [token, hasMoreMessages, loadingMoreMessages, messagesPage]);

    // Suppression : si c'est la conversation affichée, on revient à un nouveau chat
    const removeConversation = useCallback(
        async (id: string): Promise<boolean> => {
            const deleted = await deleteConversation(id);

            if (deleted && conversationIdRef.current === id) {
                newChat();
            }

            return deleted;
        },
        [deleteConversation, newChat]
    );




    // Déconnexion : on vide le chat
    useEffect(() => {
        if (!token) newChat();
    }, [token, newChat]);

    return (
        <HermesContext.Provider
            value={{
                messages,
                conversationId,
                conversationTitle,
                sendMessage,
                sending,
                retryMessage,
                loadConversation,
                loadingMessages,
                loadMoreMessages,
                loadingMoreMessages,
                hasMoreMessages,
                newChat,
                removeConversation,
                errorMsg,
                clearError,
                hermesStatus
            }}
        >
            {children}
        </HermesContext.Provider>
    );
};

export const useHermesContext = () => {
    const context = useContext(HermesContext);

    if (!context) {
        throw new Error(
            "useHermesContext must be used within a HermesProvider"
        );
    }

    return context;
};