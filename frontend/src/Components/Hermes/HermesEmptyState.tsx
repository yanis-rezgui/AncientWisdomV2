import { memo } from "react";
import { motion, type Variants } from "framer-motion";

import { useHermesContext } from "../../Contexts/HermesContext";

const suggestions = [
    "Who built the pyramids of Giza?",
    "What caused the fall of the Roman Republic?",
    "Explain Stoicism in simple terms",
    "How were Athens and Sparta different?",
];

const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

const HermesEmptyState = () => {
    const { sendMessage, sending , hermesStatus} = useHermesContext();

    return (
        <div className="flex flex-col items-center px-2 py-10 text-center">
            <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-[#8C6A43]
                font-['Playfair_Display'] text-[26px] font-bold text-[#F5E6C8]"
                aria-hidden="true"
            >
                H
            </motion.span>

            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="mt-4 font-['Playfair_Display'] text-[1.8em] font-bold text-gray-950 max-[500px]:text-[1.5em]"
            >
                How can Hermes guide you today?
            </motion.h2>

            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                className="mt-2 h-[2px] w-20 origin-center bg-[#8C6A43]"
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="mt-3 max-w-[460px] text-[14px] text-gray-700"
            >
                Ask about civilizations, historical figures, events or ideas.
                Hermes will explain the past with context and care.
            </motion.p>

            <motion.ul
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="mt-8 grid w-full max-w-[560px] grid-cols-1 gap-3 min-[560px]:grid-cols-2"
            >
                {suggestions.map((suggestion) => (
                    <motion.li key={suggestion} variants={itemVariants} className="list-none">
                        <button
                            type="button"
                            disabled={sending || hermesStatus === "waking"}
                            onClick={() => void sendMessage(suggestion)}
                            className="h-full w-full rounded-lg border border-gray-400 bg-[#F5E6C8] px-4 py-3 text-left
                            text-[13px] font-medium text-gray-800 transition-all duration-300 hover:border-[#8C6A43]
                            hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {suggestion}
                        </button>
                    </motion.li>
                ))}
            </motion.ul>
        </div>
    );
};

export default memo(HermesEmptyState);