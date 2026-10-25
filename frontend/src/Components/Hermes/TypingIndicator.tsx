import { memo } from "react";
import { motion } from "framer-motion";

const TypingIndicator = () => {
    return (
        <div
            role="status"
            aria-label="Hermes is writing a response"
            className="flex flex-row items-start gap-2"
        >
            <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#8C6A43]
                font-['Playfair_Display'] text-[14px] font-bold text-[#F5E6C8]"
                aria-hidden="true"
            >
                H
            </span>

            <div className="flex flex-row items-center gap-1.5 rounded-lg border border-gray-400 bg-[#F5E6C8] px-4 py-3.5">
                {[0, 1, 2].map((i) => (
                    <motion.span
                        key={i}
                        className="h-2 w-2 rounded-full bg-[#8C6A43]"
                        animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
                        transition={{
                            duration: 0.9,
                            repeat: Infinity,
                            delay: i * 0.15,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default memo(TypingIndicator);