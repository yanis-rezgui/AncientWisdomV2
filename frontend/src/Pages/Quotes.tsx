import { memo } from "react"
import { useQuotesContext } from "../Contexts/QuotesContext";
import QuotesStatsComponent from "../Components/QuoteComponents/QuotesStatsComponent";
import SearchBar from "../Components/QuoteComponents/SearchBar";
import QuotesFilter from "../Components/QuoteComponents/QuotesFilter";
import QuoteCard from "../Components/QuoteComponents/QuoteCard";



const Quotes = () => {


    const {quotes} = useQuotesContext();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6]">
           
           <h1 className="text-[#292722] mt-10 font-bold text-[2em] px-5 text-center">
              Words that survived history
           </h1>

            <p className="text-[#292722] mt-3 font-[500] text-[1.2em] px-5 text-center">
                Explore thoughts, ideas and wisdom from some of history's most influential figures.
            </p>

            <QuotesStatsComponent/>
             
            <SearchBar/>
            <QuotesFilter/>

            <div className="mt-10 flex flew-wrap justify-center items-baseline gap-5 px-10">
                {quotes.map((q)=>{
                    return(
                        <QuoteCard quote={q} key={q._id}/>
                    )
                })}
            </div>

        </section>
    )
}


export default memo(Quotes);