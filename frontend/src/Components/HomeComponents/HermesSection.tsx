import { memo } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    BookOpen,
    Clock,
    Compass,
    History as HistoryIcon,
} from "lucide-react";

// ============================================================
// CONFIG
// ⚠️ Adapte la route si ta page de chat n'est pas /hermes
// ============================================================

const HERMES_ROUTE = "/hermes";

// Un sens de lecture réel (on pose une question, on lit, on rebondit) :
// la numérotation romaine est donc justifiée, comme dans ta FAQ.
const STEPS = [
    {
        numeral: "I",
        title: "Ask",
        text: "Type a question in your own words, from “Who was Hannibal?” to “Why did Rome fall?”.",
    },
    {
        numeral: "II",
        title: "Read",
        text: "Hermes answers in clear, plain language, without the jargon of a textbook.",
    },
    {
        numeral: "III",
        title: "Go further",
        text: "Ask a follow-up. Hermes keeps the thread of the conversation, so you never start over.",
    },
];

const BENEFITS = [
    {
        icon: Compass,
        title: "A guide, not a search box",
        text: "Describe what you are curious about and let Hermes point you to the right place in history.",
    },
    {
        icon: HistoryIcon,
        title: "Remembers the conversation",
        text: "Follow-up questions build on what you already asked, and your conversations are saved to your account.",
    },
    {
        icon: Clock,
        title: "There whenever you study",
        text: "Late-night revision or a quick question on your commute: Hermes is always available.",
    },
    {
        icon: BookOpen,
        title: "Made to go with the site",
        text: "Dig deeper after an article, or warm up before a quiz or a game.",
    },
];

// Exemple de conversation (statique) : montre le principe sans appeler l'API.
const EXAMPLE = [
    {
        from: "You",
        text: "Why did the Roman Republic fall?",
    },
    {
        from: "Hermes",
        text: "There is no single cause. Generals with loyal armies, deep inequality and rising political violence wore the Republic down, until Augustus became sole ruler and the Empire began in 27 BC.",
    },
    {
        from: "You",
        text: "Who was Augustus before that?",
    },
    {
        from: "Hermes",
        text: "He was born Octavian, the adopted heir of Julius Caesar. He defeated Mark Antony and Cleopatra at the Battle of Actium in 31 BC.",
    },
];

// ============================================================
// ANIMATION VARIANTS
// Un seul moment orchestré : la conversation qui se déroule.
// ============================================================

const dialogueVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.9, delayChildren: 0.3 } },
};

const lineVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

// ============================================================
// DECORATION (même frise grecque que la Hero)
// ============================================================

const GreekKey = () => (
    <svg
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-3 w-full text-[#B08D57]/50"
        preserveAspectRatio="none"
    >
        <defs>
            <pattern
                id="hermes-greek-key"
                width="18"
                height="12"
                patternUnits="userSpaceOnUse"
            >
                <path
                    d="M0 11 H16 V1 H4 V8 H12 V4 H8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.2"
                />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hermes-greek-key)" />
    </svg>
);

// ============================================================
// EXAMPLE DIALOGUE
// ============================================================

const ExampleDialogue = () => {
    const reduceMotion = useReducedMotion();

    return (
        <figure
            aria-label="Example of a conversation with Hermes"
            className="w-full max-w-[520px] overflow-hidden rounded-lg border border-[#8C6A43]
            bg-[#F5E6C8] shadow-xl"
        >
            <figcaption
                className="flex items-center justify-between border-b border-[#8C6A43]/40
                bg-[#E3CFA3] px-4 py-3"
            >
                <span className="font-['Playfair_Display'] font-bold text-[#3E3025]">
                    Conversation with Hermes
                </span>
                <span className="text-[12px] text-[#3E3025]/70">Example</span>
            </figcaption>

            <motion.div
                variants={dialogueVariants}
                initial={reduceMotion ? false : "hidden"}
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                className="flex flex-col gap-4 p-4"
            >
                {EXAMPLE.map((line, i) => {
                    const isUser = line.from === "You";

                    return (
                        <motion.div
                            key={i}
                            variants={lineVariants}
                            className={`flex flex-col gap-1 ${
                                isUser ? "items-end" : "items-start"
                            }`}
                        >
                            <span className="text-[12px] font-semibold text-[#8C6A43]">
                                {line.from}
                            </span>
                            <p
                                className={`max-w-[90%] rounded-lg px-3 py-2 text-[14px] leading-relaxed ${
                                    isUser
                                        ? "bg-[#3E3025] text-[#F5E6C8]"
                                        : "border border-[#8C6A43]/40 bg-[#F8F5EF] text-gray-800"
                                }`}
                            >
                                {line.text}
                            </p>
                        </motion.div>
                    );
                })}
            </motion.div>
        </figure>
    );
};

// ============================================================
// SECTION
// ============================================================

const HermesSection = () => {
    return (
        <section
            id="hermes"
            aria-labelledby="hermes-title"
            className="relative flex w-full flex-col items-center bg-[#3E3025] px-5 pt-16 pb-12"
        >
            <GreekKey />

            <div
                className="grid w-full max-w-[1200px] grid-cols-1 items-center gap-12
                min-lg:grid-cols-2 min-lg:gap-16"
            >
                {/* TEXTE */}
                <div className="flex flex-col items-center text-center min-lg:items-start min-lg:text-left">
                    <p className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A66B]">
                        Meet Hermes
                    </p>

                    <h2
                        id="hermes-title"
                        className="mt-2 font-['Playfair_Display'] text-[1.7em] font-bold text-[#F5E6C8]
                        min-[560px]:text-[2.1em]"
                    >
                        Ask Anything About the Ancient World
                    </h2>

                    <div className="mt-3 h-[2px] w-24 bg-[#B08D57]" />

                    <p className="mt-4 max-w-[540px] leading-relaxed text-[#F5E6C8]/85">
                        Named after the messenger of the gods, Hermes is the AI history
                        guide of Ancient Wisdom. Ask a question about a civilization, a
                        ruler, a battle or a monument, and get a clear answer you can
                        build on.
                    </p>

                    <ol className="mt-8 flex w-full max-w-[540px] flex-col gap-5 text-left">
                        {STEPS.map((step) => (
                            <li key={step.numeral} className="flex items-start gap-4">
                                <span
                                    aria-hidden="true"
                                    className="w-8 shrink-0 font-['Playfair_Display'] text-[1.2em] font-bold text-[#B08D57]"
                                >
                                    {step.numeral}
                                </span>
                                <div>
                                    <h3 className="font-semibold text-[#F5E6C8]">
                                        {step.title}
                                    </h3>
                                    <p className="mt-0.5 text-[14px] leading-relaxed text-[#F5E6C8]/75">
                                        {step.text}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>

                {/* EXEMPLE DE CONVERSATION */}
                <div className="flex justify-center min-lg:justify-end">
                    <ExampleDialogue />
                </div>
            </div>

            {/* BÉNÉFICES */}
            <ul
                className="mt-14 grid w-full max-w-[1200px] grid-cols-1 gap-x-8 gap-y-6
                min-[560px]:grid-cols-2 min-xl:grid-cols-4"
            >
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                    <li
                        key={title}
                        className="flex gap-3 border-l-2 border-[#8C6A43] pl-4"
                    >
                        <Icon
                            aria-hidden="true"
                            size={20}
                            className="mt-0.5 shrink-0 text-[#C9A66B]"
                        />
                        <div>
                            <h3 className="font-semibold text-[#F5E6C8]">{title}</h3>
                            <p className="mt-1 text-[14px] leading-relaxed text-[#F5E6C8]/75">
                                {text}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <div className="mt-10 flex flex-col items-center gap-3">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to={HERMES_ROUTE}
                        className="group flex items-center gap-2 rounded-lg border border-[#B08D57]
                        bg-[#B08D57] px-6 py-3 text-[15px] font-semibold text-[#1a120b]
                        transition-colors duration-300 hover:border-[#C9A66B] hover:bg-[#C9A66B]"
                    >
                        Ask Hermes a Question
                        <ArrowRight
                            aria-hidden="true"
                            size={17}
                            className="transition-transform duration-300 group-hover:translate-x-1"
                        />
                    </Link>
                </motion.div>

                <p className="max-w-[460px] text-center text-[13px] text-[#F5E6C8]/65">
                    Sign in to save your conversations. Hermes is an AI and can make
                    mistakes: for important dates and facts, check our{" "}
                    <Link
                        to="/learn/articles"
                        className="text-[#C9A66B] underline transition-colors hover:text-[#F5E6C8]"
                    >
                        history articles
                    </Link>
                    .
                </p>
            </div>
        </section>
    );
};

export default memo(HermesSection);