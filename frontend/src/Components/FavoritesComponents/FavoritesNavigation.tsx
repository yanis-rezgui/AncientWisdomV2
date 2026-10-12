import { Landmark, Quote, UserRound } from "lucide-react";
import { useSavedItemsContext } from "../../Contexts/SavedItemsContext";
import { memo } from "react";



const FavoritesNavigation = () => {

     const {savedQuotes, savedEvents, savedFigures} = useSavedItemsContext();

     const data =  [
        {
            title : "Quotes",
            icon : Quote,
            number : savedQuotes.length

        },
        {
            title : "Events",
            icon : Landmark,
            number : savedEvents.length
        },
        {
            title : "Figures",
            icon : UserRound,
            number : savedFigures.length
        }
    ];

    const {typeToShow, setTypeToShow} = useSavedItemsContext();
    return(
       <div className="flex flex-wrap justify-center items-center gap-5 mt-7">
               {data.map((d)=>{
                const Icon = d.icon;
                 return(
                    <div 
                    key={d.title}
                    onClick={()=>setTypeToShow(d.title)}
                    style={{
                        backgroundColor : typeToShow === d.title ? "#3E3025" : "white",
                        color : typeToShow === d.title ? "white" : "#3E3025"
                    }}
                    className="w-[250px] rounded-lg py-3 flex flex-col
                    justify-center items-center gap-2 font-bold
                    shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all
                duration-300
                cursor-pointer
                    ">
                        <Icon size={30}/>
                        <p>
                            {d.title}
                        </p>

                        <p>
                            {d.number} saved
                        </p>
                    </div>
                 )
               })}
           </div>
    )
}

export default memo(FavoritesNavigation);