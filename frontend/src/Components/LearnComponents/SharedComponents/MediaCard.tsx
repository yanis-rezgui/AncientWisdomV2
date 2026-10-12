import { memo } from "react";

export interface MediaItem {
    _id: string;
    title: string;
    subtitle?: string; // author for books
    description: string;
    imageUrl: string;
    eraName?: string;
}

interface MediaCardProps {
    item: MediaItem;
    onOpen: (item: MediaItem) => void;
}

const MediaCard = ({ item, onOpen }: MediaCardProps) => {
    return (
        <button
            type="button"
            onClick={() => onOpen(item)}
            className="group flex flex-col text-left rounded-lg bg-gray-50 overflow-hidden cursor-pointer
            shadow-lg hover:shadow-2xl hover:-translate-y-1
            transition-all duration-300
            focus-visible:outline-2 focus-visible:outline-[#3E3025]"
        >
            <div className="w-full aspect-[2/3] overflow-hidden bg-gray-200">
                <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover sepia-[0.25]
                    group-hover:sepia-0 group-hover:scale-105
                    transition-all duration-500"
                />
            </div>

            <div className="flex flex-col gap-1 p-3">
                <h3 className="text-[1.05em] font-semibold text-gray-950 leading-tight line-clamp-2">
                    {item.title}
                </h3>

                {item.subtitle && (
                    <p className="text-[13px] text-gray-700 italic line-clamp-1">
                        {item.subtitle}
                    </p>
                )}

                {item.eraName && (
                    <span className="self-start mt-1 py-1 px-3 rounded-full bg-gray-600 text-white text-[12px] line-clamp-1">
                        {item.eraName}
                    </span>
                )}
            </div>
        </button>
    );
};

export default memo(MediaCard);