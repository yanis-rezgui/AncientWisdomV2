
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useAuthContext } from "../Contexts/AuthContext";

// ============================================================
// TYPES
// ============================================================

export interface HomePageItem {
    _id: string;
    title?: string;
    name?: string;
    text?: string;
    description?: string;
    image?: {
        url?: string;
        publicId?: string;
    };
    [key: string]: unknown;
}

export interface HomePageFAQ {
    _id?: string;
    question: string;
    answer: string;
    order: number;
    isPublished: boolean;
}

export interface HomePageData {
    _id: string;
    quotesOfTheDay: HomePageItem[];
    featuredFigures: HomePageItem[];
    featuredEras: HomePageItem[];
    featuredEvents: HomePageItem[];
    faqs: HomePageFAQ[];
    isPublished: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface HomePageFormData {
    quotesOfTheDay: string[];
    featuredFigures: string[];
    featuredEras: string[];
    featuredEvents: string[];
    faqs: HomePageFAQ[];
    isPublished: boolean;
}

interface HomePageContextType {
    homePage: HomePageData | null;

    setHomePage: React.Dispatch<
        React.SetStateAction<HomePageData | null>
    >;

    getHomePage: () => Promise<void>;
    loadingHomePage: boolean;

    updateHomePage: (
        formData: HomePageFormData
    ) => Promise<boolean>;

    loadingUpdateHomePage: boolean;

    errorMsg: string;
    successMsg: string;
    clearMessages: () => void;
}

// ============================================================
// CONTEXT
// ============================================================

const HomePageContext =
    createContext<HomePageContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/homepage`;

// ============================================================
// PROVIDER
// ============================================================

export const HomePageProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [homePage, setHomePage] =
        useState<HomePageData | null>(null);

    const [loadingHomePage, setLoadingHomePage] =
        useState(false);

    const [loadingUpdateHomePage, setLoadingUpdateHomePage] =
        useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const { token } = useAuthContext();

    // ========================================================
    // HELPERS
    // ========================================================

    const clearMessages = useCallback(() => {
        setErrorMsg("");
        setSuccessMsg("");
    }, []);

    const handleError = (
        error: unknown,
        fallback: string
    ) => {
        console.error(error);

        setErrorMsg(
            error instanceof Error
                ? error.message
                : fallback
        );
    };

    // ========================================================
    // GET HOMEPAGE
    // GET /api/v1/homepage
    // ========================================================

    const getHomePage = useCallback(async (): Promise<void> => {
        setLoadingHomePage(true);
        clearMessages();

        try {
            const res = await fetch(API_URL);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error fetching homepage"
                );
            }

            setHomePage(data.data ?? null);
        } catch (error) {
            handleError(error, "Error fetching homepage");
        } finally {
            setLoadingHomePage(false);
        }
    }, [clearMessages]);

    // ========================================================
    // UPDATE HOMEPAGE
    // PUT /api/v1/homepage
    // ========================================================

    const updateHomePage = async (
        formData: HomePageFormData
    ): Promise<boolean> => {
        setLoadingUpdateHomePage(true);
        clearMessages();

        try {
            if (!token) {
                throw new Error(
                    "You must be logged in as an administrator."
                );
            }

            const res = await fetch(API_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error updating homepage"
                );
            }

            const updatedHomePage = data.data as
                | HomePageData
                | undefined;

            if (updatedHomePage?._id) {
                setHomePage(updatedHomePage);
            }

            setSuccessMsg(
                data.message ||
                    "Homepage updated successfully"
            );

            return true;
        } catch (error) {
            handleError(error, "Error updating homepage");
            return false;
        } finally {
            setLoadingUpdateHomePage(false);
        }
    };

    // ========================================================
    // INITIAL FETCH
    // ========================================================

    useEffect(() => {
        void getHomePage();
    }, [getHomePage]);

    // ========================================================
    // PROVIDER VALUE
    // ========================================================

    return (
        <HomePageContext.Provider
            value={{
                homePage,
                setHomePage,

                getHomePage,
                loadingHomePage,

                updateHomePage,
                loadingUpdateHomePage,

                errorMsg,
                successMsg,
                clearMessages,
            }}
        >
            {children}
        </HomePageContext.Provider>
    );
};

// ============================================================
// CUSTOM HOOK
// ============================================================

export const useHomePageContext = () => {
    const context = useContext(HomePageContext);

    if (!context) {
        throw new Error(
            "useHomePageContext must be used within a HomePageProvider"
        );
    }

    return context;
};