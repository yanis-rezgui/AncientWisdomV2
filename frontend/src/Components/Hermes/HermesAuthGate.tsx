import { memo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const HermesAuthGate = () => {
    return (
        <section
            aria-labelledby="hermes-gate-title"
            className="flex min-h-screen w-full flex-col items-center bg-[#E8E2D6] px-5 py-20"
        >
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex w-full max-w-[460px] flex-col items-center gap-3 rounded-lg border border-gray-400
                bg-[#F5E6C8] p-8 text-center"
            >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#3E3025] text-[#F5E6C8]">
                    <MessageCircle size={22} aria-hidden="true" />
                </span>

                <h1
                    id="hermes-gate-title"
                    className="font-['Playfair_Display'] text-[1.8em] font-bold text-gray-950"
                >
                    Sign in to meet Hermes
                </h1>

                <p className="text-[14px] text-gray-700">
                    Create a free account or sign in to chat with Hermes and keep your conversations.
                </p>

                <div className="mt-3 flex flex-row flex-wrap justify-center gap-3">
                    <Link
                        to="/user" // adapte la route
                        className="rounded-lg bg-[#3E3025] px-5 py-2.5 text-[13px] font-semibold text-white
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        Sign In
                    </Link>

                    <Link
                        to="/"
                        className="rounded-lg border border-[#3E3025] px-5 py-2.5 text-[13px] font-semibold
                        text-[#3E3025] transition-colors duration-200 hover:bg-[#E3CFA3]"
                    >
                        Back to Home
                    </Link>
                </div>
            </motion.div>
        </section>
    );
};

export default memo(HermesAuthGate);