import { memo, useMemo } from "react";
import type { HistoricalFigure } from "../../Types/Types";
 // ← ajuste le chemin
import SectionHeading from "./SectionHeading";
import ArticleContents from "../LearnComponents/ArticleComponents/ArticleContents";

const Biography = ({ figure }: { figure: HistoricalFigure }) => {
    const sections = figure.biography ?? [];

    const toc = useMemo(
        () => sections.map((section) => ({ title: section.title })),
        [sections]
    );

    if (sections.length === 0) return null;

    return (
        <section
            aria-labelledby="figure-biography-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <SectionHeading id="figure-biography-title" title="Biography" />

            {/* Sommaire en haut sur mobile / tablette */}
            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 min-lg:hidden">
                <ArticleContents sections={toc} title="In this biography" />
            </div>

            <div className="mt-8 flex gap-10">
                {/* Sommaire sticky sur desktop, avec suivi de la section lue */}
                <aside className="hidden w-[200px] shrink-0 min-lg:block">
                    <div className="sticky top-24">
                        <ArticleContents
                            sections={toc}
                            trackActive
                            title="In this biography"
                        />
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
    );
};

export default memo(Biography);