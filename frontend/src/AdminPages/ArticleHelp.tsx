import { memo, useCallback, useEffect, useState } from "react";
import type { ToastState } from "../AdminComponents/AdminLearn/useLearnToast";
import SettingsToast from "../AdminComponents/AdminSettingsComponents/SettingsToast";
import ArticlesPanel from "../AdminComponents/AdminHelpComponents/ArticlesPanel";
import ArticleForm from "../AdminComponents/AdminHelpComponents/ArticleForm";
import CategoriesPanel from "../AdminComponents/AdminHelpComponents/CategoriesPanel";
import {
    HelpArticleAdminProvider,
    useHelpArticleAdminContext,
} from "../AdminContexts/HelpArticleAdminContext";
import {
    HelpCategoryAdminProvider,
    useHelpCategoryAdminContext,
} from "../AdminContexts/HelpCategoryAdminContext";
import type { HelpArticle } from "../Types/HelpTypes";

type Tab = "articles" | "categories";

const AdminHelpContent = () => {
    const {
        getArticles,
        getArticleById,
        pagination,
        errorMsg: articleError,
        successMsg: articleSuccess,
    } = useHelpArticleAdminContext();

    const {
        getCategories,
        categories,
        errorMsg: categoryError,
        successMsg: categorySuccess,
    } = useHelpCategoryAdminContext();

    const [tab, setTab] = useState<Tab>("articles");
    // undefined = liste · null = nouvel article · objet = édition
    const [editor, setEditor] = useState<HelpArticle | null | undefined>(undefined);

    const [toast, setToast] = useState<ToastState | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    // Chargement initial
    useEffect(() => {
        void getCategories();
        void getArticles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Messages → toast
    useEffect(() => {
        const message = articleError || categoryError;
        if (message) setToast({ type: "error", message });
    }, [articleError, categoryError]);

    useEffect(() => {
        const message = articleSuccess || categorySuccess;
        if (message) setToast({ type: "success", message });
    }, [articleSuccess, categorySuccess]);

    const openEditor = useCallback(
        async (id: string) => {
            const article = await getArticleById(id);
            if (article) setEditor(article);
        },
        [getArticleById]
    );

    const tabClass = (active: boolean) =>
        `cursor-pointer border-b-2 px-4 py-2 text-[14px] font-semibold transition-colors duration-200 ${
            active
                ? "border-[#8C6A43] text-[#3E3025]"
                : "border-transparent text-[#3E3025]/55 hover:text-[#3E3025]"
        }`;

    return (
        <section className="min-h-screen w-full bg-[#F8F5EF]">
            <SettingsToast toast={toast} onClose={closeToast} />

            <div className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
                <header className="mb-6 text-center sm:text-left">
                    <h1 className="font-serif text-3xl font-bold text-[#3E3025]">
                        Help Center
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-[#3E3025]/65">
                        Write and organize the guides, FAQs and troubleshooting
                        articles shown in the Help Center.
                    </p>
                </header>

                {editor !== undefined ? (
                    <ArticleForm
                        key={editor?._id ?? "new"}
                        article={editor}
                        onClose={() => setEditor(undefined)}
                    />
                ) : (
                    <>
                        <div
                            role="tablist"
                            className="mb-5 flex border-b border-[#3E3025]/10"
                        >
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === "articles"}
                                onClick={() => setTab("articles")}
                                className={tabClass(tab === "articles")}
                            >
                                Articles ({pagination.total})
                            </button>
                            <button
                                type="button"
                                role="tab"
                                aria-selected={tab === "categories"}
                                onClick={() => setTab("categories")}
                                className={tabClass(tab === "categories")}
                            >
                                Categories ({categories.length})
                            </button>
                        </div>

                        {tab === "articles" ? (
                            <ArticlesPanel
                                onCreate={() => setEditor(null)}
                                onEdit={(id) => void openEditor(id)}
                            />
                        ) : (
                            <CategoriesPanel />
                        )}
                    </>
                )}
            </div>
        </section>
    );
};

// Les deux providers sont placés ici pour que la page soit autonome.
// Tu peux les déplacer dans ton arbre de providers admin si tu préfères.
const AdminHelp = () => (
    <HelpCategoryAdminProvider>
        <HelpArticleAdminProvider>
            <AdminHelpContent />
        </HelpArticleAdminProvider>
    </HelpCategoryAdminProvider>
);

export default memo(AdminHelp);