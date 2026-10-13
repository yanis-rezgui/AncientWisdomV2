import { memo } from "react";
import { Heart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { Quote } from "../../Types/Types";
import { useAuthContext } from "../../Contexts/AuthContext";
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext";

interface QuoteCardProps {
    quote: Quote;
}

const QuoteCard = ({ quote }: QuoteCardProps) => {
    const { user } = useAuthContext();
    const { isFavorite, toggleFavorite } = useSavedItemsContext();

    const favorite = isFavorite("Quote", quote._id);

    const handleFavorite = () => {
        if (!user) return;
        toggleFavorite("Quote", quote._id);
    };

    return (
        <article
            className="
                group relative flex h-[320px] w-[260px] shrink-0 flex-col
                overflow-hidden
                rounded-lg
                border border-[#E7DED2]
                bg-[#F8F5EF]
                p-4
                shadow-md
                transition-all duration-300
                hover:-translate-y-1 hover:shadow-xl
            "
        >
            {/* Header */}
            <header className="flex h-8 shrink-0 items-center justify-between gap-2">
                <Link
                    to={`/eras/${quote.era._id}`}
                    className="
                        truncate text-[11px] font-bold uppercase tracking-[0.12em]
                        text-[#8B2E2E] transition-colors hover:text-[#5F1F1F]
                    "
                >
                    {quote.era.name}
                </Link>

                <button
                    type="button"
                    onClick={handleFavorite}
                    disabled={!user}
                    aria-label={
                        favorite
                            ? "Remove quote from favorites"
                            : "Add quote to favorites"
                    }
                    className="
                        flex h-8 w-8 shrink-0 items-center justify-center
                        rounded-full transition-colors duration-200
                        hover:bg-[#EDE4D8]
                        disabled:cursor-not-allowed disabled:opacity-50
                    "
                >
                    <Heart
                        size={16}
                        strokeWidth={1.8}
                        fill={favorite ? "#B91C1C" : "none"}
                        className={favorite ? "text-[#B91C1C]" : "text-[#6B6259]"}
                    />
                </button>
            </header>

            {/* Quote */}
            <div className="mt-3 min-h-0 flex-1 overflow-hidden">
                <span
                    aria-hidden="true"
                    className="block font-serif text-[40px] leading-[28px] text-[#B89B72]"
                >
                    “
                </span>

                <p
                    title={quote.text}
                    className="
                        line-clamp-6
                        font-serif text-[15px] font-medium leading-[1.6]
                        text-[#3E3025]
                    "
                >
                    {quote.text}
                </p>
            </div>

            {/* Footer */}
            <footer className="mt-3 flex h-[52px] shrink-0 items-center justify-between gap-3 border-t border-[#DED3C5] pt-3">
                <div className="min-w-0">
                    <Link
                        to={`/figure/${quote.author._id}`}
                        className="
                            block truncate text-[14px] font-bold text-[#3E3025]
                            transition-colors hover:text-[#8B2E2E]
                        "
                    >
                        {quote.author.name}
                    </Link>

                    {quote.source && (
                        <p className="truncate text-[11px] italic text-[#756A5F]">
                            {quote.source}
                        </p>
                    )}
                </div>

                <Link
                    to={`/quote/${quote._id}`}
                    aria-label="Explore quote"
                    className="
                        flex h-8 w-8 shrink-0 items-center justify-center
                        rounded-full text-[#3E3025]
                        transition-colors duration-200
                        hover:bg-[#8B2E2E] hover:text-white
                    "
                >
                    <ArrowUpRight size={16} strokeWidth={2} />
                </Link>
            </footer>
        </article>
    );
};

export default memo(QuoteCard);