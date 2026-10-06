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
                group relative flex w-[290px] flex-col
                rounded-[8px]
                border border-[#E7DED2]
                bg-[#F8F5EF]
                p-5
                shadow-lg
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
            "
        >

            {/* Header */}
            <header className="flex items-center justify-between">

                <Link
                    to={`/eras/${quote.era._id}`}
                    className="
                        text-[11px]
                        font-[700]
                        uppercase
                        tracking-[0.12em]
                        text-[#8B2E2E]
                        transition-colors
                        hover:text-[#5F1F1F]
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
                        flex h-8 w-8 items-center justify-center
                        rounded-full
                        transition-all duration-200
                        hover:bg-[#EDE4D8]
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                    "
                >
                    <Heart
                        size={16}
                        strokeWidth={1.8}
                        fill={favorite ? "#B91C1C" : "none"}
                        className={
                            favorite
                                ? "text-[#B91C1C]"
                                : "text-[#6B6259]"
                        }
                    />
                </button>

            </header>


            {/* Quote */}
            <div className="mt-5">

                <span
                    aria-hidden="true"
                    className="
                        block
                        font-serif
                        text-[42px]
                        leading-[20px]
                        text-[#B89B72]
                    "
                >
                    “
                </span>

                <p
                    className="
                        px-2
                        py-2
                        font-serif
                        text-[17px]
                        font-[500]
                        leading-[1.65]
                        text-[#3E3025]
                    "
                >
                    {quote.text}
                </p>

                <span
                    aria-hidden="true"
                    className="
                        block
                        text-right
                        font-serif
                        text-[42px]
                        leading-[20px]
                        text-[#B89B72]
                    "
                >
                    ”
                </span>

            </div>


            {/* Author / Source */}
            <div className="mt-5 border-t border-[#DED3C5] pt-4">

                <Link
                    to={`/author/${quote.author._id}`}
                    className="
                        block
                        text-[15px]
                        font-[700]
                        text-[#3E3025]
                        transition-colors
                        hover:text-[#8B2E2E]
                    "
                >
                    {quote.author.name}
                </Link>

                {quote.source && (
                    <p className="
                        mt-1
                        text-[12px]
                        italic
                        text-[#756A5F]
                    ">
                        {quote.source}
                    </p>
                )}

            </div>


            {/* Footer */}
            <Link
                to={`/quote/${quote._id}`}
                className="
                    mt-5
                    flex
                    items-center
                    gap-1
                    self-start
                    text-[13px]
                    font-[600]
                    text-[#3E3025]
                    transition-all duration-200
                    group-hover:gap-2
                    hover:text-[#8B2E2E]
                "
            >
                Explore quote
                <ArrowUpRight size={14} strokeWidth={2} />
            </Link>

        </article>
    );
};

export default memo(QuoteCard);

