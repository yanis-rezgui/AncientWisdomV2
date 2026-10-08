import { memo } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { HistoricalEvent } from "../../Types/Types";
import { useEventsAdminContext } from "../../AdminContexts/EventsAdminContext";


const AdminEventCard = ({ event }: { event: HistoricalEvent }) => {

    const navigate = useNavigate();
    const { setShowDeletePop, setEventDelete } = useEventsAdminContext();

    return (
        <div className="flex flex-col w-[900px] bg-[#F8F5EF] rounded-lg
        gap-2 p-4
        shadow-lg
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        max-[950px]:w-[600px]
        max-[620px]:w-[320px]
        ">
            {/* ---------- Titre + ère ---------- */}
            <div className="flex flex-row justify-between items-start gap-3 max-[620px]:flex-col">
                <h3 className="text-[18px] font-[600] text-[#3E3025]">
                    {event.name}
                </h3>

                {event.era && (
                    <span className="bg-[#3E3025] text-white text-[12px] font-[600] px-3 py-1 rounded-full whitespace-nowrap">
                        {event.era.name}
                    </span>
                )}
            </div>

            {/* ---------- Dates ---------- */}
            <div className="flex items-center gap-2 text-[17px] font-bold text-gray-600">
                <span>{event.startDate}</span>

                <ArrowRight size={15} />

                <span>{event.endDate}</span>
            </div>

            {/* ---------- Lieu ---------- */}
            <div className="flex items-center gap-1 text-[14px] text-gray-700">
                <MapPin size={15} />
                <span>{event.location}</span>
            </div>

            {/* ---------- Description ---------- */}
            {event.description && (
                <p className="text-[14px] text-gray-700 line-clamp-3">
                    {event.description}
                </p>
            )}

            {/* ---------- Tags ---------- */}
            {event.tags?.length > 0 && (
                <div className="flex flex-row flex-wrap gap-2">
                    {event.tags.map((tag) => (
                        <span
                            key={tag}
                            className="bg-white border border-gray-200 text-[12px] font-[600]
                            text-[#3E3025] px-2 py-0.5 rounded-full"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* ---------- Sections + actions ---------- */}
            <div className="flex flex-row w-full justify-between items-center mt-1">
                <p className="text-[17px] text-gray-950">
                    {event.sections?.length ?? 0} sections
                </p>

                <div className="flex flex-row justify-center items-center gap-2">
                    <button
                        className="bg-green-900 text-white text-[13px] font-[600] p-2
                        rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80
                        active:opacity-60"
                        onClick={() => navigate(`/admin/event/${event._id}`)}
                    >
                        <i className="fa-solid fa-pen-to-square"></i> Update
                    </button>

                    <button
                        className="bg-red-900 text-white text-[13px] font-[600] p-2
                        rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80
                        active:opacity-60"
                        onClick={() => {
                            setEventDelete(event);
                            setShowDeletePop(true);
                        }}
                    >
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(AdminEventCard);