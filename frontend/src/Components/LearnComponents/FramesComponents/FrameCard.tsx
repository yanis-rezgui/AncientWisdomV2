import { memo } from "react";
import { MapPin } from "lucide-react";

import type { Frame } from "../../../Types/LearnTypes";

interface FrameCardProps {
    frame: Frame;
    onOpen: (frame: Frame) => void;
}

const FrameCard = ({ frame, onOpen }: FrameCardProps) => {
    return (
        <button
            type="button"
            onClick={() => onOpen(frame)}
            className="group snap-start shrink-0 w-[270px] max-[450px]:w-[240px]
            flex flex-col text-left rounded-lg bg-gray-50 overflow-hidden cursor-pointer
            shadow-lg hover:shadow-2xl hover:-translate-y-1
            transition-all duration-300
            focus-visible:outline-2 focus-visible:outline-[#3E3025]"
        >
            <div className="w-full h-[190px] overflow-hidden bg-gray-200">
                <img
                    src={frame.image.url}
                    alt={frame.title}
                    loading="lazy"
                    className="w-full h-full object-cover sepia-[0.25]
                    group-hover:sepia-0 group-hover:scale-105
                    transition-all duration-500"
                />
            </div>

            <div className="flex flex-col gap-1 p-3">
                <h3 className="text-[1.1em] font-semibold text-gray-950 leading-tight line-clamp-2">
                    {frame.title}
                </h3>

                {frame.location && (
                    <p className="flex flex-row items-center gap-1 text-[13px] text-gray-700">
                        <MapPin size={14} className="shrink-0" />
                        <span className="line-clamp-1">{frame.location}</span>
                    </p>
                )}

                {frame.description && (
                    <p className="text-[14px] text-gray-800 leading-4.5 line-clamp-3 mt-1">
                        {frame.description}
                    </p>
                )}

                <div className="flex flex-row items-center justify-between gap-2 mt-2">
                    {frame.era?.name ? (
                        <span className="py-1 px-3 rounded-full bg-gray-600 text-white text-[12px] line-clamp-1">
                            {frame.era.name}
                        </span>
                    ) : (
                        <span />
                    )}

                    <span className="text-[13px] font-semibold text-[#3E3025] shrink-0">
                        View details
                    </span>
                </div>
            </div>
        </button>
    );
};

export default memo(FrameCard);
