import { memo } from "react"
import type { HistoricalFigure } from "../../Types/Types";


const FiguresEras = ({figure} : {figure : HistoricalFigure}) => {

    return(
         <div className="flex flex-col  gap-10 p-4 w-[900px]  mt-10 rounded-lg
        max-[920px]:w-[600px] max-[620px]:w-[350px]
        max-[620px]:w-full 
        ">
             
             <h4 className="text-[1.5em] font-bold text-center">
                FIGURE ERAS
             </h4>

         

            
              <div className="flex flex-wrap justify-center items-center gap-5 w-full">
                {figure.eras.map((e)=>{
                return(
                    <div className="bg-gray-50 w-[300px] rounded-lg shadow-2xl
                    flex flex-col justify-center items-center p-3
                    ">
                        <p className="text-[1.4em] font-bold">
                            {e.name}
                        </p>

                    <div className="flex flex-col items-center font-[500]
                         max-[620px]:items-baseline mt-2
                        ">
                            <p>{figure.birthDate}</p> - <p>{figure.deathDate}</p>
                    </div>

                      <button className="bg-[#3E3025] text-white text-[14px] font-[500] p-2 rounded-[5px]
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        mt-4 w-full
                        ">
                            Explore quote →
                        </button>
                    </div>
                )
            })}
              </div>
            </div>
        
    )
}


export default memo(FiguresEras);