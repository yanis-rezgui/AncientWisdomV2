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

// Lit le premier champ texte/nombre non vide parmi une liste de clés possibles.
// ⚠️ Adapte les clés au schéma réel de tes events.
const pickText = (item: HomePageItem, keys: string[]): string => {
    for (const key of keys) {
        const value = item[key];
        if (typeof value === "string" && value.trim()) return value;
        if (typeof value === "number") return String(value);
    }
    return "";
};


const formatHistoricalDate = (value: unknown): string => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    // Les années historiques peuvent être stockées comme nombres.
    if (typeof value === "number") {
        return String(value);
    }

    if (typeof value !== "string") {
        return "";
    }

    const trimmedValue = value.trim();

    // Une année seule : 44, 476, 2026, -44.
    if (/^-?\d{1,6}$/.test(trimmedValue)) {
        return trimmedValue;
    }

    // Une date ISO : 2026-10-18 ou 2026-10-18T00:00:00.000Z.
    if (/^\d{4}-\d{2}-\d{2}(?:T.*)?$/.test(trimmedValue)) {
        const date = new Date(trimmedValue);

        if (!Number.isNaN(date.getTime())) {
            return new Intl.DateTimeFormat("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
            }).format(date);
        }
    }

    // Conserve les périodes textuelles comme "264–146 BC".
    return trimmedValue;
};

const getDate = (event: HomePageItem): string => {
    const startDate = event.startDate;
    const endDate = event.endDate;

    if (startDate !== undefined && startDate !== null && startDate !== "") {
        const start = formatHistoricalDate(startDate);
        const end = formatHistoricalDate(endDate);

        if (start && end && start !== end) {
            return `${start} – ${end}`;
        }

        return start || end;
    }

    return formatHistoricalDate(
        event.date ?? event.year ?? event.period ?? event.dateLabel
    );
};


const getContext = (event: HomePageItem): string =>
    pickText(event, ["context", "era", "civilization", "category", "location"]);

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
    "grid grid-cols-1 min-lg:grid-cols-3 justify-items-center gap-5 mt-10 w-full max-w-[1200px]";

// ============================================================
// SKELETON
// ============================================================

const EventCardSkeleton = () => (
    <div
        className="w-full max-w-[520px] min-lg:max-w-none bg-[#F5E6C8] rounded-lg
        border border-gray-400 p-5 animate-pulse"
    >
        <div className="h-9 w-1/3 rounded bg-[#E3CFA3]" />
        <div className="h-[2px] w-full bg-[#E3CFA3] mt-3" />

        <div className="h-3 w-1/2 rounded bg-[#E3CFA3] mt-4" />
        <div className="h-5 w-3/4 rounded bg-[#E3CFA3] mt-3" />

        <div className="flex flex-col gap-1.5 mt-4">
            <div className="h-3 w-full rounded bg-[#E3CFA3]" />
            <div className="h-3 w-full rounded bg-[#E3CFA3]" />
            <div className="h-3 w-4/5 rounded bg-[#E3CFA3]" />
        </div>

        <div className="h-4 w-28 rounded bg-[#E3CFA3] mt-5" />
    </div>
);

// ============================================================
// EVENT CARD
// ============================================================

const EventCard = memo(({ event }: { event: HomePageItem }) => {
    const title = event.title ?? event.name ?? "Historical event";
    const date = getDate(event);
    const context = getContext(event);

    return (
        <motion.article
            variants={cardVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex flex-col w-full max-w-[520px] min-lg:max-w-none
            bg-[#F5E6C8] rounded-lg border border-gray-400 p-5 overflow-hidden
            transition-shadow duration-300 hover:shadow-xl hover:border-[#8C6A43]"
        >
            {/* DATE — ancrage visuel de la carte */}
            {date && (
                <p className="text-[1em] leading-none font-bold text-[#8C6A43]">
                    {date}
                </p>
            )}

            {/* Trait qui se prolonge au survol */}
            <div className="relative mt-3 h-[2px] w-full bg-[#8C6A43]/25">
                <div
                    className="absolute left-0 top-0 h-full w-12 bg-[#8C6A43]
                    transition-all duration-500 group-hover:w-full"
                />
            </div>

            {context && (
                <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-600">
                    {context}
                </p>
            )}

            <h3 className="mt-1 text-gray-900 font-semibold text-[1.2em]">
                {/* Stretched link : toute la carte est cliquable avec un seul vrai lien */}
                <Link
                    to={`/event/${event._id}`}
                    className="after:absolute after:inset-0 after:content-['']"
                >
                    {title}
                </Link>
            </h3>

            <p className="mt-2 text-[14px] text-gray-700 line-clamp-4">
                {event.description}
            </p>

            <span
                className="text-[14px] flex flex-row gap-2 items-center text-[#3E3025]
                font-semibold mt-auto pt-4"
            >
                Explore Event
                <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1.5"
                >
                    →
                </span>
            </span>
        </motion.article>
    );
});

// ============================================================
// SECTION
// ============================================================

const FeaturedEvents = () => {
    const { homePage, loadingHomePage } = useHomePageContext();

    const events = homePage?.featuredEvents ?? [];

    if (!loadingHomePage && events.length === 0) return null;

    return (
        <section
            aria-labelledby="featured-events-title"
            className="flex flex-col w-full items-center px-5 py-10 bg-[#F8F5EF]"
        >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#8C6A43]"
            >
                Historical Events
            </motion.p>

            <motion.h2
                id="featured-events-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-gray-950 text-[1.7em] font-bold text-center mt-2"
            >
                Events That Changed the Course of History
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
                Explore the battles, political turning points, and defining
                moments that shaped ancient civilizations. Discover the stories
                behind the events that transformed kingdoms, reshaped empires,
                and influenced the course of history.
            </motion.p>

            {/* GRID */}
            {loadingHomePage ? (
                <div className={GRID_CLASSES}>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
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
                    {events.map((event) => (
                        <EventCard key={event._id} event={event} />
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
                        to="/events"
                        className="inline-block px-4 py-2 bg-[#8C6A43] text-gray-200 rounded-lg
                        text-[14px] cursor-pointer font-semibold"
                    >
                        Explore All Historical Events →
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(FeaturedEvents);