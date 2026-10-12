import { memo, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, type LucideIcon } from "lucide-react";

import type { Frame } from "../../../Types/LearnTypes";
import FrameCard from "./FrameCard";

interface FrameSliderProps {
    title: string;
    description: string;
    icon: LucideIcon;
    frames: Frame[];
    loading: boolean;
    onOpen: (frame: Frame) => void;
}

const FrameSlider = ({
    title,
    description,
    icon: Icon,
    frames,
    loading,
    onOpen,
}: FrameSliderProps) => {
    const trackRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateArrows = useCallback(() => {
        const el = trackRef.current;
        if (!el) return;

        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        updateArrows();
        window.addEventListener("resize", updateArrows);
        return () => window.removeEventListener("resize", updateArrows);
    }, [frames, loading, updateArrows]);

    const scrollByPage = (direction: 1 | -1) => {
        const el = trackRef.current;
        if (!el) return;

        el.scrollBy({
            left: direction * el.clientWidth * 0.8,
            behavior: "smooth",
        });
    };

    return (
        <section className="w-full max-w-[1200px] flex flex-col gap-3 px-5 mt-8 pt-6 border-t border-t-gray-400">
            {/* Header */}
            <div className="flex flex-row items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <div className="flex flex-row items-center gap-2">
                        <Icon size={26} className="text-[#3E3025]" />
                        <h2 className="text-[1.4em] font-semibold text-gray-950">
                            {title}
                        </h2>
                    </div>

                    <p className="text-[15px] text-gray-800 max-w-[600px]">
                        {description}
                    </p>
                </div>

                <div className="flex flex-row gap-2 max-[650px]:hidden">
                    <button
                        type="button"
                        onClick={() => scrollByPage(-1)}
                        disabled={!canScrollLeft}
                        aria-label={`Previous ${title}`}
                        className="w-9 h-9 rounded-full bg-[#3E3025] text-white flex items-center justify-center
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-30 disabled:cursor-default"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => scrollByPage(1)}
                        disabled={!canScrollRight}
                        aria-label={`Next ${title}`}
                        className="w-9 h-9 rounded-full bg-[#3E3025] text-white flex items-center justify-center
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-30 disabled:cursor-default"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Track */}
            {loading ? (
                <div className="flex flex-row gap-4 overflow-hidden pt-2 pb-6">
                    {[1, 2, 3, 4].map((n) => (
                        <div
                            key={n}
                            className="shrink-0 w-[270px] max-[450px]:w-[240px] h-[360px] rounded-lg bg-gray-300/60 animate-pulse"
                        />
                    ))}
                </div>
            ) : frames.length === 0 ? (
                <p className="py-8 text-center text-[15px] text-gray-700 italic">
                    No {title.toLowerCase()} have been added to the collection yet.
                </p>
            ) : (
                <div
                    ref={trackRef}
                    onScroll={updateArrows}
                    className="flex flex-row gap-4 overflow-x-auto snap-x snap-mandatory
                    scroll-smooth pt-2 pb-6 -mx-5 px-5 scroll-px-5
                    [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {frames.map((frame) => (
                        <FrameCard
                            key={frame._id}
                            frame={frame}
                            onOpen={onOpen}
                        />
                    ))}
                </div>
            )}
        </section>
    );
};

export default memo(FrameSlider);
