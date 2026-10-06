import { memo, useState } from "react"
import type { HistoricalEvent } from "../../Types/Types";
import { ArrowRight, Check, LocateFixedIcon, Share2 } from "lucide-react";
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext";



const EventHero = ({event} : {event : HistoricalEvent}) => {


        const {toggleFavorite, isFavorite} = useSavedItemsContext();
        
    
        const [copied, setCopied] = useState(false);
    
        // =========================
        // SHARE
        // =========================
    
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
    
                setTimeout(() => {
                    setCopied(false);
                }, 2000);
            } catch {
                console.error("Unable to copy the link");
            }
        };

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

             <div className="flex flex-row items-center gap-5 mt-2">
                <button 
                onClick={()=>toggleFavorite("Event", event._id)}
                className="flex flex-row justify-center items-center gap-1
                bg-white border-2 border-[#3E3025] p-2 rounded-lg cursor-pointer transition-opacity duration-200
                hover:opacity-80 active:opacity-60
                ">
                    <i className="fa-solid fa-heart text-[20px] cursor-pointer"
                    
                    style={{
                        color : isFavorite("Event", event._id) ? "#B91C1C" : "gray"
                    }}
                    ></i>

                    <p className="text-[15px]">
                        {isFavorite("Event", event._id) ? "Saved" : "Save Event"}
                    </p>
                </button>

                  <button
                        onClick={handleShare}
                        className="
                            bg-white
                            px-2.5 py-1.5
                            text-[14px]
                            font-medium

                            border-2
                            border-[#3E3025]
                            rounded-[5px]

                            flex items-center gap-1.5

                            cursor-pointer
                            transition-all duration-200

                            hover:bg-[#3E3025]
                            hover:text-white

                            active:scale-95
                        "
                    >
                        {copied ? (
                            <Check size={15} />
                        ) : (
                            <Share2 size={15} />
                        )}

                        {copied
                            ? "Link copied"
                            : "Share Event"}
                    </button>
                </div>

        </section>
    )
}


export default memo(EventHero);