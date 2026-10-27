import { memo, useEffect, useRef, useState } from "react";
import { ArrowUp, Loader2 } from "lucide-react";

import {
    HERMES_MAX_MESSAGE_LENGTH,
    useHermesContext,
} from "../../Contexts/HermesContext";

const ChatInput = () => {
    const { sendMessage, sending , hermesStatus} = useHermesContext();
    const waking = hermesStatus === "waking";

    const [value, setValue] = useState<string>("");
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Hauteur automatique (max 160px)
    useEffect(() => {
        const el = textareaRef.current;

        if (!el) return;

        el.style.height = "auto";
        el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }, [value]);

    const canSend = value.trim().length > 0 && !sending && !waking;

    const submit = async () => {
        const content = value.trim();

        if (!content || sending || waking) return;

        setValue("");
        await sendMessage(content);
        textareaRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
            e.preventDefault();
            void submit();
        }
    };

    return (
        <div
            className="flex flex-row items-end gap-2 rounded-lg border border-gray-400 bg-[#F8F5EF] p-2
            transition-colors duration-200 focus-within:border-[#8C6A43]"
        >
            <label htmlFor="hermes-input" className="sr-only">
                Ask Hermes
            </label>

            <textarea
                id="hermes-input"
                ref={textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={HERMES_MAX_MESSAGE_LENGTH}
                rows={1}
                placeholder={waking ? "Hermes is waking up…" : "Ask Hermes anything…"}
                className="max-h-[160px] flex-1 resize-none bg-transparent px-2 py-1.5 text-[14px] text-gray-900
                outline-none placeholder:text-gray-500"
            />

            {value.length > 3500 && (
                <span className="self-center text-[11px] text-gray-600">
                    {value.length}/{HERMES_MAX_MESSAGE_LENGTH}
                </span>
            )}

            <button
                type="button"
                onClick={() => void submit()}
                disabled={!canSend}
                aria-label="Send message"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#3E3025] text-white
                transition-opacity duration-200 hover:opacity-80 active:opacity-60
                disabled:cursor-not-allowed disabled:opacity-40"
            >
                {sending ? (
                    <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                ) : (
                    <ArrowUp size={16} aria-hidden="true" />
                )}
            </button>
        </div>
    );
};

export default memo(ChatInput);