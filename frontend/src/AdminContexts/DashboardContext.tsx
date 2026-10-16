import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";

import { useAuthContext } from "../Contexts/AuthContext";
import type { AdminDashboardData } from "../Types/Types";

// =========================================================
// TYPES
// =========================================================

interface DashboardContextType {
    dashboard: AdminDashboardData | null;
    setDashboard: React.Dispatch<
        React.SetStateAction<AdminDashboardData | null>
    >;

    getDashboard: () => Promise<void>;
    refreshDashboard: () => Promise<void>;

    loadingDashboard: boolean;

    errorMsg: string;
    successMsg: string;
    clearMessages: () => void;
}

// =========================================================
// CONTEXT
// =========================================================

const DashboardContext =
    createContext<DashboardContextType | null>(null);

// =========================================================
// API URL
// =========================================================

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/admin/dashboard`;

// =========================================================
// PROVIDER
// =========================================================

export const DashboardProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const [dashboard, setDashboard] =
        useState<AdminDashboardData | null>(null);

    const [loadingDashboard, setLoadingDashboard] =
        useState(false);

    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const { token } = useAuthContext();

    // =====================================================
    // MESSAGES
    // =====================================================

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
            error instanceof Error ? error.message : fallback
        );
    };

    // =====================================================
    // GET DASHBOARD
    // GET /api/v1/admin/dashboard
    // =====================================================

    const getDashboard = useCallback(async (): Promise<void> => {
        setLoadingDashboard(true);
        clearMessages();

        try {
            const res = await fetch(API_URL, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                        data.message ||
                        "Error fetching dashboard statistics"
                );
            }

            const dashboardData =
                data.data as AdminDashboardData | undefined;

            if (!dashboardData) {
                throw new Error(
                    "The server did not return dashboard data"
                );
            }

            setDashboard(dashboardData);
            setSuccessMsg(
                data.message || "Dashboard loaded successfully"
            );
        } catch (error) {
            handleError(
                error,
                "Error fetching dashboard statistics"
            );
        } finally {
            setLoadingDashboard(false);
        }
    }, [token, clearMessages]);

    // =====================================================
    // REFRESH DASHBOARD
    // =====================================================

    const refreshDashboard = useCallback(async (): Promise<void> => {
        await getDashboard();
    }, [getDashboard]);

    // =====================================================
    // PROVIDER VALUE
    // =====================================================

    return (
        <DashboardContext.Provider
            value={{
                dashboard,
                setDashboard,
                getDashboard,
                refreshDashboard,
                loadingDashboard,
                errorMsg,
                successMsg,
                clearMessages,
            }}
        >
            {children}
        </DashboardContext.Provider>
    );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useDashboardContext = () => {
    const context = useContext(DashboardContext);

    if (!context) {
        throw new Error(
            "useDashboardContext must be used within a DashboardProvider"
        );
    }

    return context;
};
