import { memo, useState } from "react";
import { Check, Share2 } from "lucide-react";
import type { HistoricalFigure } from "../../Types/Types";
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext";

const buttonClass =
    "flex cursor-pointer items-center gap-2 rounded-md border border-[#3E3025] bg-white " +
    "px-3 py-2 text-[14px] font-medium text-[#3E3025] transition-colors duration-200 " +
    "hover:bg-[#3E3025] hover:text-white active:scale-95";

const FigureOverview = ({ figure }: { figure: HistoricalFigure }) => {
    const { toggleFavorite, isFavorite } = useSavedItemsContext();
    const [copied, setCopied] = useState(false);

    const saved = isFavorite("Figure", figure._id);
    const lifespan = [figure.birthDate, figure.deathDate].filter(Boolean).join(" – ");
    const eraNames = figure.eras.map((e) => e.name).join(" · ");

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${figure.name} — Ancient Wisdom`,
                    text: `Discover the story of ${figure.name} on Ancient Wisdom.`,
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
            setTimeout(() => setCopied(false), 2000);
        } catch {
            console.error("Unable to copy the link");
        }
    };

    return (
        <section
            aria-labelledby="figure-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <div
                className="flex flex-col items-center gap-6 rounded-lg border border-gray-200
                bg-white p-5 min-[620px]:flex-row min-[620px]:items-start min-[620px]:gap-8"
            >
                <img
                    src={figure.image.url}
                    alt={`Portrait of ${figure.name}`}
                    className="aspect-[3/4] w-[200px] shrink-0 rounded-lg bg-gray-100 object-cover object-top"
                />

                <div className="flex flex-col items-center gap-3 text-center min-[620px]:items-start min-[620px]:text-left">
                    <h1
                        id="figure-title"
                        className="text-[1.8em] font-bold leading-tight text-[#3E3025]"
                    >
                        {figure.name}
                    </h1>

                    {lifespan && (
                        <p className="font-semibold text-gray-700">{lifespan}</p>
                    )}

                    {figure.tags?.length > 0 && (
                        <ul className="flex flex-wrap justify-center gap-2 min-[620px]:justify-start">
                            {figure.tags.map((tag) => (
                                <li
                                    key={tag}
                                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[13px] text-gray-700"
                                >
                                    {tag}
                                </li>
                            ))}
                        </ul>
                    )}

                    {eraNames && (
                        <p className="text-[15px] text-gray-700">
                            <span className="font-semibold">
                                {figure.eras.length === 1 ? "Era" : "Eras"}:
                            </span>{" "}
                            {eraNames}
                        </p>
                    )}

                    <div className="mt-2 flex flex-wrap justify-center gap-3 min-[620px]:justify-start">
                        <button
                            type="button"
                            aria-pressed={saved}
                            onClick={() => toggleFavorite("Figure", figure._id, figure)}
                            className={buttonClass}
                        >
                            <i
                                className="fa-solid fa-heart text-[16px]"
                                style={{ color: saved ? "#B91C1C" : "gray" }}
                            ></i>
                            {saved ? "Saved" : "Save Figure"}
                        </button>

                        <button type="button" onClick={handleShare} className={buttonClass}>
                            {copied ? <Check size={15} /> : <Share2 size={15} />}
                            {copied ? "Link copied" : "Share Figure"}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(FigureOverview);