import { memo, useRef } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

// ============================================================
// IMAGE (Cloudinary : format et qualité automatiques + tailles)
// ============================================================

const IMG_BASE = "https://res.cloudinary.com/dub4fhabm/image/upload";
const IMG_PATH = "v1792176222/bgGreece_awhn6s.jpg";
const img = (width: number) => `${IMG_BASE}/f_auto,q_auto,w_${width}/${IMG_PATH}`;

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.14, delayChildren: 0.2 },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.7, ease: "easeOut" },
    },
};

// ============================================================
// DECORATIONS
// ============================================================

// Frise grecque (méandre) en bas de la Hero
const GreekKey = () => (
    <svg
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-3 w-full text-[#B08D57]/60"
        preserveAspectRatio="none"
    >
        <defs>
            <pattern
                id="hero-greek-key"
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
        <rect width="100%" height="100%" fill="url(#hero-greek-key)" />
    </svg>
);

// ============================================================
// HERO
// ============================================================

const Hero = () => {
    const sectionRef = useRef<HTMLElement>(null);
    const reduceMotion = useReducedMotion();

    const scrollToNext = () => {
        sectionRef.current?.nextElementSibling?.scrollIntoView({
            behavior: reduceMotion ? "auto" : "smooth",
        });
    };

    return (
        <section
            ref={sectionRef}
            id="home"
            aria-labelledby="hero-title"
            className="relative isolate flex min-h-[650px] w-full items-center justify-center overflow-hidden"
        >
            {/* IMAGE DE FOND (vrai <img> : chargement plus rapide qu'un background CSS) */}
            <motion.img
                src={img(1280)}
                srcSet={`${img(768)} 768w, ${img(1280)} 1280w, ${img(1920)} 1920w`}
                sizes="100vw"
                alt=""
                aria-hidden="true"
                decoding="async"
                initial={{ scale: reduceMotion ? 1 : 1.12 }}
                animate={{ scale: 1 }}
                transition={{ duration: 2.6, ease: "easeOut" }}
                className="absolute inset-0 -z-20 h-full w-full object-cover object-center"
            />

            {/* VOILE CHAUD aux couleurs d'Ancient Wisdom + vignettage */}
            <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#1a120b]/80 via-[#3E3025]/55 to-[#1a120b]/85" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.45)_100%)]" />

            {/* CONTENU */}
            <motion.div
                variants={containerVariants}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                className="relative z-10 flex w-full max-w-3xl flex-col items-center gap-4 px-5 pt-20 pb-28 text-center"
            >
                {/* Eyebrow */}
                <motion.p
                    variants={itemVariants}
                    className="flex items-center gap-3 text-[12px] font-semibold uppercase tracking-[0.3em] text-[#E9D8B4]"
                >
                    <span className="h-px w-8 bg-[#B08D57]" />
                    Ancient History, Explained
                    <span className="h-px w-8 bg-[#B08D57]" />
                </motion.p>

                {/* H1 */}
                <motion.h1
                    id="hero-title"
                    variants={itemVariants}
                    className="font-['Playfair_Display'] font-black text-[#B08D57]
                    text-[clamp(2rem,6vw,3.75rem)] leading-tight
                    drop-shadow-[0_2px_12px_rgba(0,0,0,0.5)]"
                >
                    Welcome to Ancient Wisdom
                </motion.h1>

                {/* Ornement */}
                <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.9, delay: 0.6, ease: "easeOut" }}
                    className="flex items-center gap-3 text-[#B08D57]"
                >
                    <span className="h-px w-14 bg-current/60" />
                    <span className="h-2 w-2 rotate-45 border border-current" />
                    <span className="h-px w-14 bg-current/60" />
                </motion.div>

                {/* Sous-titre */}
                <motion.p
                    variants={itemVariants}
                    className="font-['Playfair_Display'] italic text-white
                    text-[clamp(1.2rem,3.2vw,1.8rem)] leading-snug max-w-xl"
                >
                    Discover the Stories That Shaped Human History
                </motion.p>

                {/* Slogan */}
                <motion.p
                    variants={itemVariants}
                    className="font-semibold tracking-wide text-[#E9D8B4]
                    text-[clamp(1rem,2.4vw,1.2rem)]"
                >
                    Your #1 Companion in Learning from the Past.
                </motion.p>

                {/* Description */}
                <motion.p
                    variants={itemVariants}
                    className="max-w-2xl text-[clamp(0.95rem,2vw,1.1rem)] leading-relaxed text-gray-200/90"
                >
                    Explore ancient civilizations, legendary historical figures,
                    pivotal events, and remarkable monuments. Journey through the
                    past with in-depth articles, interactive quizzes, and history
                    games designed to make learning unforgettable.
                </motion.p>

                {/* CTA */}
                <motion.div
                    variants={itemVariants}
                    className="mt-3 flex items-center justify-center gap-3 max-[500px]:w-full max-[500px]:flex-col"
                >
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="max-[500px]:w-full max-[500px]:max-w-[260px]"
                    >
                        <Link
                            to="/explore"
                            className="group flex min-w-[190px] items-center justify-center gap-2
                            rounded-lg border border-[#B08D57] bg-[#B08D57] px-6 py-3
                            text-[15px] font-semibold text-[#1a120b]
                            transition-colors duration-300 hover:bg-[#C9A66B] hover:border-[#C9A66B]"
                        >
                            Explore History
                            <ArrowRight
                                size={17}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                        </Link>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="max-[500px]:w-full max-[500px]:max-w-[260px]"
                    >
                        <Link
                            to="/games"
                            className="flex min-w-[190px] items-center justify-center gap-2
                            rounded-lg border border-[#F5E6C8]/60 bg-black/30 px-6 py-3
                            text-[15px] font-semibold text-[#F5E6C8] backdrop-blur-sm
                            transition-colors duration-300 hover:bg-[#F5E6C8]/15"
                        >
                            Test Your Knowledge
                        </Link>
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* INDICATEUR DE SCROLL */}
            <motion.button
                type="button"
                onClick={scrollToNext}
                aria-label="Scroll to the next section"
                initial={{ opacity: 0 }}
                animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: [0, 8, 0] }}
                transition={
                    reduceMotion
                        ? { delay: 1.4 }
                        : {
                              opacity: { delay: 1.4, duration: 0.6 },
                              y: { delay: 1.4, duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                          }
                }
                className="absolute bottom-7 left-1/2 -translate-x-1/2 cursor-pointer
                text-[#E9D8B4] transition-colors hover:text-white"
            >
                <ChevronDown size={26} />
            </motion.button>

            <GreekKey />
        </section>
    );
};

export default memo(Hero);