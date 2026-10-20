import { memo, useState } from "react";
import {
    useHomePageContext,
    type HomePageItem,
} from "../../AdminContexts/HomePageContext";
import { motion, type Variants } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

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

// ============================================================
// SKELETON
// ============================================================

const EraCardSkeleton = () => (
    <div
        className="w-[350px] max-w-full bg-[#F5E6C8] rounded-lg border border-gray-400
        overflow-hidden animate-pulse"
    >
        <div className="h-[200px] w-full bg-[#E3CFA3]" />

        <div className="p-2 mt-2 flex flex-col gap-2">
            <div className="h-5 w-2/3 rounded bg-[#E3CFA3]" />

            <div className="flex flex-col gap-1.5">
                <div className="h-3 w-full rounded bg-[#E3CFA3]" />
                <div className="h-3 w-full rounded bg-[#E3CFA3]" />
                <div className="h-3 w-4/5 rounded bg-[#E3CFA3]" />
            </div>

            <div className="h-4 w-32 rounded bg-[#E3CFA3] mt-1" />
        </div>
    </div>
);

// ============================================================
// ERA CARD
// ============================================================

const EraCard = memo(({ era }: { era: HomePageItem }) => {
    const navigate = useNavigate();
    const [imageLoaded, setImageLoaded] = useState(!era.image?.url);

    return (
        <motion.div
            variants={cardVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onClick={() => navigate(`/era/${era._id}`)}
            className="group w-[350px] max-w-full flex flex-col bg-[#F5E6C8] rounded-lg
            border border-gray-400 cursor-pointer overflow-hidden
            transition-shadow duration-300 hover:shadow-xl hover:border-[#8C6A43]"
        >
            {/* IMAGE */}
            <div className="relative h-[200px] w-full overflow-hidden bg-[#E3CFA3]">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-[#E3CFA3]" />
                )}

                {era.image?.url && (
                    <img
                        src={era.image.url}
                        alt={era.name ?? ""}
                        loading="lazy"
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImageLoaded(true)}
                        className={`h-full w-full object-cover transition-all duration-700
                        group-hover:scale-110
                        ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                    />
                )}
            </div>

            {/* CONTENT */}
            <div className="w-full p-2 flex flex-col flex-1 mt-2 gap-1">
                <h4 className="text-gray-900 font-semibold text-[1.1em]">
                    {era.name}
                </h4>

                <p className="text-[14px] text-gray-700 line-clamp-3">
                    {era.description}
                </p>

                <Link
                    to={`/era/${era._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="text-[14px] flex flex-row gap-2 items-center text-[#3E3025]
                    font-semibold mt-auto pt-1 cursor-pointer transition-opacity duration-200
                    hover:opacity-80 active:opacity-60 underline"
                >
                    Explore this Era
                    <i
                        className="fa-solid fa-arrow-up-right-from-square
                        transition-transform duration-300
                        group-hover:translate-x-1 group-hover:-translate-y-1"
                    ></i>
                </Link>
            </div>
        </motion.div>
    );
});

// ============================================================
// SECTION
// ============================================================

const CivilisationsSection = () => {
    const { homePage, loadingHomePage } = useHomePageContext();

    const eras = homePage?.featuredEras ?? [];

    if (!loadingHomePage && eras.length === 0) return null;

    return (
        <section className="flex flex-col w-full items-center px-5 py-10 bg-[#F8F5EF]"
        id="civilizations"
        >
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-gray-950 text-[1.7em] font-bold text-center"
            >
                Explore Ancient Civilizations
            </motion.h2>

            {/* Trait décoratif qui se dessine */}
            <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className="h-[2px] w-24 bg-[#8C6A43] mt-2 origin-center"
            />

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
                className="text-gray-700 text-center w-[500px] mt-3 max-[550px]:w-[320px]"
            >
                Discover the great civilizations of the ancient world,
                from their origins and remarkable achievements to the
                legacies that continue to shape our world.
            </motion.p>

            {/* GRID */}
            {loadingHomePage ? (
                <div
                    className="grid grid-cols-1 min-lg:grid-cols-2 min-xl:grid-cols-3
                    min-2xl:grid-cols-4 gap-5 mt-10"
                >
                    {Array.from({ length: 4 }).map((_, i) => (
                        <EraCardSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid grid-cols-1 min-lg:grid-cols-2 min-xl:grid-cols-3
                    min-2xl:grid-cols-4 gap-5 mt-10"
                >
                    {eras.map((era) => (
                        <EraCard key={era._id} era={era} />
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
                        to="/eras"
                        className="inline-block px-4 py-2 bg-[#8C6A43] text-gray-200 rounded-lg
                        text-[14px] cursor-pointer font-semibold"
                    >
                        Explore All Eras
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(CivilisationsSection);