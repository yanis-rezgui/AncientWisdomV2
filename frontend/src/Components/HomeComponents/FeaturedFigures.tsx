import { memo, useState } from "react";
import {
    useHomePageContext,
    type HomePageItem,
} from "../../AdminContexts/HomePageContext";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";

// ============================================================
// HELPERS
// ============================================================

// Lit le premier champ texte non vide parmi une liste de clés possibles.
// ⚠️ Adapte les clés au schéma réel de tes figures.
const pickString = (item: HomePageItem, keys: string[]): string => {
    for (const key of keys) {
        const value = item[key];
        if (typeof value === "string" && value.trim()) return value;
    }
    return "";
};

const getMeta = (figure: HomePageItem): string =>
    [
        pickString(figure, ["civilization", "civilisation", "country", "region"]),
        pickString(figure, ["category", "role", "type"]),
    ]
        .filter(Boolean)
        .join(" · ");

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const gridVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.12 },
    },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

const GRID_CLASSES =
    "grid grid-cols-1 min-[560px]:grid-cols-2 min-xl:grid-cols-4 gap-5 mt-10 w-full max-w-[1200px]";

// ============================================================
// SKELETON
// ============================================================

const FigureCardSkeleton = () => (
    <div
        className="w-full bg-[#F5E6C8] rounded-lg border border-gray-400
        overflow-hidden animate-pulse"
    >
        <div className="aspect-[4/5] w-full bg-[#E3CFA3]" />

        <div className="p-3 flex flex-col gap-2">
            <div className="h-3 w-1/2 rounded bg-[#E3CFA3]" />
            <div className="h-5 w-2/3 rounded bg-[#E3CFA3]" />

            <div className="flex flex-col gap-1.5 mt-1">
                <div className="h-3 w-full rounded bg-[#E3CFA3]" />
                <div className="h-3 w-full rounded bg-[#E3CFA3]" />
                <div className="h-3 w-4/5 rounded bg-[#E3CFA3]" />
            </div>

            <div className="h-4 w-36 rounded bg-[#E3CFA3] mt-2" />
        </div>
    </div>
);

// ============================================================
// FIGURE CARD
// ============================================================

const FigureCard = memo(({ figure }: { figure: HomePageItem }) => {
    const [imageLoaded, setImageLoaded] = useState(!figure.image?.url);

    const name = figure.name ?? figure.title ?? "Historical figure";
    const meta = getMeta(figure);

    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex flex-col bg-[#F5E6C8] rounded-lg
            border border-gray-400 overflow-hidden
            transition-shadow duration-300 hover:shadow-xl hover:border-[#8C6A43]"
        >
            {/* IMAGE */}
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#E3CFA3]">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-[#E3CFA3]" />
                )}

                {figure.image?.url && (
                    <img
                        src={figure.image.url}
                        alt={`Portrait of ${name}${meta ? `, ${meta}` : ""}`}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                        className={`h-full w-full object-cover object-top transition-all duration-700
                        group-hover:scale-110
                        ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col flex-1 p-3 gap-1">
                {meta && (
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8C6A43]">
                        {meta}
                    </p>
                )}

                <h3 className="text-gray-900 font-semibold text-[1.15em]">
                    {/* Stretched link : toute la carte est cliquable avec un seul vrai lien */}
                    <Link
                        to={`/figure/${figure._id}`}
                        className="after:absolute after:inset-0 after:content-['']"
                    >
                        {name}
                    </Link>
                </h3>

                <p className="text-[14px] text-gray-700 line-clamp-3">
                    {figure.description}
                </p>

                <span
                    className="text-[14px] flex flex-row gap-2 items-center text-[#3E3025]
                    font-semibold mt-auto pt-2"
                >
                    Explore Biography
                    <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                        →
                    </span>
                </span>
            </div>
        </motion.article>
    );
});

// ============================================================
// SECTION
// ============================================================

const FeaturedFigures = () => {
    const { homePage, loadingHomePage } = useHomePageContext();

    const figures = homePage?.featuredFigures ?? [];

    if (!loadingHomePage && figures.length === 0) return null;

    return (
        <section
            aria-labelledby="featured-figures-title"
            className="flex flex-col w-full items-center px-5 py-10 bg-[#F3ECDD]"
            id="figures"
        >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#8C6A43]"
            >
                Historical Figures
            </motion.p>

            <motion.h2
                id="featured-figures-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-gray-950 text-[1.7em] font-bold text-center mt-2"
            >
                The Figures Who Shaped History
            </motion.h2>

            {/* Trait décoratif qui se dessine */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.25, ease: "easeOut" }}
                className="h-[2px] w-24 bg-[#8C6A43] mt-2 origin-center"
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                className="text-gray-700 text-center w-[560px] mt-3 max-[620px]:w-[320px]"
            >
                Discover the rulers, philosophers, military commanders, and
                visionaries who shaped ancient civilizations. Explore their
                lives, achievements, and lasting legacies through detailed
                historical biographies.
            </motion.p>

            {/* GRID */}
            {loadingHomePage ? (
                <div className={GRID_CLASSES}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <FigureCardSkeleton key={i} />
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
                    {figures.map((figure) => (
                        <FigureCard key={figure._id} figure={figure} />
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
                        to="/figures"
                        className="inline-block px-4 py-2 bg-[#8C6A43] text-gray-200 rounded-lg
                        text-[14px] cursor-pointer font-semibold"
                    >
                        Explore All Historical Figures →
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(FeaturedFigures);