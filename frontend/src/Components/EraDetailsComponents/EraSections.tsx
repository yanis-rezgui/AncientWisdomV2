import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { HistoricalEra } from "../../Types/Types";
import { useFiguresContext } from "../../Contexts/FiguresContext";
import { useEventContext } from "../../Contexts/EventContext";
import SectionHeading from "../FigureDetailsComponents/SectionHeading";
import ArticleContents from "../LearnComponents/ArticleComponents/ArticleContents";

const ctaClass =
    "shrink-0 flex items-center justify-center gap-2 rounded-md bg-[#3E3025] px-4 py-2 " +
    "text-[15px] font-semibold text-white transition-opacity duration-200 " +
    "hover:opacity-80 active:opacity-60";

const EraSections = ({ era }: { era: HistoricalEra }) => {
    const { figuresFilter, setFiguresFilter } = useFiguresContext();
    const { eventsFilter, setEventsFilter } = useEventContext();

    const sections = era.sections ?? [];

    const toc = useMemo(
        () => sections.map((section) => ({ title: section.title })),
        [sections]
    );

    return (
        <>
            {sections.length > 0 && (
                <section
                    aria-labelledby="era-story-title"
                    className="mx-auto mt-10 w-full max-w-[900px] px-4"
                >
                    <SectionHeading id="era-story-title" title="The Story of the Era" />

                    {/* Sommaire en haut sur mobile / tablette */}
                    <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 min-lg:hidden">
                        <ArticleContents sections={toc} title="In this era" />
                    </div>

                    <div className="mt-8 flex gap-10">
                        {/* Sommaire sticky sur desktop */}
                        <aside className="hidden w-[200px] shrink-0 min-lg:block">
                            <div className="sticky top-24">
                                <ArticleContents sections={toc} trackActive title="In this era" />
                            </div>
                        </aside>

                        <div className="min-w-0 flex-1 divide-y divide-gray-200">
                            {sections.map((section, i) => (
                                <article
                                    key={`${section.title}-${i}`}
                                    id={`section-${i}`}
                                    className="scroll-mt-24 py-8 first:pt-0 last:pb-0"
                                >
                                    <h3 className="text-[1.3em] font-semibold text-[#3E3025]">
                                        {section.title}
                                    </h3>

                                    <div className="mt-3 flex flex-col gap-4">
                                        {section.content
                                            .trim()
                                            .split(/\n{2,}/)
                                            .map((paragraph, j) => (
                                                <p
                                                    key={j}
                                                    className="text-[17px] leading-8 text-gray-800"
                                                >
                                                    {paragraph}
                                                </p>
                                            ))}
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <section
                aria-labelledby="era-explore-title"
                className="mx-auto mb-10 mt-10 w-full max-w-[900px] px-4"
            >
                <SectionHeading id="era-explore-title" title={`Explore ${era.name}`} />

                <div className="mt-6 grid grid-cols-1 gap-4 min-[750px]:grid-cols-2">
                    <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5">
                        <p className="text-gray-700">
                            Meet the people who shaped this era.
                        </p>
                        <Link
                            to="/figures"
                            onClick={() =>
                                setFiguresFilter({ ...figuresFilter, era: era._id })
                            }
                            className={ctaClass}
                        >
                            Explore key figures
                            <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="flex flex-col justify-between gap-4 rounded-lg border border-gray-200 bg-white p-5">
                        <p className="text-gray-700">
                            Discover the major events that marked this era.
                        </p>
                        <Link
                            to="/events"
                            onClick={() =>
                                setEventsFilter({ ...eventsFilter, era: era._id })
                            }
                            className={ctaClass}
                        >
                            Explore key events
                            <ArrowRight size={17} aria-hidden="true" />
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
};

export default memo(EraSections);