import { memo, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Link } from "react-router-dom";

const learningPaths = [
    {
        title: "Frames",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791794990/98af560e-eeb0-4873-83cf-2c8969a76777.png",
        description:
            "Explore historical monuments, statues, and maps that preserve the legacy of past civilizations.",
        link: "/learn/frames",
        cta: "Explore Collection",
    },
    {
        title: "Articles",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791796566/ac4e1cda-c756-473a-9c93-40fdbfa62674.png",
        description:
            "Uncover the events, people, and ideas that shaped civilizations and transformed the course of history.",
        link: "/learn/articles",
        cta: "Read Articles",
    },
    {
        title: "Guides",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791795005/977ae36f-2e91-44fd-8ba5-b5dfb7cc4772.png",
        description:
            "Follow structured learning paths to understand historical periods, civilizations, and defining events.",
        link: "/learn/guides",
        cta: "Start Learning",
    },
    {
        title: "Books",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791795017/13337b8a-bbba-4b23-8f50-0ac9588b138a.png",
        description:
            "Dive into historical literature and discover books that deepen your understanding of the past.",
        link: "/learn/books",
        cta: "Discover Books",
    },
    {
        title: "Movies",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791795031/fd85ea11-0a11-4151-90be-e5c5b8321f01.png",
        description:
            "Experience history through cinema and explore the stories behind historical films and their real-world inspirations.",
        link: "/learn/movies",
        cta: "Explore Movies",
    },
];

type LearningPath = (typeof learningPaths)[number];

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

// ============================================================
// CARD
// ============================================================

const LearnPathCard = memo(({ path }: { path: LearningPath }) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    return (
        <motion.li
            variants={cardVariants}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative flex flex-col list-none
            w-full max-w-[420px]
            min-[560px]:w-[calc(50%-10px)] min-[560px]:max-w-none
            min-lg:w-[calc(33.333%-14px)]
            min-2xl:w-[calc(20%-16px)]
            bg-[#F5E6C8] rounded-lg border border-gray-400 overflow-hidden
            transition-shadow duration-300 hover:shadow-xl hover:border-[#8C6A43]"
        >
            <div className="relative h-[150px] w-full overflow-hidden bg-[#E3CFA3]">
                {!imageLoaded && (
                    <div className="absolute inset-0 animate-pulse bg-[#E3CFA3]" />
                )}
                <img
                    src={path.image}
                    alt={`Illustration of the ${path.title} learning path`}
                    loading="lazy"
                    onLoad={() => setImageLoaded(true)}
                    onError={() => setImageLoaded(true)}
                    className={`h-full w-full object-cover transition-all duration-700
                    group-hover:scale-110
                    ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                />
            </div>

            <div className="flex flex-col flex-1 p-4 gap-1">
                <h3 className="text-gray-900 font-semibold text-[1.15em]">
                    <Link
                        to={path.link}
                        className="after:absolute after:inset-0 after:content-['']"
                    >
                        {path.title}
                    </Link>
                </h3>

                <p className="text-[14px] text-gray-700">{path.description}</p>

                <span
                    className="text-[14px] flex flex-row gap-2 items-center text-[#3E3025]
                    font-semibold mt-auto pt-3"
                >
                    {path.cta}
                    <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1.5"
                    >
                        →
                    </span>
                </span>
            </div>
        </motion.li>
    );
});

// ============================================================
// SECTION
// ============================================================

const LearnPaths = () => {
    return (
        <section
            aria-labelledby="learn-paths-title"
            className="flex flex-col w-full items-center px-5 py-10 bg-[#F8F5EF]"
            id="LearnPaths"
        >
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-[12px] font-semibold uppercase tracking-[0.3em] text-[#8C6A43]"
            >
                Learn
            </motion.p>

            <motion.h2
                id="learn-paths-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                className="text-gray-950 text-[1.7em] font-bold text-center mt-2"
            >
                Explore the Ancient World Your Way
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
                className="text-gray-700 text-center w-[600px] mt-3 max-[660px]:w-[320px]"
            >
                Browse historical frames, read in-depth articles, follow
                structured guides, and discover the books and films that bring
                the past to life.
            </motion.p>

            <motion.ul
                variants={listVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                className="mt-10 flex w-full max-w-[1200px] flex-wrap justify-center gap-5"
            >
                {learningPaths.map((path) => (
                    <LearnPathCard key={path.title} path={path} />
                ))}
            </motion.ul>
        </section>
    );
};

export default memo(LearnPaths);