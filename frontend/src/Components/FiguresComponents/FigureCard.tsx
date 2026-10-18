import { memo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import type { HistoricalFigure } from "../../Types/Types";

const MAX_ERAS = 3;

interface FigureCardProps {
    figure: HistoricalFigure;
    index?: number; // optionnel : décale l'apparition des cartes
}

const FigureCard = ({ figure, index = 0 }: FigureCardProps) => {
    const [imageLoaded, setImageLoaded] = useState(false);

    const imageUrl = figure.image?.url;
    const eras = figure.eras ?? [];
    const visibleEras = eras.slice(0, MAX_ERAS);
    const hiddenErasCount = eras.length - visibleEras.length;

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                duration: 0.5,
                ease: "easeOut",
                delay: (index % 4) * 0.08,
            }}
            className="group relative flex h-full w-[300px] max-w-full flex-col items-center
            rounded-lg border border-[#D8CDBD] bg-[#F8F5EF] p-5
            shadow-md transition-[box-shadow,border-color] duration-300
            hover:border-[#8C6A43] hover:shadow-xl
            focus-within:ring-2 focus-within:ring-[#8C6A43]/60"
        >
            {/* NICHE EN ARCHE */}
            <div className="flex flex-col items-center">
                <div
                    className="h-[220px] w-[180px] rounded-t-[999px] border border-[#3E3025]/40 p-1.5
                    transition-colors duration-500 group-hover:border-[#8C6A43]"
                >
                    <div className="relative h-full w-full overflow-hidden rounded-t-[999px] bg-[#E3CFA3]">
                        {imageUrl && (
                            <>
                                {!imageLoaded && (
                                    <div className="absolute inset-0 animate-pulse bg-[#E3CFA3]" />
                                )}
                                <img
                                    src={imageUrl}
                                    alt={`Portrait of ${figure.name}`}
                                    loading="lazy"
                                    onLoad={() => setImageLoaded(true)}
                                    onError={() => setImageLoaded(true)}
                                    className={`h-full w-full object-cover object-top transition-all duration-700
                                    group-hover:scale-110
                                    ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Socle en pierre */}
                <div className="h-1.5 w-[180px] bg-[#3E3025]/80" />
                <div className="h-1 w-[166px] bg-[#3E3025]/40" />
            </div>

            {/* NOM (stretched link : toute la carte est cliquable avec un seul vrai lien) */}
            <h3 className="mt-5 text-center font-['Playfair_Display'] text-[1.3em] font-bold leading-tight text-[#3E3025]">
                <Link
                    to={`/figure/${figure._id}`}
                    className="outline-none after:absolute after:inset-0 after:content-['']"
                >
                    {figure.name}
                </Link>
            </h3>

            {/* ÈRES */}
            {eras.length > 0 && (
                <ul className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {visibleEras.map((era, i) => (
                        <li
                            key={`${era.name}-${i}`}
                            className="rounded-full border border-[#8C6A43]/40 bg-[#F5E6C8]
                            px-2.5 py-0.5 text-[12px] font-semibold text-[#7A5F3A]"
                        >
                            {era.name}
                        </li>
                    ))}

                    {hiddenErasCount > 0 && (
                        <li
                            className="rounded-full border border-[#8C6A43]/40 px-2.5 py-0.5
                            text-[12px] font-semibold text-[#7A5F3A]"
                        >
                            +{hiddenErasCount}
                        </li>
                    )}
                </ul>
            )}

            {/* CTA */}
            <span
                className="mt-auto flex w-full items-center justify-center gap-2 rounded-md
                bg-[#3E3025] px-3 py-2 text-[14px] font-semibold text-[#F8F5EF]
                transition-colors duration-300 group-hover:bg-[#8C6A43]"
                style={{ marginTop: "1.25rem" }}
            >
                Read biography
                <i className="fa-solid fa-arrow-right-long transition-transform duration-300 group-hover:translate-x-1.5"></i>
            </span>
        </motion.article>
    );
};

export default memo(FigureCard);