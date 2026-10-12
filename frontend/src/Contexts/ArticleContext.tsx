
// Contexts/LearnContexts/ArticleContext.tsx

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import type { Article } from "../Types/LearnTypes";





interface ArticleContextType {
    articles: Article[]
    setArticles: React.Dispatch<React.SetStateAction<Article[]>>;

    getAllArticles: () => Promise<void>;
    loadingAllArticles: boolean;

    getArticle: (id: string) => Promise<void>;
    loadingArticle: boolean;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;

    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;

    totalArticles: number;
    totalPages: number;

    search: string;
    setSearch: (search: string) => void;

    currentArticle: Article | null;
    setCurrentArticle: (article: Article | null) => void;

    errorMsg: string;
}

const ArticleContext = createContext<ArticleContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/articles`;

export const ArticleProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [articles, setArticles] = useState<Article[]>([]);

    const [loadingAllArticles, setLoadingAllArticles] =
        useState<boolean>(false);

    const [loadingArticle, setLoadingArticle] =
        useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const [totalArticles, setTotalArticles] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [search, setSearch] = useState<string>("");

    const [currentArticle, setCurrentArticle] =
        useState<Article | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");

    // GET /api/v1/articles?page=1&limit=10&search=...
    const getAllArticles = useCallback(async (): Promise<void> => {
        setLoadingAllArticles(true);
        setErrorMsg("");

        try {
            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if (search.trim()) {
                params.append("search", search.trim());
            }

            const res = await fetch(
                `${API_URL}?${params.toString()}`,
                {
                    method: "GET",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error in fetching articles"
                );
            }

            setArticles(data.data);
            console.log("Articles : ", data.data);
            setTotalArticles(data.pagination?.total ?? 0);
            setTotalPages(data.pagination?.totalPages ?? 0);
        } catch (err) {
            console.error("Error fetching articles:", err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in fetching articles"
            );
        } finally {
            setLoadingAllArticles(false);
        }
    }, [page, limit, search]);

    // GET /api/v1/articles/:id
    const getArticle = useCallback(
        async (id: string): Promise<void> => {
            setLoadingArticle(true);
            setErrorMsg("");

            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "GET",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error ||
                            data.message ||
                            "Error in fetching article"
                    );
                }

                setCurrentArticle(data.data);
            } catch (err) {
                console.error("Error fetching article:", err);

                setErrorMsg(
                    err instanceof Error
                        ? err.message
                        : "Error in fetching article"
                );
            } finally {
                setLoadingArticle(false);
            }
        },
        []
    );

    // Reload articles when pagination or search changes
    useEffect(() => {
        void getAllArticles();
    }, [getAllArticles]);

    return (
        <ArticleContext.Provider
            value={{
                articles,
                setArticles,
                getAllArticles,
                loadingAllArticles,
                getArticle,
                loadingArticle,
                page,
                setPage,
                limit,
                setLimit,
                totalArticles,
                totalPages,
                search,
                setSearch,
                currentArticle,
                setCurrentArticle,
                errorMsg,
            }}
        >
            {children}
        </ArticleContext.Provider>
    );
};

export const useArticleContext = () => {
    const context = useContext(ArticleContext);

    if (!context) {
        throw new Error(
            "useArticleContext must be used within an ArticleProvider"
        );
    }

    return context;
};


