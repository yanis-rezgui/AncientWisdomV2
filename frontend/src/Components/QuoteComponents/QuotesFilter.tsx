import { memo } from "react"
import { useQuotesContext } from "../../Contexts/QuotesContext";
import { useEraContext } from "../../Contexts/EraContext";
import { useFiguresContext } from "../../Contexts/FiguresContext";
import { Filter } from "lucide-react";




const QuotesFilter = () => {

    const {quotesFilter, setQuotesFilter} = useQuotesContext();
    const {erasOptions} = useEraContext();
    const {figuresOptions} = useFiguresContext();

    return(
        <div className="w-[900px] bg-gray-50 rounded-[10px]  max-[950px]:w-[600px] max-[620px]:w-[300px]
        mt-5 p-3
        ">

            <div className="text-[#3E3025] text-[1.5em] flex flex-row items-center gap-3">
                <Filter size={25}/>
                <p className="font-bold">
                    Filters
                </p>
            </div>

           <div className="flex flex-row gap-5 items-center mt-3 w-full max-[950px]:flex-col">
            <div className="flex flex-col gap-1 w-full">
                <p className="text-[15px] font-[600]">
                    Eras
                </p>

                <select name="era" id=""
                value={quotesFilter.era}
                onChange={(e)=>{
                    setQuotesFilter({
                        ...quotesFilter,
                        era : e.target.value
                    })
                }}
                className="p-2 bg-white border-2 border-[#3E3025] w-full rounded-[5px]"
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
                    Authors
                </p>

                <select name="author" id=""
                value={quotesFilter.author}
                onChange={(e)=>{
                    setQuotesFilter({
                        ...quotesFilter,
                        author : e.target.value
                    })
                }}
                className="p-2 bg-white border-2 border-[#3E3025] w-full rounded-[5px]"
                >
                    <option value="">All Figures</option>
                    {
                        figuresOptions.map((f)=>{
                            return <option value={f._id}>{f.name}</option>
                        })
                    }
                </select>
            </div>
            </div>
        </div>
    )
}

export default memo(QuotesFilter);