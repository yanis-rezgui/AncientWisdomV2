import { memo } from "react";
import { useEraContext } from "../../Contexts/EraContext";
import { useEventContext } from "../../Contexts/EventContext";
import { useFiguresContext } from "../../Contexts/FiguresContext";
import { useQuotesContext } from "../../Contexts/QuotesContext"
import { Link } from "react-router-dom"


const QuotesStatsComponent = () => {

    const {totalQuotes} = useQuotesContext();
    const {totalEvents} = useEventContext();
    const {totalFigures} = useFiguresContext();
    const {totalEras} = useEraContext();

    const data = [
        {
            name : "Quotes",
            number : totalQuotes,
            link : "/quotes"
        },
        {
            name : "Figures",
            number : totalFigures,
            link : "/figures"
        },
        {
            name : "Events",
            number : totalEvents,
            link : "/events"
        },
        {
            name : "Eras",
            number : totalEras,
            link : "/eras"
        }
    ]
    
    return(
        <div className="flex flex-wrap gap-5 justify-center mt-5">

                    {data.map((d,i)=>{
                        return(
                            <Link to={d.link} key={i} 
                            className="w-[100px] bg-[#3E3025] text-white flex justify-center items-center text-[15px]
                            font-[600] h-[30px] rounded-[5px] transition-transform duration-200 hover:scale-105
                            "
                            >
                              {d.number} {d.name}
                            </Link>
                        )
                    })}
        </div>
    )
}


export default memo(QuotesStatsComponent);