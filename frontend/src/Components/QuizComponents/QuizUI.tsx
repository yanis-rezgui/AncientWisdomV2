import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { QuizDifficulty } from "../../Types/Types";
import { difficultyLabel, difficultyStyle } from "../../Types/QuizHelpers";


/* Apprentice / Scholar / Sage */
export const DifficultyBadge = ({ difficulty }: { difficulty: QuizDifficulty }) => (
    <span className={`px-2.5 py-1 rounded-full border text-[12px] font-semibold ${difficultyStyle[difficulty]}`}>
        {difficultyLabel[difficulty]}
    </span>
);

/* Thin gilded divider */
export const Ornament = () => (
    <div className="flex items-center justify-center gap-3 text-[#A67C2D] my-4 w-full max-w-[400px]" aria-hidden="true">
        <span className="h-px flex-1 bg-[#A67C2D]/50" />
        <span>✦</span>
        <span className="h-px flex-1 bg-[#A67C2D]/50" />
    </div>
);

export const ScrollLoader = ({ text = "Unrolling the scroll..." }: { text?: string }) => (
    <p className="mt-16 italic text-[#3E3025]/70 animate-pulse">{text}</p>
);

export const ErrorBanner = ({ message, onClose }: { message: string; onClose?: () => void }) => (
    <div
        role="alert"
        className="w-[700px] max-w-full mt-5 flex items-start gap-3 bg-[#8B2E2E]/10 border border-[#8B2E2E]/40 text-[#8B2E2E] rounded-[5px] p-3 text-sm font-medium"
    >
        <p className="flex-1">{message}</p>
        {onClose && (
            <button onClick={onClose} aria-label="Dismiss" className="cursor-pointer hover:opacity-70">
                <X size={16} />
            </button>
        )}
    </div>
);

/* Same back button as the other pages */
export const BackButton = () => {
    const navigate = useNavigate();
    return (
        <button
            onClick={() => navigate(-1)}
            className="bg-[#3E3025] text-white absolute left-2 top-2
            flex flex-row justify-center items-center gap-2 px-4 py-1 rounded-[10px]
            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
        >
            <i className="fa-solid fa-arrow-left-long"></i>
            Back
        </button>
    );
};

interface ConfirmDialogProps {
    title: string;
    text: string;
    confirmLabel: string;
    danger?: boolean;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog = ({ title, text, confirmLabel, danger, busy, onConfirm, onCancel }: ConfirmDialogProps) => (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
        <div className="w-[420px] max-w-full bg-[#F5EFE3] border-4 border-double border-[#3E3025] rounded-lg p-6 flex flex-col gap-4 text-center shadow-2xl">
            <h4 className="text-[1.3em] font-bold text-[#3E3025]">{title}</h4>
            <p className="text-gray-700">{text}</p>

            <div className="flex gap-3 justify-center">
                <button
                    onClick={onCancel}
                    disabled={busy}
                    className="px-4 py-2 rounded-[5px] border-2 border-[#3E3025] text-[#3E3025] font-semibold cursor-pointer hover:bg-[#F0E6D8] disabled:opacity-50"
                >
                    Go back
                </button>
                <button
                    onClick={onConfirm}
                    disabled={busy}
                    className={`px-4 py-2 rounded-[5px] text-white font-semibold cursor-pointer hover:opacity-90 disabled:opacity-50 ${danger ? "bg-[#8B2E2E]" : "bg-[#3E3025]"}`}
                >
                    {busy ? "Please wait..." : confirmLabel}
                </button>
            </div>
        </div>
    </div>
);
