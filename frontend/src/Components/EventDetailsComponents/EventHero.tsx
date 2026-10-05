import { memo } from "react"
import type { HistoricalEvent } from "../../Types/Types";
import { ArrowRight, LocateFixedIcon } from "lucide-react";



const EventHero = ({event} : {event : HistoricalEvent}) => {

    return(
        <section className="flex flex-col w-[900px] bg-gray-50
        p-3 rounded-lg shadow-2xl gap-2 max-[920px]:w-[600px]
        max-[620px]:w-[320px] justify-center items-center
        mt-10
        ">
 
            <h3 className="text-gray-600 font-bold">
                HISTORICAL EVENT
            </h3>

            <h3 className="text-[1.5em] text-[#3E3025] font-[600]">
                {event.name}
            </h3>

            {/* Dates */}
            <div
                className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    text-[16px]
                    font-medium
                    text-gray-600
                "
            >
                <span>{event.startDate}</span>

                <ArrowRight size={18} />

                <span>{event.endDate}</span>
            </div>

            <div className="flex flex-row items-center text-[1.2em] gap-2">
                <LocateFixedIcon size={25}/>
                <p className="font-[600]">
                    {event.location}
                </p>
            </div>
            <p className="text-red-900 text-[1.3em] font-[600]">
                {event.era.name}
            </p>

            <div className="flex flex-wrap justify-center items-center gap-2 mt-2">
                {event.tags.map((t)=>{
                    return(
                        <div key={t}
                        className="
                            px-2.5
                            py-1
                            rounded-full
                            bg-[#F0E6D8]
                            text-[#3E3025]
                            text-[12px]
                            font-[600]
                        "
                        > 
                            {t}
                        </div>
                    )
                })}
            </div>
        </section>
    )
}


export default memo(EventHero);