import { memo } from "react";
import { Link } from "react-router-dom";
import EventsFilter from "../Components/EventsComponents/EventsFilter";
import Pagination from "../Components/Pagination/Pagination";
import AdminEventCard from "../AdminComponents/AdminEventsComponents/AdminEventCard";
import DeleteEventPop from "../AdminComponents/AdminEventsComponents/DeleteEventPop";
import { useEventContext } from "../Contexts/EventContext";
import { useEventsAdminContext } from "../AdminContexts/EventsAdminContext";


const AdminEvents = () => {

    // ⚠️ À adapter si les noms diffèrent dans ton EventContext
    const { totalEvents, events, page, totalPages, limit, setPage, setLimit } = useEventContext();
    const { showDeletePop } = useEventsAdminContext();

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6]">

            <div className="w-[900px] flex flex-row  items-center justify-between mt-10
            max-[950px]:w-[600px] max-[650px]:flex-col max-[650px]:justify-center
            max-[650px]:px-4 max-[650px]:gap-3
            ">
                <h2 className="text-[#3E3025] text-[1.5em] font-[600]">
                    Historical Events
                </h2>

                <Link to={"/admin/addEvent"} className="bg-[#3E3025] text-white text-[14px] font-[600]
                p-2 rounded-lg cursor-pointer transition-opacity duration-200 
                hover:opacity-80 active:opacity-60
                ">
                    + Add Event
                </Link>
            </div>

            <p className="text-[#3E3025] mt-5 px-4 text-center">
                Explore and manage the major events that shaped history.
            </p>

            <EventsFilter />

            <div className="flex flex-row justify-center items-center gap-2 mt-5 font-[600] text-[18px]">
                <p>Total Events :</p>
                <p>{totalEvents}</p>
            </div>

            <div className="flex flex-col justify-center items-center gap-4 mt-5">
                {events.length === 0 ? (
                    <p className="text-[#3E3025] mt-10 text-center">No events found.</p>
                ) : (
                    events.map((e) => (
                        <AdminEventCard event={e} key={e._id} />
                    ))
                )}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={totalEvents}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
            />

            {showDeletePop && <DeleteEventPop />}
        </section>
    );
};

export default memo(AdminEvents);