import { memo, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";

import { useArticleContext } from "../../Contexts/ArticleContext";
import ArticleContents from "../../Components/LearnComponents/ArticleComponents/ArticleContents";
import ReadingProgress from "../../Components/LearnComponents/ArticleComponents/ReadingProgress";

const WORDS_PER_MINUTE = 200;

const ArticleDetails = () => {
    const { id } = useParams<{ id: string }>();

    const { currentArticle, getArticle, loadingArticle, errorMsg } =
        useArticleContext();

    // Load the article and start at the top of the page
    useEffect(() => {
        if (!id) return;

        window.scrollTo({ top: 0 });
        void getArticle(id);
    }, [id, getArticle]);

    // Ignore a previously opened article while the new one loads
    const article = currentArticle?._id === id ? currentArticle : null;

    const era =
        article && typeof article.era === "object" && article.era !== null
            ? article.era
            : null;

    const readingTime = useMemo(() => {
        if (!article) return 0;

        const text = [
            article.description,
            ...article.sections.map((s) => `${s.title} ${s.content}`),
        ].join(" ");

        const words = text.trim().split(/\s+/).length;
        return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
    }, [article]);

    const publishedDate = article
        ? new Date(article.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "";

    const backLink = (
        <Link
            to="/learn/articles"
            className="p-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
            items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
            w-fit"
        >
            <i className="fa-solid fa-arrow-left"></i> Back to Articles
        </Link>
    );

    /* ---------- Loading ---------- */
    if (loadingArticle || (!article && !errorMsg)) {
        return (
            <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6] px-5 pt-10 pb-10">
                <div className="w-full max-w-[760px] flex flex-col gap-4">
                    <div className="h-[40px] w-[160px] rounded-lg bg-gray-300/60 animate-pulse" />
                    <div className="h-[340px] max-[550px]:h-[220px] rounded-lg bg-gray-300/60 animate-pulse" />
                    <div className="h-[36px] w-[80%] rounded-lg bg-gray-300/60 animate-pulse" />
                    <div className="h-[18px] w-full rounded-lg bg-gray-300/60 animate-pulse" />
                    <div className="h-[18px] w-[90%] rounded-lg bg-gray-300/60 animate-pulse" />
                </div>
            </section>
        );
    }

    /* ---------- Error / not found ---------- */
    if (!article) {
        return (
            <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6] px-5 pt-10 gap-4">
                <p className="text-center text-[15px] text-red-700">
                    {errorMsg || "This article could not be found."}
                </p>
                {backLink}
            </section>
        );
    }

    /* ---------- Article ---------- */
    return (
        <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6] px-5 pt-10 pb-12">
            <ReadingProgress />

            <div className="w-full max-w-[1000px] flex flex-col gap-6">
                {backLink}

                {/* Hero */}
                <header className="flex flex-col gap-3">
                    <img
                        src={article.image?.url}
                        alt={article.title}
                        className="w-full h-[340px] max-[550px]:h-[220px] object-cover rounded-lg sepia-[0.2] shadow-lg"
                    />

                    <div className="flex flex-row flex-wrap items-center gap-2">
                        {era && (
                            <Link
                                to={`/era/${era._id}`}
                                className="py-1 px-3 rounded-full bg-gray-600 text-white text-[12px]
                                transition-opacity duration-200 hover:opacity-80"
                            >
                                {era.name}
                            </Link>
                        )}

                        <span className="text-[13px] text-gray-700">
                            {publishedDate} · {readingTime} min read
                        </span>
                    </div>

                    <h1 className="font-serif text-[2em] max-[550px]:text-[1.6em] font-bold text-gray-950 leading-tight">
                        {article.title}
                    </h1>

                    <p className="font-serif text-[1.1em] text-gray-800 leading-7 max-w-[680px]">
                        {article.description}
                    </p>

                    {article.tags?.length > 0 && (
                        <div className="flex flex-row flex-wrap gap-2">
                            {article.tags.map((t) => (
                                <span
                                    key={t}
                                    className="py-1 px-3 rounded-full bg-white text-[#3E3025] text-[12px] font-semibold"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    )}
                </header>

                {/* Mobile table of contents */}
                {article.sections.length > 1 && (
                    <div className="min-[900px]:hidden bg-gray-50 rounded-lg shadow-md p-3">
                        <ArticleContents sections={article.sections} />
                    </div>
                )}

                {/* Body */}
                <div className="flex flex-row gap-10 items-start border-t border-t-gray-400 pt-6">
                    {article.sections.length > 1 && (
                        <aside className="max-[900px]:hidden w-[240px] shrink-0 sticky top-24">
                            <ArticleContents
                                sections={article.sections}
                                trackActive
                            />
                        </aside>
                    )}

                    <article className="flex flex-col gap-8 w-full max-w-[680px]">
                        {article.sections.map((s, i) => (
                            <section
                                key={i}
                                id={`section-${i}`}
                                className="flex flex-col gap-3 scroll-mt-24"
                            >
                                <h2 className="font-serif text-[1.45em] max-[550px]:text-[1.3em] font-semibold text-gray-950 leading-tight">
                                    {s.title}
                                </h2>

                                {s.content
                                    .split(/\n+/)
                                    .filter((p) => p.trim().length > 0)
                                    .map((p, j) => (
                                        <p
                                            key={j}
                                            className="font-serif text-[1.05em] text-gray-800 leading-8"
                                        >
                                            {p}
                                        </p>
                                    ))}
                            </section>
                        ))}

                        {/* End of article */}
                        <div className="flex flex-row flex-wrap gap-2 pt-6 border-t border-t-gray-400">
                            <Link
                                to="/learn/articles"
                                className="p-2 bg-[#3E3025] text-white font-semibold text-[14px] rounded-lg flex flex-row gap-2
                                items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                            >
                                <i className="fa-solid fa-arrow-left"></i> More Articles
                            </Link>

                            {era && (
                                <Link
                                    to={`/era/${era._id}`}
                                    className="p-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
                                    items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                                >
                                    <i className="fa-solid fa-arrow-up-right-from-square"></i> Explore {era.name}
                                </Link>
                            )}
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};

export default memo(ArticleDetails);