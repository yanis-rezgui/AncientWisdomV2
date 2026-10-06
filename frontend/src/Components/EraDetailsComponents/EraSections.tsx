import { memo } from "react"
import type { HistoricalEra } from "../../Types/Types"
import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { useFiguresContext } from "../../Contexts/FiguresContext"
import { useEventContext } from "../../Contexts/EventContext"



const EraSections = ({era} : {era : HistoricalEra}) =>  {

    const {figuresFilter, setFiguresFilter} = useFiguresContext();
    const {eventsFilter, setEventsFilter} = useEventContext();

    return(
        <section className="w-[900px] flex flex-col mt-10 gap-5
        max-[920px]:w-[600px] max-[620px]:w-[320px]
        ">

            <h3 className="text-[1.5em] font-semibold">The Story of the Era</h3>

            <div className="flex flex-wrap items-center gap-3 p-2 border-2 border-gray-600 rounded-[5px]">
                {era.sections.map((b)=>{
                  return(
                    <a href={`#${b.title}`}
                    className="text-[13px] cursor-pointer text-[#3E3025] font-[500]
                     hover:text-[#A67C52] transition-colors duration-300 font-[600]
                     underline
                     "
                    >
                        {b.title}
                    </a>
                  )
               })}
            </div>

            <div className="mt-5 flex flex-col gap-3 ">
                {era.sections.map((s)=>{
                    return(
                        <div className="flex flex-col gap-1">
                            <h4 className="text-[1.2em] font-[600]">
                                {s.title}
                            </h4>
                            <p className="text-[17px]">
                                {s.content}
                            </p>
                        </div>
                    )
                })}
            </div>

            <div className="mb-10 flex flex-row justify-between items-center gap-5 max-[750px]:flex-col
            max-[750px]:gap-2
            ">
                 {/* Details */}
            <Link
                to={`/figures`}
                onClick={()=>{
                    setFiguresFilter({
                        ...figuresFilter,
                        era : era._id
                    })
                }}
                className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    bg-[#3E3025]
                    text-white
                    p-2
                    font-semibold
                    rounded-[5px]
                    transition-all
                    duration-200
                    hover:opacity-90
                    active:scale-[0.98]
                    mt-2
                "
            >
                Explore key figures
                <ArrowRight size={17} />
            </Link>


            <Link
                to={`/events`}
                onClick={()=>{
                    setEventsFilter({
                        ...eventsFilter,
                        era : era._id
                    })
                }}
                className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    w-full
                    bg-[#3E3025]
                    text-white
                    p-2
                    font-semibold
                    rounded-[5px]
                    transition-all
                    duration-200
                    hover:opacity-90
                    active:scale-[0.98]
                    mt-2
                "
            >
                Explore key events
                <ArrowRight size={17} />
            </Link>
            </div>

        </section>
    )
}


export default memo(EraSections);