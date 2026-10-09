
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import { useAuthContext } from "./AuthContext";
import type { Tips, UpdateTipsData } from "../Types/LearnTypes";


interface TipsContextType {
    tips: Tips | null;
    loading: boolean;
    updating: boolean;
    errorMsg: string | null;
    getTips: () => Promise<void>;
    updateTips: (data: UpdateTipsData) => Promise<boolean>;
}

const TipsContext = createContext<TipsContextType | undefined>(undefined);

interface TipsProviderProps {
    children: ReactNode;
}

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/tips`;

export const TipsProvider = ({ children }: TipsProviderProps) => {
    const { token } = useAuthContext();

    const [tips, setTips] = useState<Tips | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // GET /api/v1/tips
    const getTips = useCallback(async (): Promise<void> => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const response = await fetch(API_URL);

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error || data.message || "Failed to fetch learning tips."
                );
            }

            setTips(data.data);
        } catch (error) {
            setErrorMsg(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred."
            );
        } finally {
            setLoading(false);
        }
    }, []);

    // PUT /api/v1/tips
    const updateTips = useCallback(
        async (updatedData: UpdateTipsData): Promise<boolean> => {
            if (!token) {
                setErrorMsg("You must be logged in to update learning tips.");
                return false;
            }

            setUpdating(true);
            setErrorMsg(null);

            try {
                const response = await fetch(API_URL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(updatedData),
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error || data.message || "Failed to update learning tips."
                    );
                }

                setTips(data.data);

                return true;
            } catch (error) {
                setErrorMsg(
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred."
                );

                return false;
            } finally {
                setUpdating(false);
            }
        },
        [token]
    );

    useEffect(() => {
        void getTips();
    }, [getTips]);

    return (
        <TipsContext.Provider
            value={{
                tips,
                loading,
                updating,
                errorMsg,
                getTips,
                updateTips,
            }}
        >
            {children}
        </TipsContext.Provider>
    );
};

export const useTipsContext = () => {
    const context = useContext(TipsContext);

    if (!context) {
        throw new Error(
            "useTipsContext must be used within a TipsProvider."
        );
    }

    return context;
};