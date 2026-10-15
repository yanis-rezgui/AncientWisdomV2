import { useEffect } from "react";

export interface ToastState {
    type: "success" | "error";
    message: string;
}

interface SettingsToastProps {
    toast: ToastState | null;
    onClose: () => void;
}

const SettingsToast = ({ toast, onClose }: SettingsToastProps) => {
    useEffect(() => {
        if (!toast) return;

        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;

    const isSuccess = toast.type === "success";

    return (
        <div
            role="status"
            className={`fixed bottom-24 right-4 z-50 max-w-[calc(100vw-2rem)] rounded-xl border px-4 py-3 text-sm shadow-lg sm:bottom-8 sm:right-8 ${
                isSuccess
                    ? "border-green-700/30 bg-green-50 text-green-900"
                    : "border-red-700/30 bg-red-50 text-red-900"
            }`}
        >
            <div className="flex items-start gap-3">
                <span>{toast.message}</span>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close notification"
                    className="text-base leading-none opacity-60 hover:opacity-100"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default SettingsToast;