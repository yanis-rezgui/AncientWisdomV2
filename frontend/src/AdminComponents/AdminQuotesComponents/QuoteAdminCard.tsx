import { Link } from "react-router-dom";
import type { Quote } from "../../Types/Types"
import  { memo } from "react";
import { useQuotesAdminContext } from "../../AdminContexts/QuotesAdminContext";



const QuoteAdminCard = ({quote} : {quote : Quote}) => {


    


    const {setShowUpdatePop, setShowDeletePop, setSelectedQuote, 

       
    } = useQuotesAdminContext();



          return (
        <article
            className="
                group relative flex w-[290px] flex-col
                rounded-[8px]
                border border-[#E7DED2]
                bg-[#F8F5EF]
                p-5
                shadow-lg
                transition-all duration-300
                hover:-translate-y-1
                hover:shadow-xl
            "
        >

          

                <p
                   
                    className="
                        text-[11px]
                        font-[700]
                        uppercase
                        tracking-[0.12em]
                        text-[#8B2E2E]
                        
                    "
                >
                    {quote.era.name}
                </p>

             

            {/* Quote */}
            <div className="mt-4">

                <span
                    aria-hidden="true"
                    className="
                        block
                        font-serif
                        text-[42px]
                        leading-[10px]
                        text-[#B89B72]
                    "
                >
                    “
                </span>

                <p
                    className="
                        px-2
                        py-2
                        font-serif
                        text-[17px]
                        font-[500]
                        leading-[1.65]
                        text-[#3E3025]
                    "
                >
                    {quote.text}
                </p>

                <span
                    aria-hidden="true"
                    className="
                        block
                        text-right
                        font-serif
                        text-[42px]
                        leading-[1px]
                        text-[#B89B72]
                    "
                >
                    ”
                </span>

            </div>


            {/* Author / Source */}
            <div className=" border-t border-[#DED3C5] pt-2">

                <Link
                    to={`/author/${quote.author._id}`}
                    className="
                        block
                        text-[15px]
                        font-[700]
                        text-[#3E3025]
                        transition-colors
                        hover:text-[#8B2E2E]
                    "
                >
                    {quote.author.name}
                </Link>

                {quote.source && (
                    <p className="
                        mt-1
                        text-[12px]
                        italic
                        text-[#756A5F]
                    ">
                        {quote.source}
                    </p>
                )}

            </div>

         
            <div className="flex flex-row justify-center items-center gap-2 mt-4">
                <button onClick={()=>{
                    setShowUpdatePop(true);
                    setSelectedQuote(quote);
                }}
                className="text-[14px] font-[500] text-white bg-[#3E3025] p-2 rounded-lg
                transition-opacity duration-200 hover:opacity-80 active:opacity-60
                cursor-pointer
                "
                
                >
                    Update Quote
                </button>

                <button onClick={()=>{
                    setShowDeletePop(true);
                    setSelectedQuote(quote);
                }}
                className="text-[14px] font-[500] text-white bg-red-900 p-2 rounded-lg
                transition-opacity duration-200 hover:opacity-80 active:opacity-60
                cursor-pointer
                "
                >
                    Delete Quote
                </button>
            </div>

        </article>
    );
    
}


export default memo(QuoteAdminCard);