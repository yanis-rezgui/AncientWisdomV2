import { memo } from "react";
import type { HistoricalFigure } from "../../Types/Types";
import { Link } from "react-router-dom";


const FigureCard = ({figure} : {figure : HistoricalFigure}) => {

    return(
        <div className="w-[300px] bg-gray-100 flex flex-col rounded-lg p-3 shadow-2xl gap-3">
            
            <img src={figure.image.url} alt="" className="w-[150px] h-[150px] object-cover rounded-full"/>

            <div className="flex flex-col gap-1">
                <p className="text-[1.2em] font-[600]">
                    {figure.name}
                </p>

             
                   
                    <div className="flex flex-col font-[500] text-red-900 text-[15px]">
                        {figure.eras.map((e)=>{
                            return <p className="leading-4.5">
                                - {e.name}
                            </p>
                        })}
                    </div>
            

                <Link
                to={`/figure/${figure._id}`}
                className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3
                ">
                Read biography <i className="fa-solid fa-arrow-right-long"></i>
                </Link>
            </div>

        </div>
    );
}

export default memo(FigureCard);