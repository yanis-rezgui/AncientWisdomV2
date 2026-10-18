import { memo, useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useArticleContext } from "../../Contexts/ArticleContext";


// Passe à 6 quand tu auras assez d'articles de qualité
const FEATURED_COUNT = 3;

type ArticleLike = Record<string, unknown>;

// ============================================================
// HELPERS
// ⚠️ Adapte les clés au schéma réel de ton modèle Article.
// ============================================================

const pickText = (item: ArticleLike, keys: string[]): string => {
    for (const key of keys) {
        const value = item[key];
        if (typeof value === "string" && value.trim()) return value;
        if (typeof value === "number") return String(value);
        if (Array.isArray(value) && typeof value[0] === "string") return value[0];
        if (value && typeof value === "object") {
            const name = (value as { name?: unknown }).name;
            if (typeof name === "string" && name.trim()) return name;
        }
    }
    return "";
};

const getImageUrl = (item: ArticleLike): string => {
    for (const key of ["image", "coverImage", "featuredImage", "thumbnail"]) {
        const value = item[key];
        if (typeof value === "string" && value) return value;
        if (value && typeof value === "object") {
            const url = (value as { url?: unknown }).url;
            if (typeof url === "string" && url) return url;
        }
    }
    return "";
};

const getDate = (item: ArticleLike) => {
    const raw = pickText(item, ["publishedAt", "updatedAt", "createdAt"]);
    const date = raw ? new Date(raw) : null;

    if (!date || Number.isNaN(date.getTime())) return null;

    return {
        iso: date.toISOString(),
        label: date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        }),
    };
};

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const gridVariants: Variants = {
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

const GRID_CLASSES =
    "grid grid-cols-1 min-lg:grid-cols-3 justify-items-center gap-5 mt-10 w-full max-w-[1200px]";

// ============================================================
// SKELETON
// ============================================================

const ArticleCardSkeleton = () => (
    <div
        className="w-full max-w-[520px] min-lg:max-w-none bg-[#F5E6C8] rounded-lg
        border border-gray-400 overflow-hidden animate-pulse"
    >
        <div className="h-[190px] w-full bg-[#E3CFA3]" />

        <div className="p-4 flex flex-col gap-2">
            <div className="h-3 w-1/2 rounded bg-[#E3CFA3]" />
            <div className="h-5 w-4/5 rounded bg-[#E3CFA3]" />

            <div className="flex flex-col gap-1.5 mt-1">
                <div className="h-3 w-full rounded bg-[#E3CFA3]" />
                <div className="h-3 w-full rounded bg-[#E3CFA3]" />
                <div className="h-3 w-3/4 rounded bg-[#E3CFA3]" />
            </div>

            <div className="h-4 w-28 rounded bg-[#E3CFA3] mt-3" />
        </div>
    </div>
);

// ============================================================
// ARTICLE CARD
// ============================================================

const ArticleCard = memo(({ article }: { article: ArticleLike }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const id = String(article._id ?? article.id ?? "");
    const title = pickText(article, ["title", "name"]);
    const excerpt = pickText(article, ["summary", "excerpt", "description", "intro"]);
    const category = pickText(article, ["category", "topic", "tags"]);
    const imageUrl = getImageUrl(article);
    const date = getDate(article);

    const alt =
        pickText(article, ["imageAlt", "alt"]) ||
        `Illustration for the article ${title}`;

    if (!id || !title) return null;

    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex flex-col w-full max-w-[520px] min-lg:max-w-none
            bg-[#F5E6C8] rounded-lg border border-gray-400 overflow-hidden
            transition-shadow duration-300 hover:shadow-xl hover:border-[#8C6A43]"
        >
            {/* IMAGE */}
            <div className="relative h-[190px] w-full overflow-hidden bg-[#E3CFA3]">
                {imageUrl && (
                    <>
                        {!imageLoaded && (
                            <div className="absolute inset-0 animate-pulse bg-[#E3CFA3]" />
                        )}
                        <img
                            src={imageUrl}
                            alt={alt}
                            loading="lazy"
                            onLoad={() => setImageLoaded(true)}
                            onError={() => setImageLoaded(true)}
                            className={`h-full w-full object-cover transition-all duration-700
                            group-hover:scale-110
                            ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                        />
                    </>
                )}
            </div>

            {/* CONTENT */}
            <div className="flex flex-col flex-1 p-4 gap-1">
                {(category || date) && (
                    <p className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8C6A43]">
                        {category && <span>{category}</span>}
                        {category && date && <span aria-hidden="true">·</span>}
                        {date && <time dateTime={date.iso}>{date.label}</time>}
                    </p>
                )}

                <h3 className="text-gray-900 font-semibold text-[1.15em]">
                    {/* Stretched link : toute la carte est cliquable avec un seul vrai lien */}
                    <Link
                        to={`/article/${id}`}
                        className="after:absolute after:inset-0 after:content-['']"
                    >
                        {title}
                    </Link>
                </h3>

                {excerpt && (
                    <p className="text-[14px] text-gray-700 line-clamp-3">
                        {excerpt}
                    </p>
                )}

                <span
                    className="text-[14px] flex flex-row gap-2 items-center text-[#3E3025]
                    font-semibold mt-auto pt-3"
                >
                    Read Article
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

const FeaturedArticles = () => {
    const { articles, loadingAllArticles, page, setPage, search, setSearch } =
        useArticleContext();

    // Le context est partagé avec /learn/articles : on repart d'une liste propre
    useEffect(() => {
        if (page !== 1) setPage(1);
        if (search) setSearch("");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const featured = articles.slice(0, FEATURED_COUNT);

    if (!loadingAllArticles && featured.length === 0) return null;

    return (
        <section
            aria-labelledby="featured-articles-title"
            className="flex flex-col w-full items-center px-5 py-10 bg-[#F3ECDD]"
        >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#8C6A43]"
            >
                From the Ancient World
            </motion.p>

            <motion.h2
                id="featured-articles-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-gray-950 text-[1.7em] font-bold text-center mt-2"
            >
                Read, Learn, and Discover
            </motion.h2>

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
                className="text-gray-700 text-center w-[620px] mt-3 max-[680px]:w-[320px]"
            >
                Go beyond the dates and discover the stories behind history.
                Our articles explore ancient civilizations, forgotten kingdoms,
                influential leaders, and the events that continue to shape our
                understanding of the world.
            </motion.p>

            {/* Les deux axes éditoriaux */}
            <motion.ul
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                className="mt-8 flex w-full max-w-[720px] flex-col gap-5 min-[700px]:flex-row min-[700px]:gap-10"
            >
                <li className="flex-1 border-l-2 border-[#8C6A43] pl-4">
                    <p className="font-semibold text-[#3E3025]">Ancient Civilizations</p>
                    <p className="mt-1 text-[14px] text-gray-700">
                        Discover the societies, cultures, and achievements that
                        shaped the ancient world.
                    </p>
                </li>

                <li className="flex-1 border-l-2 border-[#8C6A43] pl-4">
                    <p className="font-semibold text-[#3E3025]">People and Ideas</p>
                    <p className="mt-1 text-[14px] text-gray-700">
                        Explore the lives and ideas of influential figures
                        throughout history.
                    </p>
                </li>
            </motion.ul>

            {/* GRID */}
            {loadingAllArticles ? (
                <div className={GRID_CLASSES}>
                    {Array.from({ length: FEATURED_COUNT }).map((_, i) => (
                        <ArticleCardSkeleton key={i} />
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
                    {featured.map((article, i) => {
                        const item = article as unknown as ArticleLike;
                        return <ArticleCard key={String(item._id ?? i)} article={item} />;
                    })}
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
                        to="/learn/articles"
                        className="inline-block px-4 py-2 bg-[#8C6A43] text-gray-200 rounded-lg
                        text-[14px] cursor-pointer font-semibold"
                    >
                        Explore All History Articles →
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(FeaturedArticles);