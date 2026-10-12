import { memo, useEffect } from "react";
import { MapPin, X } from "lucide-react";

import type { Frame } from "../../../Types/LearnTypes";

interface FrameModalProps {
    frame: Frame | null;
    onClose: () => void;
}

const FrameModal = ({ frame, onClose }: FrameModalProps) => {
    // Close with Escape + lock the page scroll while open
    useEffect(() => {
        if (!frame) return;

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
    }, [frame, onClose]);

    if (!frame) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-label={frame.title}
        >
            <div
                className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-lg bg-gray-50 shadow-2xl"
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

                <div className="w-full bg-[#3E3025]/10">
                    <img
                        src={frame.image.url}
                        alt={frame.title}
                        className={`w-full max-h-[50vh] ${
                            frame.type === "Map" ? "object-contain" : "object-cover"
                        }`}
                    />
                </div>

                <div className="flex flex-col gap-2 p-4">
                    <div className="flex flex-row flex-wrap items-center gap-2">
                        <span className="py-1 px-3 rounded-full bg-[#3E3025] text-white text-[12px] font-semibold">
                            {frame.type}
                        </span>

                        {frame.era?.name && (
                            <span className="py-1 px-3 rounded-full bg-gray-600 text-white text-[12px]">
                                {frame.era.name}
                            </span>
                        )}
                    </div>

                    <h2 className="text-[1.4em] font-semibold text-gray-950 leading-tight">
                        {frame.title}
                    </h2>

                    {frame.location && (
                        <p className="flex flex-row items-center gap-1 text-[14px] text-gray-700">
                            <MapPin size={15} className="shrink-0" />
                            {frame.location}
                        </p>
                    )}

                    {frame.description && (
                        <p className="text-[15px] text-gray-800 leading-6 mt-1">
                            {frame.description}
                        </p>
                    )}

                    {frame.source && (
                        <p className="text-[13px] text-gray-600 italic mt-2 pt-2 border-t border-t-gray-300">
                            Source: {frame.source}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(FrameModal);
