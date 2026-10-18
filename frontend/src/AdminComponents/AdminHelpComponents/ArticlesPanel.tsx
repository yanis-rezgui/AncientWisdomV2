import { memo, useState } from "react";
import { Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import { useHelpArticleAdminContext } from "../../AdminContexts/HelpArticleAdminContext";
import { useHelpCategoryAdminContext } from "../../AdminContexts/HelpCategoryAdminContext";
import type {
    HelpAdminArticleFilters,
    HelpArticle,
    HelpArticleType,
} from "../../Types/HelpTypes";
import {
    ARTICLE_TYPES,
    ConfirmDialog,
    StatusBadge,
    Tag,
    btnDanger,
    btnPrimary,
    btnSecondary,
    cardClass,
    formatDate,
    inputClass,
    typeLabel,
} from "./helpUI";

const ArticlesPanel = ({
    onCreate,
    onEdit,
}: {
    onCreate: () => void;
    onEdit: (id: string) => void;
}) => {
    const {
        articles,
        pagination,
        filters,
        getArticles,
        publishArticle,
        unpublishArticle,
        deleteArticle,
        loadingArticles,
        loadingPublishArticle,
        loadingDeleteArticle,
    } = useHelpArticleAdminContext();
    const { categories } = useHelpCategoryAdminContext();

    const [searchText, setSearchText] = useState(filters.search ?? "");
    const [toDelete, setToDelete] = useState<HelpArticle | null>(null);

    const apply = (patch: Partial<HelpAdminArticleFilters>) =>
        getArticles({ ...filters, ...patch, page: 1 });

    const categoryName = (article: HelpArticle) => {
        if (typeof article.category !== "string") return article.category.name;
        return categories.find((c) => c._id === article.category)?.name ?? "—";
    };

    const confirmDelete = async () => {
        if (!toDelete) return;
        const ok = await deleteArticle(toDelete._id);
        if (ok) {
            setToDelete(null);
            // Recharge pour garder la pagination cohérente
            const page =
                articles.length === 1 && (filters.page ?? 1) > 1
                    ? (filters.page ?? 1) - 1
                    : filters.page;
            void getArticles({ ...filters, page });
        }
    };

    const publishedValue =
        filters.published === undefined ? "" : String(filters.published);

    return (
        <div className="flex flex-col gap-4">
            {/* Filtres */}
            <div className={`${cardClass} flex flex-col gap-3 p-4`}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        void apply({ search: searchText.trim() || undefined });
                    }}
                    className="flex gap-2"
                >
                    <input
                        type="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Search by title, excerpt or tag"
                        aria-label="Search articles"
                        className={inputClass}
                    />
                    <button type="submit" className={btnSecondary} aria-label="Search">
                        <Search size={16} />
                    </button>
                </form>

                <div className="grid grid-cols-1 gap-3 min-[560px]:grid-cols-3">
                    <select
                        aria-label="Filter by category"
                        value={filters.category ?? ""}
                        onChange={(e) =>
                            void apply({ category: e.target.value || undefined })
                        }
                        className={inputClass}
                    >
                        <option value="">All categories</option>
                        {categories.map((c) => (
                            <option key={c._id} value={c._id}>
                                {c.name}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by type"
                        value={filters.type ?? ""}
                        onChange={(e) =>
                            void apply({
                                type: (e.target.value || undefined) as
                                    | HelpArticleType
                                    | undefined,
                            })
                        }
                        className={inputClass}
                    >
                        <option value="">All types</option>
                        {ARTICLE_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>
                                {t.label}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label="Filter by status"
                        value={publishedValue}
                        onChange={(e) =>
                            void apply({
                                published:
                                    e.target.value === ""
                                        ? undefined
                                        : e.target.value === "true",
                            })
                        }
                        className={inputClass}
                    >
                        <option value="">All statuses</option>
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                    </select>
                </div>
            </div>

            {/* Barre d'actions */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-semibold text-[#3E3025]">
                    Total articles : {pagination.total}
                </p>
                <button type="button" onClick={onCreate} className={btnPrimary}>
                    <Plus size={16} /> New article
                </button>
            </div>

            {/* Liste */}
            {loadingArticles && articles.length === 0 ? (
                <p className="py-10 text-center font-semibold text-[#3E3025]">Loading...</p>
            ) : articles.length === 0 ? (
                <div className={`${cardClass} p-8 text-center`}>
                    <p className="text-[#3E3025]">No articles found.</p>
                    <p className="mt-1 text-[13px] text-[#3E3025]/60">
                        Change the filters or write your first article.
                    </p>
                </div>
            ) : (
                <ul
                    className={`flex flex-col gap-3 transition-opacity ${
                        loadingArticles ? "opacity-60" : ""
                    }`}
                >
                    {articles.map((article) => (
                        <li key={article._id} className={`${cardClass} p-4`}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h3 className="text-[1.05em] font-semibold text-[#3E3025]">
                                            {article.title}
                                        </h3>
                                        {article.isFeatured && (
                                            <Star
                                                size={15}
                                                className="fill-[#C9A66B] text-[#C9A66B]"
                                                aria-label="Featured"
                                            />
                                        )}
                                    </div>
                                    <p className="mt-0.5 text-[12px] text-[#3E3025]/55">
                                        /{article.slug}
                                    </p>
                                </div>
                                <StatusBadge published={article.isPublished} />
                            </div>

                            <p className="mt-2 line-clamp-2 text-[14px] leading-6 text-[#3E3025]/75">
                                {article.excerpt}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-[12px] text-[#3E3025]/65">
                                <Tag>{typeLabel(article.articleType)}</Tag>
                                <Tag>{categoryName(article)}</Tag>
                                <span>Updated {formatDate(article.updatedAt)}</span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#3E3025]/10 pt-3">
                                <button
                                    type="button"
                                    onClick={() => onEdit(article._id)}
                                    className={btnSecondary}
                                >
                                    <Pencil size={14} /> Edit
                                </button>

                                <button
                                    type="button"
                                    disabled={loadingPublishArticle}
                                    onClick={() =>
                                        void (article.isPublished
                                            ? unpublishArticle(article._id)
                                            : publishArticle(article._id))
                                    }
                                    className={btnSecondary}
                                >
                                    {article.isPublished ? "Unpublish" : "Publish"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setToDelete(article)}
                                    className={`${btnDanger} ml-auto`}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="mt-2 flex items-center justify-center gap-3">
                    <button
                        type="button"
                        disabled={pagination.page <= 1}
                        onClick={() =>
                            void getArticles({ ...filters, page: pagination.page - 1 })
                        }
                        className="cursor-pointer rounded-[5px] bg-[#3E3025]/10 px-4 py-2 text-[14px] font-semibold text-[#3E3025]
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        ← Previous
                    </button>

                    <span className="text-sm font-semibold text-[#3E3025]">
                        Page {pagination.page} / {pagination.totalPages}
                    </span>

                    <button
                        type="button"
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() =>
                            void getArticles({ ...filters, page: pagination.page + 1 })
                        }
                        className="cursor-pointer rounded-[5px] bg-[#3E3025]/10 px-4 py-2 text-[14px] font-semibold text-[#3E3025]
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        Next →
                    </button>
                </div>
            )}

            {toDelete && (
                <ConfirmDialog
                    title="Delete this article?"
                    message={`“${toDelete.title}” will be permanently deleted. This action cannot be undone.`}
                    loading={loadingDeleteArticle}
                    onConfirm={() => void confirmDelete()}
                    onCancel={() => setToDelete(null)}
                />
            )}
        </div>
    );
};

export default memo(ArticlesPanel);