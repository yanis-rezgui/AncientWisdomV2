import { memo, useMemo } from "react";
import { Link } from "react-router-dom";
import type { HelpArticle } from "../../Types/HelpTypes";
import ArticleContents from "../LearnComponents/ArticleComponents/ArticleContents";

const HelpArticleContent = ({ article }: { article: HelpArticle }) => {
    const sections = useMemo(
        () => [...(article.sections ?? [])].sort((a, b) => a.order - b.order),
        [article.sections]
    );

    // Les ids `section-${i}` suivent l'index : on garde donc toutes les sections dans le sommaire
    const toc = useMemo(
        () => sections.map((s, i) => ({ title: s.heading || `Part ${i + 1}` })),
        [sections]
    );

    if (sections.length === 0) return null;

    // Un sommaire n'a d'intérêt que s'il y a plusieurs sections titrées
    const showToc = sections.filter((s) => s.heading).length >= 2;

    return (
        <section
            aria-label="Article content"
            className="mx-auto mb-10 mt-10 w-full max-w-[900px] px-4"
        >
            {showToc && (
                <div className="mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 min-lg:hidden">
                    <ArticleContents sections={toc} title="In this article" />
                </div>
            )}

            <div className="flex gap-10">
                {showToc && (
                    <aside className="hidden w-[200px] shrink-0 min-lg:block">
                        <div className="sticky top-24">
                            <ArticleContents sections={toc} trackActive title="In this article" />
                        </div>
                    </aside>
                )}

                <div className="min-w-0 flex-1 divide-y divide-gray-200">
                    {sections.map((section, i) => (
                        <article
                            key={`${section.heading ?? "section"}-${i}`}
                            id={`section-${i}`}
                            className="scroll-mt-24 py-8 first:pt-0 last:pb-0"
                        >
                            {section.heading && (
                                <h2 className="text-[1.3em] font-semibold text-[#3E3025]">
                                    {section.heading}
                                </h2>
                            )}

                            <div className={`flex flex-col gap-4 ${section.heading ? "mt-3" : ""}`}>
                                {section.content
                                    .trim()
                                    .split(/\n{2,}/)
                                    .map((paragraph, j) => (
                                        <p key={j} className="text-[17px] leading-8 text-gray-800">
                                            {paragraph}
                                        </p>
                                    ))}
                            </div>
                        </article>
                    ))}
                </div>
            </div>

            <div
                className="mt-10 flex flex-col items-start justify-between gap-4 rounded-lg border border-gray-200
                bg-white p-5 min-[620px]:flex-row min-[620px]:items-center"
            >
                <p className="text-gray-700">Didn't find what you were looking for?</p>
                <Link
                    to="/help"
                    className="shrink-0 rounded-md bg-[#3E3025] px-4 py-2 text-[15px] font-semibold text-white
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    Browse all articles →
                </Link>
            </div>
        </section>
    );
};

export default memo(HelpArticleContent);
