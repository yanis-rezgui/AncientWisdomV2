import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";
import type { Article } from "../Types/LearnTypes";
import { useAuthContext } from "../Contexts/AuthContext";



export type ArticleAdminWithId = Omit<Article, "_id"> & {
    _id: string;
};

export interface ArticleFormData {
    title: string;
    description: string;
    era: string;
    sections: {
        title: string;
        content: string;
    }[];
    tags: string[];
    image?: File | null;
}

export interface ArticleOption {
    _id: string;
    title: string;
}

export interface ArticleEraOption {
    _id: string;
    name: string;
}

interface ArticleAdminContextType {
    articles: ArticleAdminWithId[];
    setArticles: React.Dispatch<
        React.SetStateAction<ArticleAdminWithId[]>
    >;

    currentArticle: ArticleAdminWithId | null;
    setCurrentArticle: (
        article: ArticleAdminWithId | null
    ) => void;

    articleOptions: ArticleOption[];
    getArticleOptions: () => Promise<void>;

    eraOptions: ArticleEraOption[];
    getEraOptions: () => Promise<void>;

    addArticle: (formData: ArticleFormData) => Promise<boolean>;
    loadingAddArticle: boolean;

    updateArticle: (
        id: string,
        formData: ArticleFormData
    ) => Promise<boolean>;
    loadingUpdateArticle: boolean;

    deleteArticle: (id: string) => Promise<boolean>;
    loadingDeleteArticle: boolean;

    errorMsg: string;
    successMsg: string;
    clearMessages: () => void;
}

const ArticleAdminContext =
    createContext<ArticleAdminContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/articles`;
const ERA_API_URL = `${import.meta.env.VITE_API_URL}/api/v1/era`;

export const ArticleAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [articles, setArticles] = useState<ArticleAdminWithId[]>([]);
    const [currentArticle, setCurrentArticle] =
        useState<ArticleAdminWithId | null>(null);

    const [articleOptions, setArticleOptions] = useState<ArticleOption[]>(
        []
    );
    const [eraOptions, setEraOptions] = useState<ArticleEraOption[]>([]);

    const [loadingAddArticle, setLoadingAddArticle] = useState(false);
    const [loadingUpdateArticle, setLoadingUpdateArticle] =
        useState(false);
    const [loadingDeleteArticle, setLoadingDeleteArticle] =
        useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const clearMessages = useCallback(() => {
        setErrorMsg("");
        setSuccessMsg("");
    }, []);

    const {token} = useAuthContext();

    const handleError = (error: unknown, fallback: string) => {
        console.error(error);
        setErrorMsg(
            error instanceof Error ? error.message : fallback
        );
    };

    const buildFormData = (form: ArticleFormData): FormData => {
        const body = new FormData();

        body.append("title", form.title.trim());
        body.append("description", form.description.trim());
        body.append("era", form.era);

        body.append("sections", JSON.stringify(form.sections));
        body.append("tags", JSON.stringify(form.tags));

        if (form.image) {
            body.append("image", form.image);
        }

        return body;
    };

    // GET /api/v1/articles/options
    const getArticleOptions = useCallback(async (): Promise<void> => {
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/options`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error fetching article options"
                );
            }

            setArticleOptions(data.data ?? []);
        } catch (error) {
            handleError(error, "Error fetching article options");
        }
    }, [clearMessages]);

    // GET /api/v1/era/options
    const getEraOptions = useCallback(async (): Promise<void> => {
        try {
            const res = await fetch(`${ERA_API_URL}/options`);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error fetching historical eras"
                );
            }

            setEraOptions(data.data ?? []);
        } catch (error) {
            handleError(error, "Error fetching historical eras");
        }
    }, []);

    // POST /api/v1/articles
    const addArticle = async (
        form: ArticleFormData
    ): Promise<boolean> => {
        setLoadingAddArticle(true);
        clearMessages();

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers : {
                    Authorization : `Bearer ${token}`,
                },
                body: buildFormData(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error adding article"
                );
            }

            const createdArticle = data.data as
                | ArticleAdminWithId
                | undefined;

            if (createdArticle?._id) {
                setArticles((prev) => [
                    createdArticle,
                    ...prev.filter(
                        (article) => article._id !== createdArticle._id
                    ),
                ]);
            }

            setSuccessMsg(data.message || "Article added successfully");

            await getArticleOptions();

            return true;
        } catch (error) {
            handleError(error, "Error adding article");
            return false;
        } finally {
            setLoadingAddArticle(false);
        }
    };

    // PUT /api/v1/articles/:id
    const updateArticle = async (
        id: string,
        form: ArticleFormData
    ): Promise<boolean> => {
        setLoadingUpdateArticle(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                  headers : {
                    Authorization : `Bearer ${token}`,
                },
                body: buildFormData(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error updating article"
                );
            }

            const updatedArticle = data.data as
                | ArticleAdminWithId
                | undefined;

            if (updatedArticle?._id) {
                setArticles((prev) =>
                    prev.map((article) =>
                        article._id === id ? updatedArticle : article
                    )
                );

                setCurrentArticle((prev) =>
                    prev?._id === id ? updatedArticle : prev
                );
            }

            setSuccessMsg(
                data.message || "Article updated successfully"
            );

            await getArticleOptions();

            return true;
        } catch (error) {
            handleError(error, "Error updating article");
            return false;
        } finally {
            setLoadingUpdateArticle(false);
        }
    };

    // DELETE /api/v1/articles/:id
    const deleteArticle = async (id: string): Promise<boolean> => {
        setLoadingDeleteArticle(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                  headers : {
                    Authorization : `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error deleting article"
                );
            }

            setArticles((prev) =>
                prev.filter((article) => article._id !== id)
            );

            setCurrentArticle((prev) =>
                prev?._id === id ? null : prev
            );

            setSuccessMsg(
                data.message || "Article deleted successfully"
            );

            await getArticleOptions();

            return true;
        } catch (error) {
            handleError(error, "Error deleting article");
            return false;
        } finally {
            setLoadingDeleteArticle(false);
        }
    };

    return (
        <ArticleAdminContext.Provider
            value={{
                articles,
                setArticles,
                currentArticle,
                setCurrentArticle,
                articleOptions,
                getArticleOptions,
                eraOptions,
                getEraOptions,
                addArticle,
                loadingAddArticle,
                updateArticle,
                loadingUpdateArticle,
                deleteArticle,
                loadingDeleteArticle,
                errorMsg,
                successMsg,
                clearMessages,
            }}
        >
            {children}
        </ArticleAdminContext.Provider>
    );
};

export const useArticleAdminContext = () => {
    const context = useContext(ArticleAdminContext);

    if (!context) {
        throw new Error(
            "useArticleAdminContext must be used within an ArticleAdminProvider"
        );
    }

    return context;
};
