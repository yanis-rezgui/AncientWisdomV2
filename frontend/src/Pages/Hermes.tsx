import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { BookOpen, Compass, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
    {
        icon: MessageCircle,
        title: "Ask Anything",
        description:
            "Ask questions about civilizations, figures and events in plain language and get clear, easy-to-follow answers.",
    },
    {
        icon: Compass,
        title: "Guided Discovery",
        description:
            "Let Hermes suggest the next article, guide or quiz based on what you are curious about.",
    },
    {
        icon: BookOpen,
        title: "Built on Our Content",
        description:
            "Answers grounded in the articles, frames and guides of Ancient Wisdom, so you can keep exploring from the source.",
    },
];

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

// ============================================================
// PAGE
// ============================================================

const Hermes = () => {
    return (
        <section
            aria-labelledby="hermes-title"
            className="min-h-screen flex flex-col w-full bg-[#E8E2D6] items-center px-5 py-16"
        >
            {/* Badge */}
            <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-row items-center gap-2 rounded-full border border-[#8C6A43]
                bg-[#F5E6C8] px-4 py-1.5 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#8C6A43]"
            >
                <Sparkles size={14} aria-hidden="true" />
                Coming Soon
            </motion.span>

            <motion.h1
                id="hermes-title"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="mt-5 text-center font-['Playfair_Display'] text-[2.4em] font-bold text-gray-950
                max-[500px]:text-[2em]"
            >
                Meet Hermes
            </motion.h1>

            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                className="mt-2 h-[2px] w-24 origin-center bg-[#8C6A43]"
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="mt-3 w-[600px] text-center text-gray-700 max-[660px]:w-[320px]"
            >
                Hermes, our AI guide to the ancient world, is on its way. Soon
                you will be able to ask questions, get answers and be guided
                through history, right from Ancient Wisdom.
            </motion.p>

            {/* Aperçu du chat (statique, désactivé) */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                aria-hidden="true"
                className="mt-10 flex w-full max-w-[560px] flex-col gap-3 rounded-lg border border-gray-400
                bg-[#F5E6C8] p-4 select-none"
            >
                <div className="self-end rounded-lg bg-[#3E3025] px-3 py-2 text-[14px] text-[#F5E6C8]">
                    Who built the pyramids of Giza?
                </div>

                <div className="flex flex-row items-start gap-2">
                    <span
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full
                        bg-[#8C6A43] font-['Playfair_Display'] text-[14px] font-bold text-[#F5E6C8]"
                    >
                        H
                    </span>
                    <div className="h-12 w-3/4 animate-pulse rounded-lg bg-[#E3CFA3]" />
                </div>

                <div
                    className="mt-1 flex flex-row items-center justify-between rounded-lg border border-gray-400
                    bg-[#F8F5EF] px-3 py-2 text-[14px] text-gray-500 cursor-not-allowed"
                >
                    <span>Ask Hermes anything…</span>
                    <span className="text-[#8C6A43]">→</span>
                </div>
            </motion.div>

            {/* Features */}
            <motion.ul
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="mt-12 flex w-full max-w-[1000px] flex-wrap justify-center gap-5"
            >
                {features.map(({ icon: Icon, title, description }) => (
                    <motion.li
                        key={title}
                        variants={cardVariants}
                        className="list-none flex flex-col gap-2 rounded-lg border border-gray-400 bg-[#F5E6C8] p-5
                        w-full max-w-[420px]
                        min-[560px]:w-[calc(50%-10px)] min-[560px]:max-w-none
                        min-lg:w-[calc(33.333%-14px)]
                        transition-shadow duration-300 hover:shadow-xl hover:border-[#8C6A43]"
                    >
                        <span
                            className="flex h-10 w-10 items-center justify-center rounded-full
                            bg-[#3E3025] text-[#F5E6C8]"
                        >
                            <Icon size={20} aria-hidden="true" />
                        </span>

                        <h2 className="mt-1 text-[1.15em] font-semibold text-gray-900">
                            {title}
                        </h2>

                        <p className="text-[14px] text-gray-700">{description}</p>
                    </motion.li>
                ))}
            </motion.ul>

            {/* Retour */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-12 flex flex-row flex-wrap justify-center gap-3"
            >
                <Link
                    to="/learn/articles"
                    className="rounded-lg bg-[#3E3025] px-5 py-2.5 text-[13px] font-semibold text-white
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    Read Articles in the Meantime
                </Link>

                <Link
                    to="/"
                    className="rounded-lg border border-[#3E3025] px-5 py-2.5 text-[13px] font-semibold text-[#3E3025]
                    transition-colors duration-200 hover:bg-[#F5E6C8]"
                >
                    Back to Home
                </Link>
            </motion.div>
        </section>
    );
};

export default memo(Hermes);