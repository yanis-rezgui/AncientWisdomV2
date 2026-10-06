import  { memo } from "react"
import type { Quote } from "../../Types/Types";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";



const AboutQuote = ({quote} : {quote : Quote}) => {

    return(
        <section className="flex flex-col justify-center items-center">
           
           <h3 className="text-red-900 text-[1.5em] font-[600]">
            ABOUT THE QUOTE
           </h3>

           <div className="flex flex-row  items-baseline justify-center gap-10 mt-5
           max-[700px]:flex-col
           ">
            <div className="bg-gray-50 flex flex-col gap-3 w-[300px]
            rounded-lg shadow-2xl transition-all duration-300
                hover:-translate-y-1 p-3 
            ">
                <h3
                className="text-red-900 text-[1.1em] font-[600]"
                >AUTHOR</h3>

                <img src={quote.author.image.url}
                className="w-[100px] object-cover rounded-full h-[100px]"
                alt="" />

                <p className="text-[#3E3025] font-[600] text-[1.1em]">
                    {quote.author.name}
                </p>

                <Link
                to={`/figure/${quote.author._id}`}
                className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3
                ">
                Read biography <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
            </div>

            <div className="bg-gray-50 flex flex-col gap-3 w-[300px]
            rounded-lg shadow-2xl transition-all duration-300
                hover:-translate-y-1 p-3 
            ">
                 <h3
                className="text-red-900 text-[1.1em] font-[600]"
                >ERA</h3>

                <p className="text-[#3E3025] font-[600] text-[1.1em]">
                    {quote.era.name}
                </p>

                 <div
                className="
                    flex
                    mt-2
                    items-center
                    justify-center
                    gap-2
                    text-[25px]
                    font-bold
                    text-gray-600

                "
            >
                <span>{quote.era.startYear < 0 ? `${-quote.era.startYear} BC` : `${quote.era.startYear} AC`}</span>

                <ArrowRight size={18} />

                <span>{quote.era.endYear < 0 ? `${-quote.era.endYear} BC` : `${quote.era.endYear} AC`}</span>
            </div>

             <Link
                to={`/era/${quote.era._id}`}
                className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3
                ">
                Explore This Era <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
            </div>
           </div>
        </section>
    )
}

export default memo(AboutQuote);