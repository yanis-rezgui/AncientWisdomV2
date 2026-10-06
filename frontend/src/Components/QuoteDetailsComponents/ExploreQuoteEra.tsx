import { useNavigate } from 'react-router-dom';
import { useEventContext } from '../../Contexts/EventContext';
import { useQuotesContext } from '../../Contexts/QuotesContext';
import type { Quote } from '../../Types/Types';
import { memo } from 'react';


const ExploreQuoteEra = ({quote} : {quote : Quote}) => {

    const {quotesFilter, setQuotesFilter} = useQuotesContext();
    const {eventsFilter, setEventsFilter} = useEventContext();
    const navigate = useNavigate();

    return(
        <section className='flex flex-col w-full justify-center items-center'>

            <h3
            className='text-red-900 text-[1.6em] font-bold mt-12'
            >
                EXPLORE THIS ERA
            </h3>

            <div className='mt-5 flex flex-row justify-center items-center gap-5 max-[500px]:flex-col'>
                <button 
                className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3 w-[200px]
                "
                onClick={()=>{
                    setEventsFilter({
                        ...eventsFilter,
                        era : quote.era._id
                    });
                    navigate("/events");
                }}>
                    Related events
                </button>

                <button 
                className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3 w-[200px]
                "
                onClick={()=>{
                    setQuotesFilter({
                        ...quotesFilter,
                        era : quote.era._id
                    })

                    navigate("/quotes");
                }}>
                    Related Quotes
                </button>
            </div>


            <button
             className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3 w-[250px] mb-10
                "
             onClick={()=>{
                    setQuotesFilter({
                        ...quotesFilter,
                        author : quote.author._id
                    })

                    navigate("/quotes");
                }}
            >
                MORE FROM THIS AUTHOR
            </button>
        </section>
    )
}


export default memo(ExploreQuoteEra);