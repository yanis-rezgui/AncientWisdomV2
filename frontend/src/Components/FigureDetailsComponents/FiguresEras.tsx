import { memo } from "react";
import { Link } from "react-router-dom";
import type { HistoricalFigure } from "../../Types/Types";
import SectionHeading from "./SectionHeading";

const FiguresEras = ({ figure }: { figure: HistoricalFigure }) => {
    if (figure.eras.length === 0) return null;

    return (
        <section
            aria-labelledby="figure-eras-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <SectionHeading id="figure-eras-title" title={`Eras of ${figure.name}`} />

            <ul className="mt-6 grid grid-cols-1 gap-4 min-[620px]:grid-cols-2 min-[920px]:grid-cols-3">
                {figure.eras.map((era) => (
                    <li
                        key={era._id}
                        className="group relative flex flex-col justify-between gap-4 rounded-lg
                        border border-gray-200 bg-white p-5
                        transition-colors duration-300 hover:border-[#8C6A43]"
                    >
                        <h3 className="text-[1.1em] font-semibold leading-6 text-[#3E3025]">
                            {/* Stretched link : toute la carte est cliquable avec un seul vrai lien */}
                            <Link
                                to={`/era/${era._id}`}
                                className="after:absolute after:inset-0 after:content-['']"
                            >
                                {era.name}
                            </Link>
                        </h3>

                        <span className="flex items-center gap-2 text-[14px] font-semibold text-[#3E3025]">
                            Explore Era
                            <span
                                aria-hidden="true"
                                className="transition-transform duration-300 group-hover:translate-x-1"
                            >
                                →
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default memo(FiguresEras);