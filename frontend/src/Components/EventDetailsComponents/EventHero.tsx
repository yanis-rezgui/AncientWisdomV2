import { memo, useState } from "react";
import { ArrowRight, Check, MapPin, Share2 } from "lucide-react";
import type { HistoricalEvent } from "../../Types/Types";
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext";

const buttonClass =
    "flex cursor-pointer items-center gap-2 rounded-md border border-[#3E3025] bg-white " +
    "px-3 py-2 text-[14px] font-medium text-[#3E3025] transition-colors duration-200 " +
    "hover:bg-[#3E3025] hover:text-white active:scale-95";

const EventHero = ({ event }: { event: HistoricalEvent }) => {
    const { toggleFavorite, isFavorite } = useSavedItemsContext();
    const [copied, setCopied] = useState(false);

    const saved = isFavorite("Event", event._id);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${event.name} — Ancient Wisdom`,
                    text: `Discover the Historical Event of ${event.name} on Ancient Wisdom.`,
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
            aria-labelledby="event-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 text-center">
                <p className="text-[12px] font-bold uppercase tracking-widest text-gray-500">
                    Historical Event
                </p>

                <h1
                    id="event-title"
                    className="text-[1.8em] font-bold leading-tight text-[#3E3025]"
                >
                    {event.name}
                </h1>

                <span className="block h-[3px] w-12 rounded bg-[#8C6A43]" />

                {/* Dates */}
                <div className="flex items-center justify-center gap-2 font-semibold text-gray-700">
                    <span>{event.startDate}</span>
                    <ArrowRight size={18} aria-hidden="true" />
                    <span>{event.endDate}</span>
                </div>

                {/* Lieu + époque */}
                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[15px] text-gray-700">
                    {event.location && (
                        <p className="flex items-center gap-2">
                            <MapPin size={18} aria-hidden="true" />
                            <span className="font-semibold">{event.location}</span>
                        </p>
                    )}

                    {event.era?.name && (
                        <p>
                            <span className="font-semibold">Era:</span>{" "}
                            <span className="font-medium text-[#8C6A43]">
                                {event.era.name}
                            </span>
                        </p>
                    )}
                </div>

                {event.tags?.length > 0 && (
                    <ul className="flex flex-wrap justify-center gap-2">
                        {event.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[13px] text-gray-700"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}

                <div className="mt-2 flex flex-wrap justify-center gap-3">
                    <button
                        type="button"
                        aria-pressed={saved}
                        onClick={() => toggleFavorite("Event", event._id, event)}
                        className={buttonClass}
                    >
                        <i
                            className="fa-solid fa-heart text-[16px]"
                            style={{ color: saved ? "#B91C1C" : "gray" }}
                        ></i>
                        {saved ? "Saved" : "Save Event"}
                    </button>

                    <button type="button" onClick={handleShare} className={buttonClass}>
                        {copied ? <Check size={15} /> : <Share2 size={15} />}
                        {copied ? "Link copied" : "Share Event"}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default memo(EventHero);