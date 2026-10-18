import { memo } from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { useHelpCenterContext } from "../../Contexts/HelpCenterContext";
import type { HelpArticleType } from "../../Types/HelpTypes";
import SectionHeading from "../FigureDetailsComponents/SectionHeading";
import { TYPE_OPTIONS, getCategory, typeLabel } from "./helpPublic";

type Props = {
    type: HelpArticleType | "";
    hasFilters: boolean;
    onTypeChange: (type: HelpArticleType | "") => void;
    onPageChange: (page: number) => void;
    onClear: () => void;
};

const pagerBtn =
    "cursor-pointer rounded-md border border-[#3E3025] bg-white px-4 py-2 text-[14px] font-semibold " +
    "text-[#3E3025] transition-colors duration-200 hover:bg-[#3E3025] hover:text-white " +
    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#3E3025]";

const HelpArticlesList = ({ type, hasFilters, onTypeChange, onPageChange, onClear }: Props) => {
    const { articles, pagination, loadingArticles, errorMsg } = useHelpCenterContext();

    return (
        <section
            aria-labelledby="help-articles-title"
            className="mx-auto mb-10 mt-10 w-full max-w-[900px] px-4"
        >
            <SectionHeading id="help-articles-title" title="Articles" />

            {/* Filtre par type */}
            <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Filter by type">
                {TYPE_OPTIONS.map((option) => {
                    const active = type === option.value;
                    return (
                        <button
                            key={option.label}
                            type="button"
                            aria-pressed={active}
                            onClick={() => onTypeChange(option.value)}
                            className={`cursor-pointer rounded-full border px-3.5 py-1 text-[14px] font-medium
                            transition-colors duration-200 ${
                                active
                                    ? "border-[#3E3025] bg-[#3E3025] text-white"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-[#8C6A43]"
                            }`}
                        >
                            {option.label}
                        </button>
                    );
                })}
            </div>

            <p className="mt-4 text-[14px] text-gray-700" aria-live="polite">
                {loadingArticles
                    ? "Loading..."
                    : `${pagination.total} ${pagination.total === 1 ? "article" : "articles"}`}
            </p>

            {errorMsg && !loadingArticles ? (
                <p role="alert" className="mt-6 text-center font-semibold text-red-900">
                    {errorMsg}
                </p>
            ) : !loadingArticles && articles.length === 0 ? (
                <div className="mt-6 rounded-lg border border-gray-200 bg-white p-8 text-center">
                    <p className="font-semibold text-[#3E3025]">No articles found.</p>
                    <p className="mt-1 text-[14px] text-gray-700">
                        Try different words or browse another topic.
                    </p>
                    {hasFilters && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="mt-4 cursor-pointer rounded-md bg-[#3E3025] px-4 py-2 text-[14px]
                            font-semibold text-white transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            Clear filters
                        </button>
                    )}
                </div>
            ) : (
                <ul
                    className={`mt-4 flex flex-col gap-4 transition-opacity ${
                        loadingArticles ? "opacity-60" : ""
                    }`}
                >
                    {articles.map((article) => {
                        const category = getCategory(article);

                        return (
                            <li
                                key={article._id}
                                className="group relative flex flex-col gap-3 rounded-lg border border-gray-200
                                bg-white p-5 transition-colors duration-300 hover:border-[#8C6A43]"
                            >
                                <div className="flex flex-wrap items-center gap-2 text-[13px]">
                                    <span className="rounded-full bg-[#F0E6D8] px-2.5 py-0.5 font-semibold text-[#3E3025]">
                                        {typeLabel(article.articleType)}
                                    </span>
                                    {category && (
                                        <span className="text-gray-600">{category.name}</span>
                                    )}
                                    {article.isFeatured && (
                                        <span className="ml-auto flex items-center gap-1 font-semibold text-[#8C6A43]">
                                            <Star size={14} className="fill-[#C9A66B] text-[#C9A66B]" />
                                            Featured
                                        </span>
                                    )}
                                </div>

                                <h3 className="text-[1.15em] font-semibold leading-6 text-[#3E3025]">
                                    {/* Stretched link : toute la carte est cliquable */}
                                    <Link
                                        to={`/help/${article.slug}`}
                                        className="after:absolute after:inset-0 after:content-['']"
                                    >
                                        {article.title}
                                    </Link>
                                </h3>

                                <p className="leading-7 text-gray-800">{article.excerpt}</p>

                                <span className="flex items-center gap-2 text-[14px] font-semibold text-[#3E3025]">
                                    Read article
                                    <span
                                        aria-hidden="true"
                                        className="transition-transform duration-300 group-hover:translate-x-1"
                                    >
                                        →
                                    </span>
                                </span>
                            </li>
                        );
                    })}
                </ul>
            )}

            {pagination.totalPages > 1 && (
                <nav
                    aria-label="Pagination"
                    className="mt-8 flex items-center justify-center gap-3"
                >
                    <button
                        type="button"
                        disabled={pagination.page <= 1}
                        onClick={() => onPageChange(pagination.page - 1)}
                        className={pagerBtn}
                    >
                        ← Previous
                    </button>

                    <span className="text-[14px] font-semibold text-[#3E3025]">
                        Page {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => onPageChange(pagination.page + 1)}
                        className={pagerBtn}
                    >
                        Next →
                    </button>
                </nav>
            )}
        </section>
    );
};

export default memo(HelpArticlesList);
