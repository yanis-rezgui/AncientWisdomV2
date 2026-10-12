import { memo, useCallback } from "react";
import { Link } from "react-router-dom";

import { useArticleContext } from "../../Contexts/ArticleContext";
import ArticleCard from "../../Components/LearnComponents/ArticleComponents/ArticleCard";
import LearnSearch from "../../Components/LearnComponents/SharedComponents/LearnSearch";
import LearnPagination from "../../Components/LearnComponents/SharedComponents/LearnPagination";

const Articles = () => {
    const {
        articles,
        loadingAllArticles,
        page,
        setPage,
        totalPages,
        search,
        setSearch,
        errorMsg,
    } = useArticleContext();

    const handleSearch = useCallback(
        (value: string) => {
            setPage(1);
            setSearch(value);
        },
        [setPage, setSearch]
    );

    const handlePageChange = useCallback(
        (p: number) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [setPage]
    );

    const gridClass =
        "grid grid-cols-[repeat(auto-fill,minmax(290px,1fr))] max-[450px]:grid-cols-1 gap-5";

    return (
        <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6] pb-10">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-2 mt-10 px-5">
                <h3 className="text-[#3E3025] font-semibold text-center">
                    READ THE PAST
                </h3>

                <h1 className="text-[1.5em] font-bold text-gray-800 text-center">
                    Stories, People, and Ideas That Shaped History
                </h1>

                <p
                    className="w-[500px] text-center text-gray-800
                    max-[550px]:w-[300px]"
                >
                    In-depth articles on the events, figures, and
                    civilizations that changed the course of the world.
                </p>

                <Link
                    to="/learn"
                    className="p-2 mt-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
                    items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    <i className="fa-solid fa-arrow-left"></i> Back to Learn
                </Link>
            </div>

            {/* Search */}
            <div className="mt-6 px-5">
                <LearnSearch
                    placeholder="Search articles by title"
                    value={search}
                    onSearch={handleSearch}
                />
            </div>

            {/* Content */}
            <div className="w-full max-w-[1200px] px-5 mt-8 pt-6 border-t border-t-gray-400">
                {errorMsg ? (
                    <p className="py-10 text-center text-[15px] text-red-700">
                        {errorMsg}
                    </p>
                ) : loadingAllArticles ? (
                    <div className={gridClass}>
                        {[1, 2, 3, 4, 5, 6].map((n) => (
                            <div
                                key={n}
                                className="h-[380px] rounded-lg bg-gray-300/60 animate-pulse"
                            />
                        ))}
                    </div>
                ) : articles.length === 0 ? (
                    <p className="py-10 text-center text-[15px] text-gray-700 italic">
                        {search.trim()
                            ? "No article matches your search."
                            : "No articles have been published yet."}
                    </p>
                ) : (
                    <div className={gridClass}>
                        {articles.map((a) => (
                            <ArticleCard key={a._id} article={a} />
                        ))}
                    </div>
                )}

                <LearnPagination
                    page={page}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                />
            </div>
        </section>
    );
};

export default memo(Articles);