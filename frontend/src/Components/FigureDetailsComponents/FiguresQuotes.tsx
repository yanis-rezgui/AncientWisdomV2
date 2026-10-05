import { Link } from "react-router-dom";
import { useQuotesContext } from "../../Contexts/QuotesContext"
import type { HistoricalFigure } from "../../Types/Types"
import { memo } from "react";




const FiguresQuotes = ({figure} : {figure : HistoricalFigure}) => {

    const {quotesFilter, setQuotesFilter} = useQuotesContext();
    
    return(
        <div className="flex flex-col  gap-5 p-4 w-[900px]  mt-10 rounded-lg
        max-[920px]:w-[600px] max-[620px]:w-[350px]
        max-[620px]:w-full mb-10
        ">
           
           <h3 className="text-[1.5em] font-bold text-center">
              WORDS OF {figure.name.toLocaleUpperCase()}
           </h3>

           <Link
           to="/quotes"
           onClick={()=>{
            setQuotesFilter({
                ...quotesFilter,
                author : figure._id
            })
           }}
           className="bg-[#3E3025] text-white text-[14px] font-[500] p-2 rounded-[5px]
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                         w-full flex justify-center items-center text-[16px] font-bold
                        ">
                            Browse the quotes →
            </Link>
        </div>
    )
}

export default memo(FiguresQuotes);