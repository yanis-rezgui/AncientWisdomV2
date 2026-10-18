import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { useAuthContext } from "../Contexts/AuthContext";
import type {
    HelpCategory,
    HelpCategoryFormData,
} from "../Types/HelpTypes";

interface HelpCategoryAdminContextType {
    categories: HelpCategory[];
    setCategories: React.Dispatch<
        React.SetStateAction<HelpCategory[]>
    >;

    getCategories: () => Promise<void>;

    addCategory: (
        formData: HelpCategoryFormData
    ) => Promise<boolean>;

    updateCategory: (
        id: string,
        formData: Partial<HelpCategoryFormData>
    ) => Promise<boolean>;

    deleteCategory: (id: string) => Promise<boolean>;

    loadingCategories: boolean;
    loadingAddCategory: boolean;
    loadingUpdateCategory: boolean;
    loadingDeleteCategory: boolean;

    errorMsg: string;
    successMsg: string;
    clearMessages: () => void;
}

const HelpCategoryAdminContext =
    createContext<HelpCategoryAdminContextType | null>(null);

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/v1/help/categories`;

export const HelpCategoryAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [categories, setCategories] = useState<HelpCategory[]>([]);

    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingAddCategory, setLoadingAddCategory] = useState(false);
    const [loadingUpdateCategory, setLoadingUpdateCategory] = useState(false);
    const [loadingDeleteCategory, setLoadingDeleteCategory] = useState(false);

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

    const getCategories = useCallback(async (): Promise<void> => {
        setLoadingCategories(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/admin`, {
                headers: adminHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to fetch help categories."
                );
            }

            setCategories(data.data ?? []);
        } catch (error) {
            handleError(error, "Failed to fetch help categories.");
        } finally {
            setLoadingCategories(false);
        }
    }, [adminHeaders, clearMessages]);

    const addCategory = async (
        formData: HelpCategoryFormData
    ): Promise<boolean> => {
        setLoadingAddCategory(true);
        clearMessages();

        try {
            const res = await fetch(API_URL, {
                method: "POST",
                headers: adminHeaders(),
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to create category."
                );
            }

            const created = data.data as HelpCategory;

            setCategories((prev) => [
                ...prev.filter((item) => item._id !== created._id),
                created,
            ].sort((a, b) => a.order - b.order));

            setSuccessMsg(data.message || "Category created successfully.");
            return true;
        } catch (error) {
            handleError(error, "Failed to create category.");
            return false;
        } finally {
            setLoadingAddCategory(false);
        }
    };

    const updateCategory = async (
        id: string,
        formData: Partial<HelpCategoryFormData>
    ): Promise<boolean> => {
        setLoadingUpdateCategory(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "PATCH",
                headers: adminHeaders(),
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to update category."
                );
            }

            const updated = data.data as HelpCategory;

            setCategories((prev) =>
                prev
                    .map((item) => item._id === id ? updated : item)
                    .sort((a, b) => a.order - b.order)
            );

            setSuccessMsg(data.message || "Category updated successfully.");
            return true;
        } catch (error) {
            handleError(error, "Failed to update category.");
            return false;
        } finally {
            setLoadingUpdateCategory(false);
        }
    };

    const deleteCategory = async (id: string): Promise<boolean> => {
        setLoadingDeleteCategory(true);
        clearMessages();

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: adminHeaders(),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to delete category."
                );
            }

            setCategories((prev) =>
                prev.filter((item) => item._id !== id)
            );

            setSuccessMsg(data.message || "Category deleted successfully.");
            return true;
        } catch (error) {
            handleError(error, "Failed to delete category.");
            return false;
        } finally {
            setLoadingDeleteCategory(false);
        }
    };

    return (
        <HelpCategoryAdminContext.Provider
            value={{
                categories,
                setCategories,
                getCategories,
                addCategory,
                updateCategory,
                deleteCategory,
                loadingCategories,
                loadingAddCategory,
                loadingUpdateCategory,
                loadingDeleteCategory,
                errorMsg,
                successMsg,
                clearMessages,
            }}
        >
            {children}
        </HelpCategoryAdminContext.Provider>
    );
};

export const useHelpCategoryAdminContext = () => {
    const context = useContext(HelpCategoryAdminContext);

    if (!context) {
        throw new Error(
            "useHelpCategoryAdminContext must be used within HelpCategoryAdminProvider"
        );
    }

    return context;
};
