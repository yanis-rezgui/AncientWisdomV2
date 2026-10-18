
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import type {
    HelpArticle,
    HelpArticleFilters,
    HelpCategory,
    HelpPagination,
} from "../Types/HelpTypes";

interface HelpCenterContextType {
    categories: HelpCategory[];
    articles: HelpArticle[];
    currentArticle: HelpArticle | null;

    pagination: HelpPagination;

    getCategories: () => Promise<void>;

    getArticles: (
        filters?: HelpArticleFilters
    ) => Promise<void>;

    getArticleBySlug: (
        slug: string
    ) => Promise<HelpArticle | null>;

    loadingCategories: boolean;
    loadingArticles: boolean;
    loadingArticle: boolean;

    errorMsg: string;
    clearError: () => void;
}

const HelpCenterContext =
    createContext<HelpCenterContextType | null>(null);

const CATEGORIES_API =
    `${import.meta.env.VITE_API_URL}/api/v1/help/categories`;

const ARTICLES_API =
    `${import.meta.env.VITE_API_URL}/api/v1/help/articles`;

const INITIAL_PAGINATION: HelpPagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
};

export const HelpCenterProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [categories, setCategories] = useState<HelpCategory[]>([]);
    const [articles, setArticles] = useState<HelpArticle[]>([]);
    const [currentArticle, setCurrentArticle] =
        useState<HelpArticle | null>(null);

    const [pagination, setPagination] =
        useState<HelpPagination>(INITIAL_PAGINATION);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingArticles, setLoadingArticles] = useState(false);
    const [loadingArticle, setLoadingArticle] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");

    const clearError = useCallback(() => {
        setErrorMsg("");
    }, []);

    const handleError = (error: unknown, fallback: string) => {
        console.error(error);
        setErrorMsg(
            error instanceof Error ? error.message : fallback
        );
    };

    // GET /api/v1/help/categories
    const getCategories = useCallback(async (): Promise<void> => {
        setLoadingCategories(true);
        clearError();

        try {
            const res = await fetch(CATEGORIES_API);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to load help categories."
                );
            }

            setCategories(data.data ?? []);
        } catch (error) {
            handleError(error, "Failed to load help categories.");
        } finally {
            setLoadingCategories(false);
        }
    }, [clearError]);

    // GET /api/v1/help/articles?page=1&limit=10&search=...
    const getArticles = useCallback(async (
        filters: HelpArticleFilters = {}
    ): Promise<void> => {
        setLoadingArticles(true);
        clearError();

        try {
            const params = new URLSearchParams();

            for (const [key, value] of Object.entries(filters)) {
                if (value !== undefined && value !== "") {
                    params.set(key, String(value));
                }
            }

            const query = params.toString();

            const res = await fetch(
                `${ARTICLES_API}${query ? `?${query}` : ""}`
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to load help articles."
                );
            }

            setArticles(data.data ?? []);
            setPagination(data.pagination ?? INITIAL_PAGINATION);
        } catch (error) {
            handleError(error, "Failed to load help articles.");
        } finally {
            setLoadingArticles(false);
        }
    }, [clearError]);

    // GET /api/v1/help/articles/:slug
    const getArticleBySlug = async (
        slug: string
    ): Promise<HelpArticle | null> => {
        setLoadingArticle(true);
        clearError();

        try {
            const res = await fetch(
                `${ARTICLES_API}/${encodeURIComponent(slug)}`
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to load help article."
                );
            }

            const article = data.data as HelpArticle;
            setCurrentArticle(article);

            return article;
        } catch (error) {
            handleError(error, "Failed to load help article.");
            setCurrentArticle(null);
            return null;
        } finally {
            setLoadingArticle(false);
        }
    };

    return (
        <HelpCenterContext.Provider
            value={{
                categories,
                articles,
                currentArticle,
                pagination,
                getCategories,
                getArticles,
                getArticleBySlug,
                loadingCategories,
                loadingArticles,
                loadingArticle,
                errorMsg,
                clearError,
            }}
        >
            {children}
        </HelpCenterContext.Provider>
    );
};

export const useHelpCenterContext = () => {
    const context = useContext(HelpCenterContext);

    if (!context) {
        throw new Error(
            "useHelpCenterContext must be used within HelpCenterProvider"
        );
    }

    return context;
};
