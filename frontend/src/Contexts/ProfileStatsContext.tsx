import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useAuthContext } from "../Contexts/AuthContext";

import type {
    ProfileStatsData,
    ProfileStatsApiResponse,
} from "../Types/ProfileStatsTypes";

// =========================================================
// CONTEXT TYPE
// =========================================================

interface ProfileStatsContextType {
    profileStats: ProfileStatsData | null;

    setProfileStats: React.Dispatch<
        React.SetStateAction<ProfileStatsData | null>
    >;

    getMyProfileStats: () => Promise<void>;
    refreshProfileStats: () => Promise<void>;

    loadingProfileStats: boolean;

    errorMsg: string;
    successMsg: string;
    clearMessages: () => void;
}

// =========================================================
// CONTEXT
// =========================================================

const ProfileStatsContext =
    createContext<ProfileStatsContextType | null>(null);

// =========================================================
// API URL
// =========================================================

const API_URL =
    `${import.meta.env.VITE_API_URL}/api/v1/auth/me/stats`;

// =========================================================
// PROVIDER
// =========================================================

export const ProfileStatsProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    // =====================================================
    // STATE
    // =====================================================

    const [profileStats, setProfileStats] =
        useState<ProfileStatsData | null>(null);

    const [loadingProfileStats, setLoadingProfileStats] =
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
        console.error("Profile stats error:", error);

        setErrorMsg(
            error instanceof Error
                ? error.message
                : fallback
        );
    };

    // =====================================================
    // GET MY PROFILE STATS
    // GET /api/v1/users/me/stats
    // =====================================================

    const getMyProfileStats =
        useCallback(async (): Promise<void> => {
            setLoadingProfileStats(true);
            clearMessages();

            try {
                const res = await fetch(API_URL, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data =
                    (await res.json()) as ProfileStatsApiResponse;

                if (!res.ok || !data.success) {
                    throw new Error(
                        data.message ||
                            "Failed to retrieve profile statistics."
                    );
                }

                if (!data.data) {
                    throw new Error(
                        "Profile statistics are unavailable."
                    );
                }

                setProfileStats(data.data);
                console.log("Profile Stats : ", data.data);
            } catch (error: unknown) {
                handleError(
                    error,
                    "Failed to retrieve profile statistics."
                );
            } finally {
                setLoadingProfileStats(false);
            }
        }, [token, clearMessages]);

    // =====================================================
    // REFRESH PROFILE STATS
    // =====================================================

    const refreshProfileStats =
        useCallback(async (): Promise<void> => {
            await getMyProfileStats();
        }, [getMyProfileStats]);

    useEffect(()=>{
        if(!token) return
        refreshProfileStats();
    }, [token]);

    // =====================================================
    // PROVIDER VALUE
    // =====================================================

    return (
        <ProfileStatsContext.Provider
            value={{
                profileStats,
                setProfileStats,
                getMyProfileStats,
                refreshProfileStats,
                loadingProfileStats,
                errorMsg,
                successMsg,
                clearMessages,
            }}
        >
            {children}
        </ProfileStatsContext.Provider>
    );
};

// =========================================================
// CUSTOM HOOK
// =========================================================

export const useProfileStatsContext = () => {
    const context = useContext(ProfileStatsContext);

    if (!context) {
        throw new Error(
            "useProfileStatsContext must be used within a ProfileStatsProvider"
        );
    }

    return context;
};