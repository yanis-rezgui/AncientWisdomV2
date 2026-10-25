import { memo } from "react";
import { Loader2, Trash2 } from "lucide-react";

import type { Conversation } from "../../Types/ChatTypes";

interface ConversationItemProps {
    conversation: Conversation;
    active: boolean;
    deleting: boolean;
    onSelect: () => void;
    onDelete: () => void;
}

const formatDate = (date: string): string =>
    new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

const ConversationItem = ({
    conversation,
    active,
    deleting,
    onSelect,
    onDelete,
}: ConversationItemProps) => {
    return (
        <li
            className={`group flex flex-row items-center gap-1 rounded-lg border transition-colors duration-200
            ${
                active
                    ? "border-[#8C6A43] bg-[#E3CFA3]"
                    : "border-transparent hover:bg-[#EBD8AE]"
            }`}
        >
            <button
                type="button"
                onClick={onSelect}
                aria-current={active ? "page" : undefined}
                className="flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2 text-left"
            >
                <span className="truncate text-[14px] font-semibold text-gray-900">
                    {conversation.title}
                </span>
                <span className="text-[11px] text-gray-600">
                    {formatDate(conversation.lastMessageAt)} · {conversation.messagesCount} messages
                </span>
            </button>

            <button
                type="button"
                onClick={onDelete}
                disabled={deleting}
                aria-label={`Delete conversation ${conversation.title}`}
                className="mr-1 shrink-0 rounded-lg p-2 text-[#3E3025] transition-all duration-200 hover:bg-white/60
                disabled:cursor-not-allowed focus-visible:opacity-100
                min-lg:opacity-0 min-lg:group-hover:opacity-100"
            >
                {deleting ? (
                    <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                ) : (
                    <Trash2 size={15} aria-hidden="true" />
                )}
            </button>
        </li>
    );
};

export default memo(ConversationItem);