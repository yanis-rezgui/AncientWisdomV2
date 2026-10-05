import { memo } from "react";
import type { HistoricalEvent } from "../../Types/Types";
import { Link } from "react-router-dom";
import { ArrowRight,  Locate } from "lucide-react";

const EventComponent = ({ event }: { event: HistoricalEvent }) => {
    return (
        <article
            className="
                w-[300px]
                bg-gray-50
                rounded-lg
                shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all
                duration-300
                flex
                flex-col
                gap-3
                p-4
            "
        >
            {/* Event name */}
            <h4
                className="
                    text-[1.2em]
                    font-bold
                    text-center
                    leading-5.5
                    text-[#3E3025]
                "
            >
                {event.name}
            </h4>

            {/* Dates */}
            <div
                className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[13px]
                    font-medium
                    text-gray-600
                "
            >
                <span>{event.startDate}</span>

                <ArrowRight size={14} />

                <span>{event.endDate}</span>
            </div>

            {/* Location */}
            <div
                className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-sm
                    text-gray-700
                "
            >
                <Locate size={16} />

                <span className="font-semibold">
                    {event.location}
                </span>
            </div>

            {/* Tags */}
            <div
                className="
                    flex
                    flex-wrap
                    justify-center
                    gap-2
                    mt-1
                "
            >
                {event.tags.map((tag) => (
                    <span
                        key={tag}
                        className="
                            px-2.5
                            py-1
                            rounded-full
                            bg-[#F0E6D8]
                            text-[#3E3025]
                            text-[12px]
                            font-medium
                        "
                    >
                        {tag}
                    </span>
                ))}
            </div>

            {/* Details */}
            <Link
                to={`/event/${event._id}`}
                className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    bg-[#3E3025]
                    text-white
                    p-2
                    font-semibold
                    rounded-[5px]
                    transition-all
                    duration-200
                    hover:opacity-90
                    active:scale-[0.98]
                    mt-2
                "
            >
                Read
                <ArrowRight size={17} />
            </Link>
        </article>
    );
};

export default memo(EventComponent);