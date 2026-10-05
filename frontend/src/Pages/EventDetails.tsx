import { memo, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom";
import { useEventContext } from "../Contexts/EventContext";
import EventHero from "../Components/EventDetailsComponents/EventHero";
import EventOverview from "../Components/EventDetailsComponents/EventOverview";
import EventContent from "../Components/EventDetailsComponents/EventContent";

const EventDetails = () => {

    const {id} = useParams();
    const {getEvent, currentEvent, loadingEvent} = useEventContext();

    const navigate = useNavigate();

    useEffect(()=>{
        getEvent(id);
    }, [id]);

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">
           
           {loadingEvent ?
              <p className="text-[1.2em] mt-10 text-center">
                Loading...
              </p>
              : 
                !currentEvent ?
                   
                   <div className="flex flex-col gap-3 bg-gray-50 rounded-lg mt-10 gap-5 py-5">
                <img src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791209455/5a4e2179-7bac-4e92-b6ab-c526c277d5e1.png"
                alt="" 
                className="w-[300px]"
                />

                <p className="text-center text-[1.4em] font-bold">
                    Event Not Found
                </p>
              </div>
               : 
                 <>
                   <EventHero event={currentEvent}/>
                   <EventOverview description={currentEvent.description}/>
                   <EventContent event={currentEvent}/>
                 </>
            }

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

export default memo(EventDetails);