import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import { useAuthContext } from "./AuthContext"; // adapte le chemin
import type {
    Conversation,
    ConversationsResponse,
} from "../Types/ChatTypes";

interface ConversationContextType {
    conversations: Conversation[];

    getConversations: () => Promise<void>;
    loadingConversations: boolean;

    refreshConversations: () => Promise<void>;

    loadMoreConversations: () => Promise<void>;
    loadingMoreConversations: boolean;
    hasMoreConversations: boolean;

    totalConversations: number;

    deleteConversation: (id: string) => Promise<boolean>;
    deletingConversationId: string | null;

    // Popup de confirmation de suppression
    conversationToDelete: Conversation | null;
    setConversationToDelete: (conversation: Conversation | null) => void;

    errorMsg: string;
}

const ConversationContext = createContext<ConversationContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/hermes/conversations`;
const CONVERSATIONS_LIMIT = 20;

export const ConversationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const { token } = useAuthContext();

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingConversations, setLoadingConversations] = useState<boolean>(false);
    const [loadingMoreConversations, setLoadingMoreConversations] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [hasMoreConversations, setHasMoreConversations] = useState<boolean>(false);
    const [totalConversations, setTotalConversations] = useState<number>(0);

    const [deletingConversationId, setDeletingConversationId] = useState<string | null>(null);
    const [conversationToDelete, setConversationToDelete] = useState<Conversation | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");

    // GET /api/v1/hermes/conversations?page=1&limit=20
    // silent = true : pas de skeleton (utilisé pour rafraîchir après un message)
    const fetchConversations = useCallback(
        async (pageToLoad: number, silent: boolean = false): Promise<void> => {
            if (!token) return;

            const isFirstPage = pageToLoad === 1;

            if (!silent) {
                if (isFirstPage) setLoadingConversations(true);
                else setLoadingMoreConversations(true);
            }

            setErrorMsg("");

            try {
                const params = new URLSearchParams({
                    page: pageToLoad.toString(),
                    limit: CONVERSATIONS_LIMIT.toString(),
                });

                const res = await fetch(`${API_URL}?${params.toString()}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error || data.message || "Error in fetching conversations"
                    );
                }

                const payload = data.data as ConversationsResponse;
                const incoming = payload.conversations ?? [];

                setConversations((prev) =>
                    isFirstPage
                        ? incoming
                        : [
                              ...prev,
                              ...incoming.filter(
                                  (c) => !prev.some((p) => p._id === c._id)
                              ),
                          ]
                );

                setPage(payload.pagination?.page ?? pageToLoad);
                setHasMoreConversations(payload.pagination?.hasMore ?? false);
                setTotalConversations(payload.pagination?.total ?? 0);
            } catch (err) {
                console.error(err);
                setErrorMsg(
                    err instanceof Error
                        ? err.message
                        : "Error in fetching conversations"
                );
            } finally {
                setLoadingConversations(false);
                setLoadingMoreConversations(false);
            }
        },
        [token]
    );

    const getConversations = useCallback(
        () => fetchConversations(1),
        [fetchConversations]
    );

    const refreshConversations = useCallback(
        () => fetchConversations(1, true),
        [fetchConversations]
    );

    const loadMoreConversations = useCallback(async (): Promise<void> => {
        if (!hasMoreConversations || loadingMoreConversations || loadingConversations) {
            return;
        }

        await fetchConversations(page + 1);
    }, [
        hasMoreConversations,
        loadingMoreConversations,
        loadingConversations,
        page,
        fetchConversations,
    ]);

    // DELETE /api/v1/hermes/conversations/:id
    const deleteConversation = useCallback(
        async (id: string): Promise<boolean> => {
            if (!token) return false;

            setDeletingConversationId(id);
            setErrorMsg("");

            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error || data.message || "Error in deleting conversation"
                    );
                }

                setConversations((prev) => prev.filter((c) => c._id !== id));
                setTotalConversations((prev) => Math.max(prev - 1, 0));
                setConversationToDelete(null);

                return true;
            } catch (err) {
                console.error(err);
                setErrorMsg(
                    err instanceof Error
                        ? err.message
                        : "Error in deleting conversation"
                );
                return false;
            } finally {
                setDeletingConversationId(null);
            }
        },
        [token]
    );

    // Charger la liste à la connexion, la vider à la déconnexion
    useEffect(() => {
        if (!token) {
            setConversations([]);
            setPage(1);
            setHasMoreConversations(false);
            setTotalConversations(0);
            setConversationToDelete(null);
            return;
        }

        void getConversations();
    }, [token, getConversations]);

    return (
        <ConversationContext.Provider
            value={{
                conversations,
                getConversations,
                loadingConversations,
                refreshConversations,
                loadMoreConversations,
                loadingMoreConversations,
                hasMoreConversations,
                totalConversations,
                deleteConversation,
                deletingConversationId,
                conversationToDelete,
                setConversationToDelete,
                errorMsg,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversationContext = () => {
    const context = useContext(ConversationContext);

    if (!context) {
        throw new Error(
            "useConversationContext must be used within a ConversationProvider"
        );
    }

    return context;
};