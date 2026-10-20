import { memo } from "react";
import {
    useHomePageContext,
    type HomePageItem,
} from "../../AdminContexts/HomePageContext";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";

// ============================================================
// HELPERS
// ============================================================

// Lit le premier champ non vide parmi une liste de clés possibles
// (texte, nombre, ou objet populé avec un champ "name").
// ⚠️ Adapte les clés au schéma réel de tes quotes.

const getObjectLabel = (value: unknown): string => {
    if (typeof value === "string") {
        return value.trim();
    }

    if (typeof value === "number") {
        return String(value);
    }

    if (!value || typeof value !== "object") {
        return "";
    }

    const obj = value as Record<string, unknown>;

    // Nom complet d'une figure historique
    const firstName =
        typeof obj.firstName === "string" ? obj.firstName : "";
    const lastName =
        typeof obj.lastName === "string" ? obj.lastName : "";

    const fullName = `${firstName} ${lastName}`.trim();

    if (fullName) return fullName;

    // Champs textuels possibles selon les modèles
    for (const key of ["name", "title", "label", "fullName", "text"]) {
        const field = obj[key];

        if (typeof field === "string" && field.trim()) {
            return field.trim();
        }
    }

    // Ne jamais afficher l'identifiant MongoDB comme un nom.
    return "";
};

const pickText = (
    item: HomePageItem,
    keys: string[]
): string => {
    for (const key of keys) {
        const label = getObjectLabel(item[key]);

        if (label) return label;
    }

    return "";
};

const getQuoteText = (quote: HomePageItem): string =>
    pickText(quote, ["text", "content", "quote"]);

const getAuthor = (quote: HomePageItem): string =>
    pickText(quote, ["author", "figure", "authorName"]);

const getContext = (quote: HomePageItem): string =>
    pickText(quote, ["era", "civilization", "source", "origin"]);


// ============================================================
// ANIMATION VARIANTS
// ============================================================

const gridVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.15 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

const GRID_CLASSES =
    "grid grid-cols-1 min-lg:grid-cols-3 justify-items-center gap-5 mt-10 w-full max-w-[1200px]";

// ============================================================
// SKELETON
// ============================================================

const QuoteCardSkeleton = () => (
    <div
        className="w-full max-w-[520px] min-lg:max-w-none rounded-lg border
        border-[#F5E6C8]/15 p-6 animate-pulse"
    >
        <div className="h-10 w-10 rounded bg-[#F5E6C8]/10" />

        <div className="flex flex-col gap-2 mt-4">
            <div className="h-4 w-full rounded bg-[#F5E6C8]/10" />
            <div className="h-4 w-full rounded bg-[#F5E6C8]/10" />
            <div className="h-4 w-3/4 rounded bg-[#F5E6C8]/10" />
        </div>

        <div className="h-[1px] w-12 bg-[#F5E6C8]/10 mt-6" />
        <div className="h-3 w-1/3 rounded bg-[#F5E6C8]/10 mt-4" />
        <div className="h-3 w-1/4 rounded bg-[#F5E6C8]/10 mt-2" />
    </div>
);

// ============================================================
// QUOTE CARD
// ============================================================

const QuoteCard = memo(({ quote }: { quote: HomePageItem }) => {
    const text = getQuoteText(quote);
    const author = getAuthor(quote);
    const context = getContext(quote);

    if (!text) return null;

    return (
        <motion.figure
            variants={cardVariants}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex flex-col w-full max-w-[520px] min-lg:max-w-none
            rounded-lg border border-[#F5E6C8]/20 p-6
            transition-colors duration-300 hover:border-[#C9A66B]/70"
        >
            {/* Guillemet décoratif */}
            <span
                aria-hidden="true"
                className="font-serif text-[4.5em] leading-[0.7] text-[#8C6A43]
                transition-colors duration-300 group-hover:text-[#C9A66B]"
            >
                “
            </span>

            <blockquote className="mt-3">
                <p className="font-serif italic text-[1.1em] leading-relaxed text-[#F5E6C8]">
                    {text}
                </p>
            </blockquote>

            <figcaption className="mt-auto pt-6">
                {/* Trait qui s'allonge au survol */}
                <div
                    className="h-[1px] w-12 bg-[#C9A66B] mb-4
                    transition-all duration-500 group-hover:w-24"
                />

                {author && (
                    <p className="text-[13px] font-semibold uppercase tracking-[0.15em] text-[#C9A66B]">
                        {author}
                    </p>
                )}

                {context && (
                    <p className="mt-1 text-[12px] text-[#F5E6C8]/60">
                        {context}
                    </p>
                )}
            </figcaption>
        </motion.figure>
    );
});

// ============================================================
// SECTION
// ============================================================

const QuotesOfTheDay = () => {
    const { homePage, loadingHomePage } = useHomePageContext();

    const quotes = homePage?.quotesOfTheDay ?? [];

    if (!loadingHomePage && quotes.length === 0) return null;

    return (
        <section
        id="quotes"
            aria-labelledby="quotes-of-the-day-title"
            className="flex flex-col w-full items-center px-5 py-14 bg-[#3E3025]"
        >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#C9A66B]"
            >
                Quotes of the Day
            </motion.p>

            <motion.h2
                id="quotes-of-the-day-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-[#F5E6C8] text-[1.7em] font-bold text-center mt-2"
            >
                Words That Echo Through the Ages
            </motion.h2>

            {/* Trait décoratif qui se dessine */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                className="h-[2px] w-24 bg-[#C9A66B] mt-2 origin-center"
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-[#F5E6C8]/70 text-center w-[560px] mt-3 max-[620px]:w-[320px]"
            >
                Read timeless words from the philosophers, rulers, and thinkers
                of the ancient world, and discover the ideas that continue to
                inspire us today.
            </motion.p>

            {/* GRID */}
            {loadingHomePage ? (
                <div className={GRID_CLASSES}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <QuoteCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className={GRID_CLASSES}
                >
                    {quotes.map((quote) => (
                        <QuoteCard key={quote._id} quote={quote} />
                    ))}
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-7"
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/quotes"
                        className="inline-block px-4 py-2  text-gray-200 rounded-lg
                        text-[14px] cursor-pointer font-semibold
                        rounded-lg border border-[#F5E6C8]/20 p-6
            transition-colors duration-300 hover:border-[#C9A66B]/70"
                        
                    >
                        Explore All Historical Figures →
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(QuotesOfTheDay);