import { memo } from "react"
import type { HistoricalFigure } from "../../Types/Types"



const Biography = ({figure} : {figure : HistoricalFigure}) => {

    return(
        <section className="flex flex-col gap-5 p-4 w-[900px]  mt-10 rounded-lg
        max-[920px]:w-[600px] max-[620px]:w-[350px] max-[620px]:flex-col
        max-[620px]:justify-center max-[620px]:items-center
        ">

            <h3 className="text-[1.7em] font-bold">
                BIOGRAPHY
            </h3>

            <div className="flex flex-wrap  items-center gap-3">
            
               {figure.biography.map((b)=>{
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
                {figure.biography.map((f)=>{
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


export default memo(Biography);