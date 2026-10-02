import { memo } from "react"
import type { Quote } from "../../Types/Types";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";



const QuoteCard = ({quote} : {quote : Quote}) => {

    return( 
        <div className="flex flex-col bg-[#F5F5F5] p-3 rounded-[5px] shadow-2xl w-[200px]">
            
            <div className="flex flex-row justify-between w-full items-center">
               <h3 className="text-[14px] text-red-900 font-[600]">
                {quote.era.name.toUpperCase()}
               </h3>

               <div>
                <Heart size={15}/>
               </div>
            </div>

            <div>
                <div>
                <span>
                    “
                </span>
                <span></span>
                </div>

                <p className="font-['sans-serif'] text-[#3E3025] text-[15px] font-[600]">
                    {quote.text}
                </p>

                <div className="flex flex-row w-full justify-between items-center">
                    <span></span>
                <span>
                    “
                </span>
                </div>
            </div>

            <hr className="bg-[#3E3025] h-[1px] w-full"/>

            <div className="flex flex-col  mt-3">
                <Link to={``} className="text-[15px] font-[600] underline">{quote.author.name}</Link>
                <p className="text-[15px]">
                    {quote.source}
                </p>
            </div>

           <div className="flex flex-row w-full justify-between items-center mt-2">
            <button className="bg-[#3E3025] text-white text-[14px] font-[500] py-1 px-2 rounded-[5px]
            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
            ">
                Explore quote →
            </button>

            <span></span>
           </div>
        </div>
    )
}

export default memo(QuoteCard);