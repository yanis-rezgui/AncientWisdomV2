import { memo, useState } from "react";
import { Heart, ArrowLeft, Check, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Quote } from "../../Types/Types";
import { useAuthContext } from "../../Contexts/AuthContext";
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext";

interface QuoteHeroProps {
    quote: Quote;
}

const QuoteHero = ({ quote }: QuoteHeroProps) => {

    const { user } = useAuthContext();
    const { isFavorite, toggleFavorite } = useSavedItemsContext();

    const favorite = isFavorite("Quote", quote._id);

  
        
    
        const [copied, setCopied] = useState(false);
    
        // =========================
        // SHARE
        // =========================
    
        const handleShare = async () => {
            const url = window.location.href;
    
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: `${quote.author.name} Quote — Ancient Wisdom`,
                        text: `Read a Quote from ${quote.author.name} on Ancient Wisdom.`,
                        url,
                    });
                } catch {
                    // L'utilisateur a annulé le partage
                }
    
                return;
            }
    
            try {
                await navigator.clipboard.writeText(url);
    
                setCopied(true);
    
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            } catch {
                console.error("Unable to copy the link");
            }
        };

    return (
        <section className="relative w-full overflow-hidden">

            {/* Decorative background */}
            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0
                    h-[500px]
                    w-[500px]
                    -translate-x-1/2
                    rounded-full
                    bg-[#B89B72]/5
                    blur-3xl
                "
            />

            <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-5 py-12 md:px-8 md:py-20">

                {/* Back */}
                <div className="mb-10 w-full">
                    <Link
                        to="/quotes"
                        className="
                            inline-flex
                            items-center
                            gap-2
                            text-[13px]
                            font-medium
                            text-[#6B625A]
                            transition-colors
                            duration-200
                            hover:text-[#3E3025]
                        "
                    >
                        <ArrowLeft size={16} strokeWidth={1.7} />
                        Back to quotes
                    </Link>
                </div>


                {/* Era */}
                <div className="flex flex-col items-center">

                    <span
                        className="
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.28em]
                            text-[#8B2E2E]
                        "
                    >
                        {quote.era.name}
                    </span>

                    <div
                        className="
                            mt-3
                            h-px
                            w-10
                            bg-[#B89B72]
                        "
                    />

                </div>


                {/* Quote */}
                <div className="mt-10 w-full max-w-4xl text-center">

                    {/* Opening quote */}
                    <span
                        aria-hidden="true"
                        className="
                            block
                            font-serif
                            text-[72px]
                            leading-[35px]
                            text-[#B89B72]
                            md:text-[90px]
                        "
                    >
                        “
                    </span>

                    <blockquote
                        className="
                            mx-auto
                            max-w-4xl
                            px-4
                            font-serif
                            text-[28px]
                            font-medium
                            leading-[1.45]
                            tracking-[-0.01em]
                            text-[#3E3025]
                            md:text-[38px]
                            md:leading-[1.4]
                            lg:text-[46px]
                        "
                    >
                        {quote.text}
                    </blockquote>

                    {/* Closing quote */}
                    <span
                        aria-hidden="true"
                        className="
                            mt-3
                            block
                            text-right
                            font-serif
                            text-[72px]
                            leading-[35px]
                            text-[#B89B72]
                            md:text-[90px]
                        "
                    >
                        ”
                    </span>

                </div>


                {/* Author */}
                <div className="mt-8 flex flex-col items-center text-center">

                    <Link
                        to={`/author/${quote.author._id}`}
                        className="
                            font-serif
                            text-[20px]
                            font-semibold
                            text-[#3E3025]
                            underline-offset-4
                            transition-colors
                            duration-200
                            hover:text-[#8B2E2E]
                            hover:underline
                        "
                    >
                        {quote.author.name}
                    </Link>

                    {quote.source && (
                        <p className="mt-2 text-[14px] text-[#7A7068]">
                            {quote.source}
                        </p>
                    )}

                </div>


                {/* Actions */}
                <div className="flex flex-row justify-center items-center gap-2 mt-8">
                   <button
                        onClick={handleShare}
                        className="
                          inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-[#D8CEC1]
                                bg-[#F8F5EF]
                                px-5
                                py-2.5
                                text-[13px]
                                font-medium
                                text-[#3E3025]
                                shadow-sm
                                transition-all
                                duration-200
                                hover:border-[#B89B72]
                                hover:-translate-y-0.5
                        "
                    >
                        {copied ? (
                            <Check size={15} />
                        ) : (
                            <Share2 size={15} />
                        )}

                        {copied
                            ? "Link copied"
                            : "Share Figure"}
                    </button>
                {user && (
                   

                        <button
                            type="button"
                            onClick={() => toggleFavorite("Quote", quote._id)}
                            aria-label={
                                favorite
                                    ? "Remove quote from favorites"
                                    : "Save quote to favorites"
                            }
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-[#D8CEC1]
                                bg-[#F8F5EF]
                                px-5
                                py-2.5
                                text-[13px]
                                font-medium
                                text-[#3E3025]
                                shadow-sm
                                transition-all
                                duration-200
                                hover:border-[#B89B72]
                                hover:-translate-y-0.5
                            "
                        >
                            <Heart
                                size={16}
                                strokeWidth={1.8}
                                fill={favorite ? "#B91C1C" : "none"}
                                className={
                                    favorite
                                        ? "text-[#B91C1C]"
                                        : "text-[#6B625A]"
                                }
                            />

                            {favorite
                                ? "Saved to favorites"
                                : "Save this quote"
                            }
                        </button>

                    
                )}
                </div>

            </div>

        </section>
    );
};

export default memo(QuoteHero);