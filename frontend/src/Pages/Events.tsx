import { memo } from "react"
import EventsFilter from "../Components/EventsComponents/EventsFilter";
import { useEventContext } from "../Contexts/EventContext";
import EventComponent from "../Components/EventsComponents/EventComponent";
import { useNavigate } from "react-router-dom";
import Pagination from "../Components/Pagination/Pagination";


const Events = () => {


    const {events, page, setPage, limit, setLimit, totalEvents, totalPages} = useEventContext();
    const navigate = useNavigate();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">

            <h2 className="mt-10 text-[2em] font-bold">
                Historical Events
             </h2>

            <p className="text-center mt-3 font-bold">
                Explore the moments, conflicts, discoveries,
                 and turning points that shaped civilizations and changed the course of history.
             </p>

             <EventsFilter/>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-10 mt-10 place-items-center justify-center">
             {events.map((e)=>{
                return(
                    <EventComponent event={e} key={e._id}/>
                )
             })}
             </div>

              <Pagination
                                      page={page}
                                      totalPages={totalPages} 
                                      totalItems={totalEvents} 
                                      limit={limit} 
                                      setPage={setPage} 
                                      setLimit={setLimit} 
                                      />

             <button
            onClick={()=>navigate(-1)}
            className="bg-[#3E3025] text-white absolute left-2 top-2
            flex flex-row justify-center items-center gap-2 px-4 py-1 rounded-[10px]
            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
            ">
                <i className="fa-solid fa-arrow-left-long"></i>
                Back
            </button>
        </section>
    )
}

export default memo(Events);