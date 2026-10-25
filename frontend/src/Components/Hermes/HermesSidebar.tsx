import { memo } from "react";
import { Loader2, MessageSquarePlus, X } from "lucide-react";

import { useConversationContext } from "../../Contexts/ConversationContext";
import { useHermesContext } from "../../Contexts/HermesContext";
import ConversationItem from "./ConversationItem";

interface HermesSidebarProps {
    onSelect: (id: string) => void;
    onNewChat: () => void;
    onClose?: () => void;
}

const HermesSidebar = ({ onSelect, onNewChat, onClose }: HermesSidebarProps) => {
    const {
        conversations,
        loadingConversations,
        loadingMoreConversations,
        hasMoreConversations,
        loadMoreConversations,
        getConversations,
        setConversationToDelete,
        deletingConversationId,
        errorMsg,
    } = useConversationContext();

    const { conversationId } = useHermesContext();

    return (
        <div className="flex h-full w-full flex-col">
            <div className="flex flex-row items-center justify-between gap-2 border-b border-gray-400 p-4">
                <h2 className="font-['Playfair_Display'] text-[1.2em] font-bold text-gray-950">
                    Conversations
                </h2>

                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close conversations"
                        className="rounded-lg p-1.5 text-[#3E3025] transition-colors duration-200 hover:bg-[#E3CFA3]"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                )}
            </div>

            <div className="p-3">
                <button
                    type="button"
                    onClick={onNewChat}
                    className="flex w-full flex-row items-center justify-center gap-2 rounded-lg bg-[#3E3025] px-4 py-2.5
                    text-[13px] font-semibold text-white transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    <MessageSquarePlus size={16} aria-hidden="true" />
                    New Conversation
                </button>
            </div>

            <nav
                aria-label="Conversation history"
                className="flex-1 overflow-y-auto px-3 pb-3"
            >
                {loadingConversations ? (
                    <ul className="flex flex-col gap-2" aria-hidden="true">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <li
                                key={i}
                                className="h-[54px] animate-pulse rounded-lg bg-[#E3CFA3]"
                            />
                        ))}
                    </ul>
                ) : errorMsg && conversations.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-6 text-center">
                        <p className="text-[13px] text-gray-700">{errorMsg}</p>
                        <button
                            type="button"
                            onClick={() => void getConversations()}
                            className="rounded-lg border border-[#3E3025] px-4 py-1.5 text-[12px] font-semibold
                            text-[#3E3025] transition-colors duration-200 hover:bg-[#E3CFA3]"
                        >
                            Try again
                        </button>
                    </div>
                ) : conversations.length === 0 ? (
                    <p className="px-2 py-6 text-center text-[13px] text-gray-600">
                        No conversations yet. Ask Hermes your first question about history.
                    </p>
                ) : (
                    <ul className="flex flex-col gap-1.5">
                        {conversations.map((conversation) => (
                            <ConversationItem
                                key={conversation._id}
                                conversation={conversation}
                                active={conversation._id === conversationId}
                                deleting={deletingConversationId === conversation._id}
                                onSelect={() => onSelect(conversation._id)}
                                onDelete={() => setConversationToDelete(conversation)}
                            />
                        ))}
                    </ul>
                )}

                {hasMoreConversations && !loadingConversations && (
                    <button
                        type="button"
                        onClick={() => void loadMoreConversations()}
                        disabled={loadingMoreConversations}
                        className="mt-3 flex w-full flex-row items-center justify-center gap-2 rounded-lg border
                        border-[#3E3025] px-4 py-2 text-[12px] font-semibold text-[#3E3025] transition-colors
                        duration-200 hover:bg-[#E3CFA3] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loadingMoreConversations && (
                            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                        )}
                        Load more
                    </button>
                )}
            </nav>
        </div>
    );
};

export default memo(HermesSidebar);