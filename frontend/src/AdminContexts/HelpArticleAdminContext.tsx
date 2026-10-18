
import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { useAuthContext } from "../Contexts/AuthContext";

import type {
    HelpArticle,
    HelpArticleFormData,
    HelpAdminArticleFilters,
    HelpPagination,
} from "../Types/HelpTypes";

interface HelpArticleAdminContextType {
    articles: HelpArticle[];
    setArticles: React.Dispatch<
        React.SetStateAction<HelpArticle[]>
    >;

    currentArticle: HelpArticle | null;
    setCurrentArticle: (article: HelpArticle | null) => void;

    pagination: HelpPagination;
    filters: HelpAdminArticleFilters;
    setFilters: React.Dispatch<
        React.SetStateAction<HelpAdminArticleFilters>
    >;

    getArticles: (
        customFilters?: HelpAdminArticleFilters
    ) => Promise<void>;

    getArticleById: (id: string) => Promise<HelpArticle | null>;

    addArticle: (form: HelpArticleFormData) => Promise<boolean>;

    updateArticle: (
        id: string,
        form: Partial<HelpArticleFormData>
    ) => Promise<boolean>;

    publishArticle: (id: string) => Promise<boolean>;
    unpublishArticle: (id: string) => Promise<boolean>;
    deleteArticle: (id: string) => Promise<boolean>;

    loadingArticles: boolean;
    loadingArticle: boolean;
    loadingAddArticle: boolean;
    loadingUpdateArticle: boolean;
    loadingPublishArticle: boolean;
    loadingDeleteArticle: boolean;

    errorMsg: string;
    successMsg: string;
    clearMessages: () => void;
}

const HelpArticleAdminContext =
    createContext<HelpArticleAdminContextType | null>(null);

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/v1/help/articles`;

const INITIAL_PAGINATION: HelpPagination = {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
};

export const HelpArticleAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [articles, setArticles] = useState<HelpArticle[]>([]);
    const [currentArticle, setCurrentArticle] =
        useState<HelpArticle | null>(null);

    const [pagination, setPagination] =
        useState<HelpPagination>(INITIAL_PAGINATION);

    const [filters, setFilters] = useState<HelpAdminArticleFilters>({
        page: 1,
        limit: 10,
    });

    const [loadingArticles, setLoadingArticles] = useState(false);
    const [loadingArticle, setLoadingArticle] = useState(false);
    const [loadingAddArticle, setLoadingAddArticle] = useState(false);
    const [loadingUpdateArticle, setLoadingUpdateArticle] = useState(false);
    const [loadingPublishArticle, setLoadingPublishArticle] = useState(false);
    const [loadingDeleteArticle, setLoadingDeleteArticle] = useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const { token } = useAuthContext();

    const clearMessages = useCallback(() => {
        setErrorMsg("");
        setSuccessMsg("");
    }, []);

    const handleError = (error: unknown, fallback: string) => {
        console.error(error);
        setErrorMsg(
            error instanceof Error ? error.message : fallback
        );
    };

    const adminHeaders = useCallback((): HeadersInit => {
        if (!token) {
            throw new Error("You must be logged in as an administrator.");
        }

        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        };
    }, [token]);

    const buildQuery = (values: HelpAdminArticleFilters) => {
        const params = new URLSearchParams();

        for (const [key, value] of Object.entries(values)) {
            if (value !== undefined && value !== "") {
                params.set(key, String(value));
            }
        }

        return params.toString();
    };

    // GET /api/v1/help/articles/admin
    const getArticles = useCallback(async (
        customFilters?: HelpAdminArticleFilters
    ): Promise<void> => {
        setLoadingArticles(true);
        clearMessages();

        const activeFilters = customFilters ?? filters;

        try {
            const query = buildQuery(activeFilters);

            const res = await fetch(
                `${API_URL}/admin${query ? `?${query}` : ""}`,
                { headers: adminHeaders() }
            );

            const data = await res.json();
            console.log("ADMIN ARTICLES →", res.status, data);

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to fetch help articles."
                );
            }

            setArticles(data.data ?? []);
            setPagination(data.pagination ?? INITIAL_PAGINATION);

            if (customFilters) {
                setFilters(customFilters);
            }
        } catch (error) {
            handleError(error, "Failed to fetch help articles.");
        } finally {
            setLoadingArticles(false);
        }
    }, [adminHeaders, clearMessages, filters]);

    // GET /api/v1/help/articles/admin/:id
    const getArticleById = async (
        id: string
    ): Promise<HelpArticle | null> => {
        setLoadingArticle(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/admin/${id}`, {
                headers: adminHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to fetch help article."
                );
            }

            const article = data.data as HelpArticle;
            setCurrentArticle(article);

            return article;
        } catch (error) {
            handleError(error, "Failed to fetch help article.");
            return null;
        } finally {
            setLoadingArticle(false);
        }
    };

    // POST /api/v1/help/articles
    const addArticle = async (
        form: HelpArticleFormData
    ): Promise<boolean> => {
        setLoadingAddArticle(true);
        clearMessages();

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to create help article."
                );
            }

            const created = data.data as HelpArticle;

            setArticles((prev) => [
                created,
                ...prev.filter((item) => item._id !== created._id),
            ]);

            setCurrentArticle(created);
            setSuccessMsg(data.message || "Help article created successfully.");

            return true;
        } catch (error) {
            handleError(error, "Failed to create help article.");
            return false;
        } finally {
            setLoadingAddArticle(false);
        }
    };

    // PATCH /api/v1/help/articles/:id
    const updateArticle = async (
        id: string,
        form: Partial<HelpArticleFormData>
    ): Promise<boolean> => {
        setLoadingUpdateArticle(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: adminHeaders(),
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to update help article."
                );
            }

            const updated = data.data as HelpArticle;

            setArticles((prev) =>
                prev.map((item) => item._id === id ? updated : item)
            );

            setCurrentArticle((prev) =>
                prev?._id === id ? updated : prev
            );

            setSuccessMsg(data.message || "Help article updated successfully.");
            return true;
        } catch (error) {
            handleError(error, "Failed to update help article.");
            return false;
        } finally {
            setLoadingUpdateArticle(false);
        }
    };

    const changePublication = async (
        id: string,
        action: "publish" | "unpublish"
    ): Promise<boolean> => {
        setLoadingPublishArticle(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/${id}/${action}`, {
                method: "PATCH",
                headers: adminHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || `Failed to ${action} article.`
                );
            }

            const updated = data.data as HelpArticle;

            setArticles((prev) =>
                prev.map((item) => item._id === id ? updated : item)
            );

            setCurrentArticle((prev) =>
                prev?._id === id ? updated : prev
            );

            setSuccessMsg(
                data.message ||
                    `Help article ${action === "publish" ? "published" : "unpublished"} successfully.`
            );

            return true;
        } catch (error) {
            handleError(error, `Failed to ${action} article.`);
            return false;
        } finally {
            setLoadingPublishArticle(false);
        }
    };

    const publishArticle = (id: string) =>
        changePublication(id, "publish");

    const unpublishArticle = (id: string) =>
        changePublication(id, "unpublish");

    // DELETE /api/v1/help/articles/:id
    const deleteArticle = async (id: string): Promise<boolean> => {
        setLoadingDeleteArticle(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: adminHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete help article."
                );
            }

            setArticles((prev) =>
                prev.filter((item) => item._id !== id)
            );

            setCurrentArticle((prev) =>
                prev?._id === id ? null : prev
            );

            setSuccessMsg(data.message || "Help article deleted successfully.");
            return true;
        } catch (error) {
            handleError(error, "Failed to delete help article.");
            return false;
        } finally {
            setLoadingDeleteArticle(false);
        }
    };

    return (
        <HelpArticleAdminContext.Provider
            value={{
                articles,
                setArticles,
                currentArticle,
                setCurrentArticle,
                pagination,
                filters,
                setFilters,
                getArticles,
                getArticleById,
                addArticle,
                updateArticle,
                publishArticle,
                unpublishArticle,
                deleteArticle,
                loadingArticles,
                loadingArticle,
                loadingAddArticle,
                loadingUpdateArticle,
                loadingPublishArticle,
                loadingDeleteArticle,
                errorMsg,
                successMsg,
                clearMessages,
            }}
        >
            {children}
        </HelpArticleAdminContext.Provider>
    );
};

export const useHelpArticleAdminContext = () => {
    const context = useContext(HelpArticleAdminContext);

    if (!context) {
        throw new Error(
            "useHelpArticleAdminContext must be used within HelpArticleAdminProvider"
        );
    }

    return context;
};
