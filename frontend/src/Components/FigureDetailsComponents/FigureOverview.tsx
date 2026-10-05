import { memo, useState } from "react"
import type { HistoricalFigure } from "../../Types/Types"
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext"
import {  Check, Share2 } from "lucide-react";




const FigureOverview = ({figure} : {figure : HistoricalFigure}) => {

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

            setTimeout(() => {
                setCopied(false);
            }, 2000);
        } catch {
            console.error("Unable to copy the link");
        }
    };


    return(
        <div className="flex flex-row gap-10 p-4 w-[900px] bg-gray-50 mt-10 rounded-lg
        max-[920px]:w-[600px] max-[620px]:w-[350px] max-[620px]:flex-col
        max-[620px]:justify-center max-[620px]:items-center
        ">
            <img src={figure.image.url} alt="" 
            className="h-full w-[200px] object-contain rounded-lg"
            />

            <div className="flex flex-col gap-1">
                <p className="text-[1.5em] font-bold">
                    {figure.name}
                </p>

                <div className="flex flex-wrap gap-3 items-center">
                    {figure.tags.map((t)=>{
                        return(
                            <p className="text-[17px]">
                                {t} 
                            </p>
                        )
                    })}
                </div>

                <div className="flex flex-row items-center gap-2 font-[600]
                max-[620px]:flex-col max-[620px]:gap-0 max-[620px]:items-baseline
                ">
                    <p>{figure.birthDate}</p> - <p>{figure.deathDate}</p>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <p>
                        Born:
                    </p>
                    <p className="font-bold">
                        {figure.birthPlace}
                    </p>
                </div>


                <div className="flex flex-row items-center gap-3">
                    <p>
                        Died:
                    </p>
                    <p className="font-bold">
                        {figure.deathPlace}
                    </p>
                </div>

                <div className="flex flex-row items-center gap-1">
                    <p className="font-[600]">
                        {figure.eras.length === 1 ? "Era" : "Eras"} : 
                    </p>

                    <div className="flex flex-wrap gap-3">
                        {figure.eras.map((e)=>{
                            return <p>
                                {e.name}
                            </p>
                        })}
                    </div>
                </div>
                
                <div className="flex flex-row items-center gap-5 mt-2">
                <button 
                onClick={()=>toggleFavorite("Figure", figure._id)}
                className="flex flex-row justify-center items-center gap-1
                bg-white border-2 border-[#3E3025] p-2 rounded-lg cursor-pointer transition-opacity duration-200
                hover:opacity-80 active:opacity-60
                ">
                    <i className="fa-solid fa-heart text-[20px] cursor-pointer"
                    
                    style={{
                        color : isFavorite("Figure", figure._id) ? "#B91C1C" : "gray"
                    }}
                    ></i>

                    <p className="text-[15px]">
                        {isFavorite("Figure", figure._id) ? "Saved" : "Save Figure"}
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
                            : "Share Figure"}
                    </button>
                </div>

               
            </div>
        </div>
    )
}


export default memo(FigureOverview);