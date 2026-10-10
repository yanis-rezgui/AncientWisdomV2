import { memo, useEffect } from "react";
import { btnBase } from "./learnFormUtils";

interface DeleteLearnPopProps {
    entity: string;          // "book", "movie"...
    name: string;
    detail?: string;         // "with its image and its 3 section(s)"
    loading: boolean;
    errorMsg?: string | null;
    onClose: () => void;
    onConfirm: () => void;
}

const DeleteLearnPop = ({ entity, name, detail, loading, errorMsg, onClose, onConfirm }: DeleteLearnPopProps) => {

    const closePop = () => {
        if (loading) return;
        onClose();
    };

    // Fermeture avec la touche Échap
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closePop();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

    return (
        <div
            onClick={closePop}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-[420px] max-w-full bg-[#F8F5EF] rounded-lg shadow-xl
                p-5 gap-3 max-[450px]:p-4 justify-center"
            >
                <div className="flex flex-row items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-red-100">
                        <i className="fa-solid fa-triangle-exclamation text-red-900"></i>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#3E3025]">Delete this {entity}?</h3>
                </div>

                <p className="text-[14px] text-gray-700">
                    You are about to delete <span className="font-bold text-[#3E3025]">{name}</span>
                    {detail ? ` ${detail}` : ""}. This action cannot be undone.
                </p>

                {errorMsg && <p className="text-[13px] text-red-800 font-[600]">{errorMsg}</p>}

                <div className="flex flex-row justify-end gap-2 mt-2 max-[450px]:flex-col-reverse max-[450px]:items-stretch">
                    <button
                        type="button"
                        onClick={closePop}
                        disabled={loading}
                        className={`${btnBase} bg-gray-200 text-[#3E3025] text-[14px] rounded-[5px]`}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`${btnBase} bg-red-900 text-white text-[14px] rounded-[5px]`}
                    >
                        {loading ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</>
                        ) : (
                            <><i className="fa-solid fa-trash"></i> Delete {entity}</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteLearnPop);
