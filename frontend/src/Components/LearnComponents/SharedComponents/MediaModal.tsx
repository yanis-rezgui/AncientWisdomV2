import { memo, useEffect } from "react";
import { X } from "lucide-react";

import type { MediaItem } from "./MediaCard";

interface MediaModalProps {
    item: MediaItem | null;
    kindLabel: string; // "Book" | "Movie"
    onClose: () => void;
}

const MediaModal = ({ item, kindLabel, onClose }: MediaModalProps) => {
    useEffect(() => {
        if (!item) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };

        document.addEventListener("keydown", onKeyDown);
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = previousOverflow;
        };
    }, [item, onClose]);

    if (!item) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
        >
            <div
                className="relative w-full max-w-[720px] max-h-[90vh] overflow-y-auto rounded-lg bg-gray-50 shadow-2xl
                flex flex-row max-[600px]:flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#3E3025] text-white
                    flex items-center justify-center cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    <X size={18} />
                </button>

                <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-[260px] shrink-0 object-cover bg-gray-200
                    max-[600px]:w-full max-[600px]:max-h-[320px]"
                />

                <div className="flex flex-col gap-2 p-4 pr-14 max-[600px]:pr-4">
                    <div className="flex flex-row flex-wrap items-center gap-2">
                        <span className="py-1 px-3 rounded-full bg-[#3E3025] text-white text-[12px] font-semibold">
                            {kindLabel}
                        </span>

                        {item.eraName && (
                            <span className="py-1 px-3 rounded-full bg-gray-600 text-white text-[12px]">
                                {item.eraName}
                            </span>
                        )}
                    </div>

                    <h2 className="text-[1.4em] font-semibold text-gray-950 leading-tight">
                        {item.title}
                    </h2>

                    {item.subtitle && (
                        <p className="text-[14px] text-gray-700 italic">
                            by {item.subtitle}
                        </p>
                    )}

                    {item.description && (
                        <p className="text-[15px] text-gray-800 leading-6 mt-1">
                            {item.description}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(MediaModal);