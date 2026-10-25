import { memo } from "react";
import { motion } from "framer-motion";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { AlertCircle, RotateCcw } from "lucide-react";

import { useHermesContext } from "../../Contexts/HermesContext";
import type { ChatMessage } from "../../Types/ChatTypes";

// Rendu Markdown aux couleurs d'Ancient Wisdom (le HTML brut n'est pas interprété)
const markdownComponents: Components = {
    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
    h1: ({ children }) => (
        <h3 className="mb-2 mt-4 font-['Playfair_Display'] text-[1.2em] font-bold text-gray-950 first:mt-0">
            {children}
        </h3>
    ),
    h2: ({ children }) => (
        <h3 className="mb-2 mt-4 font-['Playfair_Display'] text-[1.15em] font-bold text-gray-950 first:mt-0">
            {children}
        </h3>
    ),
    h3: ({ children }) => (
        <h4 className="mb-2 mt-3 font-['Playfair_Display'] text-[1.05em] font-bold text-gray-950 first:mt-0">
            {children}
        </h4>
    ),
    ul: ({ children }) => <ul className="mb-3 ml-5 list-disc space-y-1 last:mb-0">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 ml-5 list-decimal space-y-1 last:mb-0">{children}</ol>,
    li: ({ children }) => <li className="pl-1">{children}</li>,
    strong: ({ children }) => <strong className="font-semibold text-gray-950">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    a: ({ href, children }) => (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#8C6A43] underline underline-offset-2 hover:opacity-80"
        >
            {children}
        </a>
    ),
    blockquote: ({ children }) => (
        <blockquote className="mb-3 border-l-4 border-[#8C6A43] pl-3 italic text-gray-700">
            {children}
        </blockquote>
    ),
    hr: () => <hr className="my-4 border-gray-400" />,
    code: ({ children }) => (
        <code className="rounded bg-[#E3CFA3] px-1 py-0.5 text-[13px]">{children}</code>
    ),
    pre: ({ children }) => (
        <pre className="mb-3 overflow-x-auto rounded-lg bg-[#E3CFA3] p-3 text-[13px]">{children}</pre>
    ),
    table: ({ children }) => (
        <div className="mb-3 overflow-x-auto">
            <table className="w-full border-collapse text-[14px]">{children}</table>
        </div>
    ),
    th: ({ children }) => (
        <th className="border border-gray-400 bg-[#E3CFA3] px-2 py-1 text-left font-semibold">
            {children}
        </th>
    ),
    td: ({ children }) => <td className="border border-gray-400 px-2 py-1">{children}</td>,
};

const formatTime = (date: string): string =>
    new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
    });

const MessageBubble = ({ message }: { message: ChatMessage }) => {
    const { retryMessage, sending } = useHermesContext();

    const isUser = message.role === "user";

    if (isUser) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="flex flex-col items-end gap-1"
            >
                <div
                    className={`max-w-[85%] whitespace-pre-wrap break-words rounded-lg px-4 py-2.5 text-[14px]
                    ${
                        message.error
                            ? "border border-red-400 bg-red-50 text-red-900"
                            : "bg-[#3E3025] text-[#F5E6C8]"
                    }
                    ${message.pending ? "opacity-70" : ""}`}
                >
                    {message.content}
                </div>

                {message.error ? (
                    <div className="flex flex-row items-center gap-2 text-[12px] text-red-700">
                        <AlertCircle size={13} aria-hidden="true" />
                        <span>Message not sent</span>
                        <button
                            type="button"
                            onClick={() => void retryMessage(message._id)}
                            disabled={sending}
                            className="flex flex-row items-center gap-1 font-semibold underline underline-offset-2
                            hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <RotateCcw size={12} aria-hidden="true" />
                            Retry
                        </button>
                    </div>
                ) : (
                    <span className="text-[11px] text-gray-600">{formatTime(message.createdAt)}</span>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-row items-start gap-2"
        >
            <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8C6A43]
                font-['Playfair_Display'] text-[14px] font-bold text-[#F5E6C8]"
                aria-hidden="true"
            >
                H
            </span>

            <div className="flex min-w-0 max-w-[90%] flex-col gap-1">
                <div
                    className="break-words rounded-lg border border-gray-400 bg-[#F5E6C8] px-4 py-3
                    text-[14px] leading-relaxed text-gray-800"
                >
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={markdownComponents}
                    >
                        {message.content}
                    </ReactMarkdown>
                </div>

                <span className="text-[11px] text-gray-600">{formatTime(message.createdAt)}</span>
            </div>
        </motion.div>
    );
};

export default memo(MessageBubble);