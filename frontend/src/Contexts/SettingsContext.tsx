
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";


import { useAuthContext } from "./AuthContext";
import type { Settings, SettingsInput } from "../Types/Types";

const SETTINGS_API_URL =
    `${import.meta.env.VITE_API_URL}/api/v1/settings`;

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface SettingsContextType {
    settings: Settings | null;
    loading: boolean;
    updating: boolean;
    error: string | null;
    refreshSettings: () => Promise<void>;
    updateSettings: (
        input: SettingsInput
    ) => Promise<{ success: boolean; message: string }>;
}

const SettingsContext =
    createContext<SettingsContextType | null>(null);

export const SettingsProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { token } = useAuthContext();

    const [settings, setSettings] = useState<Settings | null>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // GET — Récupérer les paramètres
    const refreshSettings = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(SETTINGS_API_URL);
            const payload: ApiResponse<Settings> =
                await response.json();

            if (!response.ok || !payload.success) {
                throw new Error(
                    payload.message || "Failed to fetch settings"
                );
            }

            setSettings(payload.data);
        } catch (err) {
            const message =
                err instanceof Error
                    ? err.message
                    : "An unexpected error occurred";

            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void refreshSettings();
    }, [refreshSettings]);

    // PUT — Mettre à jour les paramètres depuis l'admin
    const updateSettings = useCallback(
        async (input: SettingsInput) => {
            if (!token) {
                return {
                    success: false,
                    message: "You must be signed in.",
                };
            }

            setUpdating(true);

            try {
                const response = await fetch(SETTINGS_API_URL, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(input),
                });

                const payload: ApiResponse<Settings> =
                    await response.json();

                if (!response.ok || !payload.success) {
                    return {
                        success: false,
                        message:
                            payload.message ||
                            "Failed to update settings",
                    };
                }

                setSettings(payload.data);

                return {
                    success: true,
                    message:
                        payload.message ||
                        "Settings updated successfully",
                };
            } catch (err) {
                return {
                    success: false,
                    message:
                        err instanceof Error
                            ? err.message
                            : "Could not reach the server.",
                };
            } finally {
                setUpdating(false);
            }
        },
        [token]
    );

    return (
        <SettingsContext.Provider
            value={{
                settings,
                loading,
                updating,
                error,
                refreshSettings,
                updateSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettingsContext = () => {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error(
            "useSettingsContext must be used inside SettingsProvider"
        );
    }

    return context;
};
