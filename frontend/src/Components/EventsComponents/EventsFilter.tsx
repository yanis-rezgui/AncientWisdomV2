import { Search } from "lucide-react"
import { useEraContext } from "../../Contexts/EraContext"
import { memo } from "react";
import { useEventContext } from "../../Contexts/EventContext";


const EventsFilter = () => {

    const {erasOptions} = useEraContext();
    const {eventsFilter, setEventsFilter} = useEventContext();

    return(
          <div className="w-[900px] bg-gray-50 rounded-[10px]  max-[950px]:w-[600px] max-[620px]:w-[300px]
        mt-5 p-3 shadow-2xl
        ">

            <div className="text-[#3E3025] text-[1.5em] flex flex-row items-center gap-3">
                <Search size={25}/>
                <p className="font-bold">
                    Search & Filter
                </p>
            </div>

           <div className="flex flex-row gap-5 items-center mt-3 w-full max-[950px]:flex-col">
            <div className="flex flex-col gap-1 w-full">
                <p className="text-[15px] font-[600]">
                    Eras
                </p>

                <select name="era" id=""
                value={eventsFilter.era}
                onChange={(e)=>{
                    setEventsFilter({
                        ...eventsFilter,
                        era : e.target.value
                    })
                }}
                className="p-2 bg-white border-2 border-[#3E3025] w-full rounded-[5px]
                cursor-pointer
                "
                >
                    <option value="">All Eras</option>
                    {
                        erasOptions.map((e)=>{
                            return <option value={e._id}>{e.name}</option>
                        })
                    }
                </select>
            </div>


            <div className="flex flex-col gap-1 w-full">
                <p className="text-[15px] font-[600]">
                    Search
                </p>

                <input
                name="search"
                value={eventsFilter.search}
                placeholder="Figure Name..."
                onChange={(e)=>{
                    setEventsFilter({
                        ...eventsFilter,
                        search : e.target.value
                    })
                }}
                className="p-2 bg-white border-2 border-[#3E3025] w-full rounded-[5px]"
                />
                    
            </div>
            </div>
        </div>
    )
}


export default memo(EventsFilter);