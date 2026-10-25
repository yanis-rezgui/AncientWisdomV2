import { memo, useLayoutEffect, useEffect, useRef } from "react";
import { Loader2, PanelLeft, X } from "lucide-react";

import { useHermesContext } from "../../Contexts/HermesContext";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import HermesEmptyState from "./HermesEmptyState";
import ChatInput from "./ChatInput";

interface ChatWindowProps {
    onOpenSidebar: () => void;
}

const ChatWindow = ({ onOpenSidebar }: ChatWindowProps) => {
    const {
        messages,
        conversationTitle,
        sending,
        loadingMessages,
        loadingMoreMessages,
        hasMoreMessages,
        loadMoreMessages,
        errorMsg,
        clearError,
    } = useHermesContext();

    const scrollRef = useRef<HTMLDivElement>(null);
    const firstIdRef = useRef<string | undefined>(undefined);
    const lastIdRef = useRef<string | undefined>(undefined);
    const prevHeightRef = useRef<number>(0);

    // Scroll : bas de page pour les nouveaux messages, position conservée pour les anciens
    useLayoutEffect(() => {
        const el = scrollRef.current;

        if (!el) return;

        if (messages.length === 0) {
            firstIdRef.current = undefined;
            lastIdRef.current = undefined;
            return;
        }

        const first = messages[0]._id;
        const last = messages[messages.length - 1]._id;

        const prepended =
            firstIdRef.current !== undefined &&
            first !== firstIdRef.current &&
            last === lastIdRef.current;

        if (prepended) {
            el.scrollTop = el.scrollHeight - prevHeightRef.current;
        } else {
            el.scrollTo({
                top: el.scrollHeight,
                behavior: firstIdRef.current === undefined ? "auto" : "smooth",
            });
        }

        firstIdRef.current = first;
        lastIdRef.current = last;
    }, [messages]);

    // Descendre quand l'indicateur « Hermes is thinking » apparaît
    useEffect(() => {
        if (!sending) return;

        scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
        });
    }, [sending]);

    const handleLoadMore = () => {
        const el = scrollRef.current;

        if (!el || !hasMoreMessages || loadingMoreMessages || loadingMessages) return;

        prevHeightRef.current = el.scrollHeight;
        void loadMoreMessages();
    };

    const handleScroll = () => {
        const el = scrollRef.current;

        if (el && el.scrollTop < 80) handleLoadMore();
    };

    return (
        <div className="flex min-w-0 flex-1 flex-col">
            {/* Header */}
            <header className="flex flex-row items-center gap-3 border-b border-gray-400 bg-[#F5E6C8] px-4 py-3">
                <button
                    type="button"
                    onClick={onOpenSidebar}
                    aria-label="Open conversations"
                    className="rounded-lg p-1.5 text-[#3E3025] transition-colors duration-200 hover:bg-[#E3CFA3] min-lg:hidden"
                >
                    <PanelLeft size={20} aria-hidden="true" />
                </button>

                <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8C6A43]
                    font-['Playfair_Display'] text-[16px] font-bold text-[#F5E6C8]"
                    aria-hidden="true"
                >
                    H
                </span>

                <div className="flex min-w-0 flex-col">
                    <h1 className="truncate font-['Playfair_Display'] text-[1.1em] font-bold text-gray-950">
                        {conversationTitle || "Hermes"}
                    </h1>
                    <p className="truncate text-[12px] text-gray-600">
                        Your guide to the ancient world
                    </p>
                </div>
            </header>

            {/* Messages */}
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                role="log"
                aria-live="polite"
                aria-label="Conversation with Hermes"
                className="flex-1 overflow-y-auto px-4 py-5"
            >
                <div className="mx-auto flex w-full max-w-[760px] flex-col gap-4">
                    {hasMoreMessages && !loadingMessages && (
                        <button
                            type="button"
                            onClick={handleLoadMore}
                            disabled={loadingMoreMessages}
                            className="mx-auto flex flex-row items-center gap-2 rounded-full border border-[#8C6A43]
                            bg-[#F5E6C8] px-4 py-1.5 text-[12px] font-semibold text-[#8C6A43] transition-opacity
                            duration-200 hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingMoreMessages && (
                                <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                            )}
                            Load earlier messages
                        </button>
                    )}

                    {loadingMessages ? (
                        <div className="flex flex-col gap-4" aria-hidden="true">
                            <div className="h-12 w-2/3 animate-pulse self-end rounded-lg bg-[#D9D0BE]" />
                            <div className="h-24 w-3/4 animate-pulse rounded-lg bg-[#E3CFA3]" />
                            <div className="h-10 w-1/2 animate-pulse self-end rounded-lg bg-[#D9D0BE]" />
                        </div>
                    ) : messages.length === 0 ? (
                        <HermesEmptyState />
                    ) : (
                        messages.map((message) => (
                            <MessageBubble key={message._id} message={message} />
                        ))
                    )}

                    {sending && <TypingIndicator />}
                </div>
            </div>

            {/* Saisie */}
            <footer className="border-t border-gray-400 bg-[#E8E2D6] px-4 pb-3 pt-3">
                <div className="mx-auto flex w-full max-w-[760px] flex-col gap-2">
                    {errorMsg && (
                        <div
                            role="alert"
                            className="flex flex-row items-start justify-between gap-2 rounded-lg border border-red-300
                            bg-red-50 px-3 py-2 text-[13px] text-red-800"
                        >
                            <span>{errorMsg}</span>
                            <button
                                type="button"
                                onClick={clearError}
                                aria-label="Dismiss error"
                                className="shrink-0 rounded p-0.5 hover:bg-red-100"
                            >
                                <X size={14} aria-hidden="true" />
                            </button>
                        </div>
                    )}

                    <ChatInput />

                    <p className="text-center text-[11px] text-gray-600">
                        Hermes can make mistakes. Verify important historical details.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default memo(ChatWindow);