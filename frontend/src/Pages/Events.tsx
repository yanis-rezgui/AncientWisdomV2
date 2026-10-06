import { memo } from "react"
import EventsFilter from "../Components/EventsComponents/EventsFilter";
import { useEventContext } from "../Contexts/EventContext";
import EventComponent from "../Components/EventsComponents/EventComponent";
import { useNavigate } from "react-router-dom";


const Events = () => {


    const {events} = useEventContext();
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

            <div className="flex flex-wrap justify-center items-center gap-5 mt-10">
             {events.map((e)=>{
                return(
                    <EventComponent event={e} key={e._id}/>
                )
             })}
             </div>

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