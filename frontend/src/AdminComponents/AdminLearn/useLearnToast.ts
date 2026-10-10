import { useCallback, useEffect, useState } from "react";

export interface ToastState {
    message: string;
    type: "success" | "error";
}

// Gère le Toast d'une page et affiche automatiquement l'erreur du context
export const useLearnToast = (errorMsg?: string | null) => {
    const [toast, setToast] = useState<ToastState | null>(null);

    const closeToast = useCallback(() => setToast(null), []);

    const showToast = useCallback(
        (message: string, type: "success" | "error" = "error") => setToast({ message, type }),
        []
    );

    useEffect(() => {
        if (errorMsg) setToast({ message: errorMsg, type: "error" });
    }, [errorMsg]);

    return { toast, showToast, closeToast };
};
