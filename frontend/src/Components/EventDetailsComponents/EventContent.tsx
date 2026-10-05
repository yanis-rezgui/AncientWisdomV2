import  { memo } from "react"
import type { HistoricalEvent } from "../../Types/Types";



const EventContent = ({event} : {event : HistoricalEvent}) => {

    return(
        <section
        className="flex flex-col w-[900px] 
        p-3  gap-2 max-[920px]:w-[600px]
        max-[620px]:w-[320px] justify-center 
        mt-10 mb-10 
        "
        >

           <h3 className="text-gray-700 font-[600] text-[1.4em]">
            Main Historical Content
           </h3>

             <div className="flex flex-wrap  items-center gap-3">
            
               {event.sections.map((b)=>{
                  return(
                    <a href={`#${b.title}`}
                    className="text-[14px] cursor-pointer text-[#3E3025] font-[500]
                     hover:text-[#A67C52] transition-colors duration-300 font-[600]"
                    >
                        {b.title}
                    </a>
                  )
               })}
            </div>

            <div className="flex flex-col gap-5 mt-4">
                {event.sections.map((f)=>{
                    return(
                        <div id={`${f.title}`}
                        className="flex flex-col p-3 bg-gray-50 rounded-lg gap-3"
                        >
                            <h4 className="text-[1.5em] font-[600]">
                                 {f.title}
                            </h4>
                            <p className="text-[17px]">
                                {f.content}
                            </p>
                        </div>
                    )
                })}
            </div>

            
        </section>
    )
}

export default memo(EventContent);