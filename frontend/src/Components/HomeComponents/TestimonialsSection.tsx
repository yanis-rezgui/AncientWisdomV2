import { memo, useMemo } from "react";
import { motion, type Variants } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useTestimonialsContext } from "../../Contexts/TestimonialsContext";
import type { Testimonial } from "../../Types/Types";

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const listVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

// Même largeur que les cartes de LearnPaths pour garder un rythme cohérent
const cardWidth = `w-full max-w-[420px]
    min-[560px]:w-[calc(50%-10px)] min-[560px]:max-w-none
    min-lg:w-[calc(33.333%-14px)]`;

// ============================================================
// SKELETON
// ============================================================

const TestimonialSkeleton = () => (
    <div
        className={`${cardWidth} flex flex-col gap-4 rounded-lg border border-gray-400
        bg-[#F5E6C8] p-5 animate-pulse`}
    >
        <div className="h-4 w-24 rounded bg-[#E3CFA3]" />
        <div className="flex flex-col gap-2">
            <div className="h-3 w-full rounded bg-[#E3CFA3]" />
            <div className="h-3 w-full rounded bg-[#E3CFA3]" />
            <div className="h-3 w-2/3 rounded bg-[#E3CFA3]" />
        </div>
        <div className="mt-2 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#E3CFA3]" />
            <div className="h-4 w-28 rounded bg-[#E3CFA3]" />
        </div>
    </div>
);

// ============================================================
// STARS
// ============================================================

const Stars = ({ rating }: { rating: number }) => {
    const safe = Math.min(5, Math.max(0, Math.round(rating)));

    return (
        <div
            className="flex flex-row gap-0.5"
            role="img"
            aria-label={`Rated ${safe} out of 5`}
        >
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    size={16}
                    aria-hidden="true"
                    className={
                        i < safe
                            ? "fill-[#8C6A43] text-[#8C6A43]"
                            : "fill-transparent text-[#C9B58A]"
                    }
                />
            ))}
        </div>
    );
};

// ============================================================
// CARD
// ============================================================

const TestimonialItem = memo(({ testimonial }: { testimonial: Testimonial }) => (
    <motion.li
        variants={cardVariants}
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className={`${cardWidth} list-none relative flex flex-col gap-4
        bg-[#F5E6C8] rounded-lg border border-gray-400 p-5
        transition-shadow duration-300 hover:shadow-xl hover:border-[#8C6A43]`}
    >
        <Quote
            size={28}
            aria-hidden="true"
            className="absolute right-4 top-4 text-[#8C6A43]/25"
        />

        <Stars rating={testimonial.rating} />

        <figure className="flex flex-1 flex-col gap-4">
            <blockquote className="flex-1 text-[14px] leading-6 text-gray-700">
                “{testimonial.message}”
            </blockquote>

            <figcaption className="flex flex-row items-center gap-3 border-t border-[#8C6A43]/30 pt-4">
                <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full
                    bg-[#3E3025] font-['Playfair_Display'] font-bold text-[#F5E6C8]"
                >
                    {testimonial.fullName.trim().charAt(0).toUpperCase()}
                </span>

                <span className="font-semibold text-gray-900 truncate">
                    {testimonial.fullName}
                </span>
            </figcaption>
        </figure>
    </motion.li>
));

// ============================================================
// SECTION
// ============================================================

const TestimonialsSection = () => {
    const { activeTestimonials, loadingActiveTestimonials } =
        useTestimonialsContext();

    // Données structurées schema.org (avis des utilisateurs)
    const jsonLd = useMemo(() => {
        if (activeTestimonials.length === 0) return null;

        const average =
            activeTestimonials.reduce((sum, t) => sum + t.rating, 0) /
            activeTestimonials.length;

        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Ancient Wisdom",
            aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: average.toFixed(1),
                reviewCount: activeTestimonials.length,
                bestRating: 5,
                worstRating: 1,
            },
        };
    }, [activeTestimonials]);

    if (!loadingActiveTestimonials && activeTestimonials.length === 0) return null;

    return (
        <section
            aria-labelledby="testimonials-title"
            className="flex flex-col w-full items-center px-5 py-10 bg-[#F8F5EF]"
            id="testimonials"
        >
            {jsonLd && (
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
                Testimonials
            </motion.p>

            <motion.h2
                id="testimonials-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-gray-950 text-[1.7em] font-bold text-center mt-2"
            >
                What Our Readers Say
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
                className="text-gray-700 text-center w-[560px] mt-3 max-[620px]:w-[320px]"
            >
                Hear from the curious minds who explore history, play our
                games and take our quizzes on Ancient Wisdom.
            </motion.p>

            {loadingActiveTestimonials ? (
                <div className="mt-10 flex w-full max-w-[1200px] flex-wrap justify-center gap-5">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <TestimonialSkeleton key={i} />
                    ))}
                </div>
            ) : (
                <motion.ul
                    variants={listVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="mt-10 flex w-full max-w-[1200px] flex-wrap justify-center gap-5"
                >
                    {activeTestimonials.map((t) => (
                        <TestimonialItem key={t._id} testimonial={t} />
                    ))}
                </motion.ul>
            )}
        </section>
    );
};

export default memo(TestimonialsSection);