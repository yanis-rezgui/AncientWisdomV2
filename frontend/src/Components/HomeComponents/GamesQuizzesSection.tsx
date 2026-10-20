import { memo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";
import { useGamesContext } from "../../Contexts/GamesContexts/GamesContext";
import { useQuizContext } from "../../Contexts/QuizContext";
import type { Game, GameType } from "../../Types/Games";

// ============================================================
// FEATURES (textes SEO fixes)
// ============================================================

interface Feature {
    id: string;
    gameType: GameType | null; // null = quizzes
    title: string;
    description: string;
    icon: string;
    cta: string;
}

const FEATURES: Feature[] = [
    {
        id: "figure",
        gameType: "guess-the-figure",
        title: "Guess the Figure",
        description:
            "Identify historical personalities from clues about their lives and achievements.",
        icon: "fa-user",
        cta: "Play Now",
    },
    {
        id: "landmark",
        gameType: "name-the-landmark",
        title: "Name the Landmark",
        description:
            "Test your knowledge of famous monuments and archaeological sites.",
        icon: "fa-landmark",
        cta: "Play Now",
    },
    {
        id: "quizzes",
        gameType: null,
        title: "History Quizzes",
        description:
            "Answer questions about ancient civilizations, historical events, and influential leaders.",
        icon: "fa-circle-question",
        cta: "Take a Quiz",
    },
];

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
// FEATURE CARD
// ============================================================

interface FeatureCardProps {
    feature: Feature;
    game?: Game;
    loading: boolean;
    quizCount: number;
}

const FeatureCard = memo(
    ({ feature, game, loading, quizCount }: FeatureCardProps) => {
        const [imageLoaded, setImageLoaded] = useState(false);

        const isQuiz = feature.gameType === null;
        const imageUrl = game?.image?.url;

        const to = isQuiz ? "/quizzes" : game ? `/game/${game._id}` : "/games";

        // Label au-dessus du titre
        let meta = isQuiz ? "Quiz" : "Game";

        if (isQuiz && quizCount > 0) {
            meta = `Quizzes · ${quizCount} available`;
        }

        if (!isQuiz && game) {
            meta = [
                "Game",
                game.difficulty,
                game.estimatedDuration ? `${game.estimatedDuration} min` : "",
            ]
                .filter(Boolean)
                .join(" · ");
        }

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
                {/* VISUEL */}
                <div className="relative h-[190px] w-full overflow-hidden bg-[#3E3025]">
                    {imageUrl ? (
                        <>
                            {!imageLoaded && (
                                <div className="absolute inset-0 animate-pulse bg-[#E3CFA3]" />
                            )}
                            <img
                                src={imageUrl}
                                alt={`Illustration of the ${feature.title} history game`}
                                loading="lazy"
                                onLoad={() => setImageLoaded(true)}
                                onError={() => setImageLoaded(true)}
                                className={`h-full w-full object-cover transition-all duration-700
                                group-hover:scale-110
                                ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                            />
                        </>
                    ) : !isQuiz && loading ? (
                        <div className="absolute inset-0 animate-pulse bg-[#E3CFA3]" />
                    ) : (
                        // Panneau d'icône (quiz, ou jeu sans image)
                        <div
                            aria-hidden="true"
                            className="relative flex h-full w-full items-center justify-center"
                        >
                            <span className="absolute h-36 w-36 rounded-full border border-[#C9A66B]/25 transition-transform duration-700 group-hover:scale-125" />
                            <span className="absolute h-24 w-24 rounded-full border border-[#C9A66B]/40 transition-transform duration-700 group-hover:scale-125" />
                            <i
                                className={`fa-solid ${feature.icon} text-[2.6em] text-[#C9A66B]
                                transition-transform duration-500 group-hover:scale-110`}
                            ></i>
                        </div>
                    )}
                </div>

                {/* CONTENU */}
                <div className="flex flex-col flex-1 p-4 gap-1">
                    {loading ? (
                        <div className="h-3 w-1/2 rounded bg-[#E3CFA3] animate-pulse" />
                    ) : (
                        <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#8C6A43]">
                            {meta}
                        </p>
                    )}

                    <h3 className="text-gray-900 font-semibold text-[1.2em]">
                        {/* Stretched link : toute la carte est cliquable avec un seul vrai lien */}
                        <Link
                            to={to}
                            className="after:absolute after:inset-0 after:content-['']"
                        >
                            {feature.title}
                        </Link>
                    </h3>

                    <p className="text-[14px] text-gray-700">
                        {feature.description}
                    </p>

                    <span
                        className="text-[14px] flex flex-row gap-2 items-center text-[#3E3025]
                        font-semibold mt-auto pt-3"
                    >
                        {feature.cta}
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
    }
);

// ============================================================
// SECTION
// ============================================================

const GamesQuizzesSection = () => {
    const { games, loadingGames } = useGamesContext();
    const { totalQuizzes, loadingQuizzes } = useQuizContext();

    return (
        <section
        id="games"
            aria-labelledby="games-quizzes-title"
            className="flex flex-col w-full items-center px-5 py-10 bg-[#F8F5EF]"
        >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#8C6A43]"
            >
                History Games &amp; Quizzes
            </motion.p>

            <motion.h2
                id="games-quizzes-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-gray-950 text-[1.7em] font-bold text-center mt-2"
            >
                Learn History Through Games and Quizzes
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
                className="text-gray-700 text-center w-[600px] mt-3 max-[660px]:w-[320px]"
            >
                How well do you know the ancient world? Challenge yourself with
                interactive history quizzes and games that put your knowledge of
                historical figures, landmarks, and civilizations to the test.
            </motion.p>

            {/* CARTES */}
            <motion.div
                variants={gridVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                className={GRID_CLASSES}
            >
                {FEATURES.map((feature) => (
                    <FeatureCard
                        key={feature.id}
                        feature={feature}
                        game={games.find((g) => g.gameType === feature.gameType)}
                        loading={feature.gameType === null ? loadingQuizzes : loadingGames}
                        quizCount={totalQuizzes}
                    />
                ))}
            </motion.div>

            {/* CTA : relie /games et /quizzes */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="mt-7 flex flex-wrap items-center justify-center gap-3"
            >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/games"
                        className="inline-block px-4 py-2 bg-[#8C6A43] text-gray-200 rounded-lg
                        text-[14px] cursor-pointer font-semibold"
                    >
                        Play History Games →
                    </Link>
                </motion.div>

                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link
                        to="/quizzes"
                        className="inline-block px-4 py-2 border border-[#8C6A43] text-[#3E3025]
                        rounded-lg text-[14px] cursor-pointer font-semibold
                        transition-colors duration-300 hover:bg-[#8C6A43]/10"
                    >
                        Take a History Quiz →
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default memo(GamesQuizzesSection);