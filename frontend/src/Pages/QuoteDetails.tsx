import { memo, useEffect } from "react"
import { useQuotesContext } from "../Contexts/QuotesContext";
import { useParams } from "react-router-dom";
import QuoteHero from "../Components/QuoteDetailsComponents/QuoteHero";
import AboutQuote from "../Components/QuoteDetailsComponents/AboutQuote";
import ExploreQuoteEra from "../Components/QuoteDetailsComponents/ExploreQuoteEra";




const QuoteDetails = () => {

    const {getQuote, loadingQuote, currentQuote} = useQuotesContext();
    const {id} = useParams();

    useEffect(()=>{
        getQuote(id);
    }, [id]);

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">
           
           {
            loadingQuote ?
               <p className="mt-10 text-center text-[1.2em] font-semibold">
                 Loading...
               </p>
               : 
                 !currentQuote ?
                    <div className="flex flex-col gap-3 bg-gray-50 rounded-lg mt-10 gap-5 py-5">
                        <img 
                        src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791283503/fab15c97-2aba-4af0-bf15-f68cdd6e3127.png"
                        alt="" 
                        className="w-[300px]"
                        />

                        <p className="text-center text-[1.4em] font-bold">
                            Quote Not Found
                        </p>
                    </div>
                : 
                <>
                   <QuoteHero quote={currentQuote}/>
                   <AboutQuote quote={currentQuote}/>
                   <ExploreQuoteEra quote={currentQuote}/>
                </>
           }
        </section>
    )
}


export default memo(QuoteDetails);