import { memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    totalItems?: number;
    limit?: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    setLimit?: React.Dispatch<React.SetStateAction<number>>;
}

const Pagination = ({
    page,
    totalPages,
    totalItems,
    limit = 10,
    setPage,
    setLimit
}: PaginationProps) => {

    if (totalPages <= 1 && !setLimit) {
        return null;
    }

    const goToPage = (newPage: number) => {
        if (newPage < 1 || newPage > totalPages) return;

        setPage(newPage);

        // Remonte automatiquement en haut de la liste
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const getPages = () => {

        const pages: (number | "...")[] = [];

        // Peu de pages
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }

            return pages;
        }

        // Début
        if (page <= 4) {
            return [1, 2, 3, 4, 5, "...", totalPages];
        }

        // Fin
        if (page >= totalPages - 3) {
            return [
                1,
                "...",
                totalPages - 4,
                totalPages - 3,
                totalPages - 2,
                totalPages - 1,
                totalPages
            ];
        }

        // Milieu
        return [
            1,
            "...",
            page - 1,
            page,
            page + 1,
            "...",
            totalPages
        ];
    };

    const pages = getPages();

    const firstItem = totalItems
        ? (page - 1) * limit + 1
        : null;

    const lastItem = totalItems
        ? Math.min(page * limit, totalItems)
        : null;

    return (
        <div className="w-full flex flex-col gap-4 mt-8 mb-8">

            {/* Informations */}
            {totalItems !== undefined && totalItems > 0 && (
                <div className="text-center text-sm text-[#3E3025]/70">
                    Showing{" "}
                    <span className="font-semibold text-[#3E3025]">
                        {firstItem}
                    </span>
                    {" - "}
                    <span className="font-semibold text-[#3E3025]">
                        {lastItem}
                    </span>
                    {" of "}
                    <span className="font-semibold text-[#3E3025]">
                        {totalItems}
                    </span>
                </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                {/* Previous */}
                <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="
                        flex items-center justify-center gap-1
                        px-3 py-2
                        rounded-lg
                        border border-[#3E3025]/20
                        text-[#3E3025]
                        bg-white
                        transition-all duration-200
                        hover:bg-[#3E3025]
                        hover:text-white
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        disabled:hover:bg-white
                        disabled:hover:text-[#3E3025]
                    "
                >
                    <ChevronLeft size={18} />

                    <span className="hidden sm:block">
                        Previous
                    </span>
                </button>

                {/* Pages */}
                <div className="flex items-center gap-1">

                    {pages.map((item, index) => {

                        if (item === "...") {
                            return (
                                <span
                                    key={`dots-${index}`}
                                    className="
                                        w-9 h-9
                                        flex items-center justify-center
                                        text-[#3E3025]/60
                                    "
                                >
                                    ...
                                </span>
                            );
                        }

                        const isActive = item === page;

                        return (
                            <button
                                type="button"
                                key={item}
                                onClick={() => goToPage(item)}
                                className={`
                                    w-9 h-9
                                    flex items-center justify-center
                                    rounded-lg
                                    text-sm font-semibold
                                    transition-all duration-200
                                    ${
                                        isActive
                                            ? "bg-[#3E3025] text-white shadow-sm"
                                            : "bg-white text-[#3E3025] border border-[#3E3025]/20 hover:bg-[#3E3025] hover:text-white"
                                    }
                                `}
                            >
                                {item}
                            </button>
                        );
                    })}

                </div>

                {/* Next */}
                <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="
                        flex items-center justify-center gap-1
                        px-3 py-2
                        rounded-lg
                        border border-[#3E3025]/20
                        text-[#3E3025]
                        bg-white
                        transition-all duration-200
                        hover:bg-[#3E3025]
                        hover:text-white
                        disabled:opacity-40
                        disabled:cursor-not-allowed
                        disabled:hover:bg-white
                        disabled:hover:text-[#3E3025]
                    "
                >
                    <span className="hidden sm:block">
                        Next
                    </span>

                    <ChevronRight size={18} />
                </button>

            </div>

            {/* Limit */}
            {setLimit && (
                <div className="flex items-center justify-center gap-2 text-sm text-[#3E3025]">

                    <span>
                        Items per page:
                    </span>

                    <select
                        value={limit}
                        onChange={(e) => {
                            setLimit(Number(e.target.value));
                            setPage(1);
                        }}
                        className="
                            px-2 py-1.5
                            bg-white
                            border border-[#3E3025]/20
                            rounded-lg
                            text-[#3E3025]
                            outline-none
                            cursor-pointer
                        "
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                    </select>

                </div>
            )}

        </div>
    );
};

export default memo(Pagination);