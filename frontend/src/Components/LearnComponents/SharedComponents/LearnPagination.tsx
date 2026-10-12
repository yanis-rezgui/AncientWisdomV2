import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface LearnPaginationProps {
    page: number;
    totalPages: number;
    onChange: (page: number) => void;
}

const LearnPagination = ({ page, totalPages, onChange }: LearnPaginationProps) => {
    if (totalPages <= 1) return null;

    const buttonClass =
        "w-9 h-9 rounded-full bg-[#3E3025] text-white flex items-center justify-center cursor-pointer " +
        "transition-opacity duration-200 hover:opacity-80 active:opacity-60 " +
        "disabled:opacity-30 disabled:cursor-default";

    return (
        <div className="flex flex-row items-center justify-center gap-4 mt-8">
            <button
                type="button"
                onClick={() => onChange(page - 1)}
                disabled={page <= 1}
                aria-label="Previous page"
                className={buttonClass}
            >
                <ChevronLeft size={18} />
            </button>

            <p className="text-[14px] font-semibold text-gray-800">
                Page {page} of {totalPages}
            </p>

            <button
                type="button"
                onClick={() => onChange(page + 1)}
                disabled={page >= totalPages}
                aria-label="Next page"
                className={buttonClass}
            >
                <ChevronRight size={18} />
            </button>
        </div>
    );
};

export default memo(LearnPagination);