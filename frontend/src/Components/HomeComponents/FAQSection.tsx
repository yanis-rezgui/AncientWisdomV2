import { memo, useMemo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Plus } from "lucide-react";
import {
    useHomePageContext,
    type HomePageFAQ,
} from "../../AdminContexts/HomePageContext";

// ============================================================
// HELPERS
// ============================================================

const toRoman = (num: number): string => {
    const map: [number, string][] = [
        [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
    ];
    let result = "";
    for (const [value, symbol] of map) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }
    return result;
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

// ============================================================
// SKELETON
// ============================================================

const FAQSkeleton = () => (
    <div
        className="flex items-center gap-4 rounded-lg border border-gray-400
        bg-[#F5E6C8] p-4 animate-pulse"
    >
        <div className="h-5 w-8 rounded bg-[#E3CFA3]" />
        <div className="h-5 flex-1 rounded bg-[#E3CFA3]" />
        <div className="h-5 w-5 rounded bg-[#E3CFA3]" />
    </div>
);

// ============================================================
// FAQ ITEM
// ============================================================

interface FAQItemProps {
    faq: HomePageFAQ;
    index: number;
    id: string;
    open: boolean;
    onToggle: () => void;
}

const FAQItem = memo(({ faq, index, id, open, onToggle }: FAQItemProps) => (
    <motion.li
        variants={itemVariants}
        className={`list-none overflow-hidden rounded-lg border bg-[#F5E6C8]
        transition-all duration-300
        ${
            open
                ? "border-[#8C6A43] shadow-md"
                : "border-gray-400 hover:border-[#8C6A43]/70"
        }`}
    >
        <h3>
            <button
                type="button"
                id={`faq-button-${id}`}
                aria-expanded={open}
                aria-controls={`faq-panel-${id}`}
                onClick={onToggle}
                className="flex w-full cursor-pointer items-center gap-4 p-4 text-left"
            >
                <span
                    aria-hidden="true"
                    className="w-8 shrink-0 font-['Playfair_Display'] font-bold text-[#8C6A43]"
                >
                    {toRoman(index + 1)}
                </span>

                <span className="flex-1 font-semibold text-gray-900">
                    {faq.question}
                </span>

                <motion.span
                    aria-hidden="true"
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ duration: 0.25 }}
                    className="shrink-0 text-[#8C6A43]"
                >
                    <Plus size={20} />
                </motion.span>
            </button>
        </h3>

        {/* Le contenu reste dans le DOM (utile pour le SEO), il est seulement replié */}
        <motion.div
            id={`faq-panel-${id}`}
            role="region"
            aria-labelledby={`faq-button-${id}`}
            initial={false}
            animate={
                open
                    ? { height: "auto", opacity: 1, visibility: "visible" }
                    : {
                          height: 0,
                          opacity: 0,
                          transitionEnd: { visibility: "hidden" },
                      }
            }
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
        >
            <p className="whitespace-pre-line px-4 pb-5 text-[15px] leading-relaxed text-gray-700 min-[500px]:pl-16">
                {faq.answer}
            </p>
        </motion.div>
    </motion.li>
));

// ============================================================
// SECTION
// ============================================================

const FAQSection = () => {
    const { homePage, loadingHomePage } = useHomePageContext();

    const [openId, setOpenId] = useState<string | null>(null);
    const [initialized, setInitialized] = useState(false);

    // Seulement les FAQs publiées, dans l'ordre choisi par l'admin
    const faqs = useMemo(
        () =>
            (homePage?.faqs ?? [])
                .filter((faq) => faq.isPublished)
                .sort((a, b) => a.order - b.order),
        [homePage]
    );

    const idOf = (faq: HomePageFAQ, index: number) => faq._id ?? `faq-${index}`;

    // La première question est ouverte au départ
    if (!initialized && faqs.length > 0) {
        setInitialized(true);
        setOpenId(idOf(faqs[0], 0));
    }

    // Données structurées schema.org (FAQPage)
    const jsonLd = useMemo(
        () => ({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                    "@type": "Answer",
                    text: faq.answer,
                },
            })),
        }),
        [faqs]
    );

    if (!loadingHomePage && faqs.length === 0) return null;

    return (
        <section
            aria-labelledby="faq-title"
            className="flex w-full flex-col items-center bg-[#F8F5EF] px-5 py-10"
        >
            {faqs.length > 0 && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
                    }}
                />
            )}

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#8C6A43]"
            >
                Have Questions?
            </motion.p>

            <motion.h2
                id="faq-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="mt-2 text-center text-[1.7em] font-bold text-gray-950"
            >
                Frequently Asked Questions
            </motion.h2>

            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                className="mt-2 h-[2px] w-24 origin-center bg-[#8C6A43]"
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="mt-3 w-[560px] text-center text-gray-700 max-[620px]:w-[320px]"
            >
                Everything you need to know about Ancient Wisdom, from our
                history articles to our quizzes and games.
            </motion.p>

            {loadingHomePage ? (
                <div className="mt-10 flex w-full max-w-3xl flex-col gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <FAQSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.ul
                    variants={listVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="mt-10 flex w-full max-w-3xl flex-col gap-3"
                >
                    {faqs.map((faq, index) => {
                        const id = idOf(faq, index);

                        return (
                            <FAQItem
                                key={id}
                                faq={faq}
                                index={index}
                                id={id}
                                open={openId === id}
                                onToggle={() =>
                                    setOpenId((current) =>
                                        current === id ? null : id
                                    )
                                }
                            />
                        );
                    })}
                </motion.ul>
            )}
        </section>
    );
};

export default memo(FAQSection);