import { memo } from "react"
import FiguresFilters from "../Components/FiguresComponents/FiguresFilters";
import { useFiguresContext } from "../Contexts/FiguresContext";
import FigureCard from "../Components/FiguresComponents/FigureCard";
import { useNavigate } from "react-router-dom";
import Pagination from "../Components/Pagination/Pagination";



const Figures = () => {

    const {figures, page, setPage, limit, setLimit, totalFigures, totalPages} = useFiguresContext();

    const navigate = useNavigate();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">
             <h2 className="mt-10 text-[2em] font-bold">
                Historical Figures
             </h2>

             <p className="text-center mt-3 font-bold">
                Discover the people whose ideas, actions,
          and lives shaped the course of history.
             </p>

             <FiguresFilters/>

            <div className="flex flex-wrap items-baseline justify-center gap-5 mt-10 px-5">
             {figures.map((f)=>{
                return(
                    <FigureCard figure={f}/>
                )
             })}
            </div>

                          <Pagination
                                                  page={page}
                                                  totalPages={totalPages} 
                                                  totalItems={totalFigures} 
                                                  limit={limit} 
                                                  setPage={setPage} 
                                                  setLimit={setLimit} 
                                                  />

              <button
            onClick={()=>navigate("/explore")}
            className="bg-[#3E3025] text-white absolute left-2 top-2
            flex flex-row justify-center items-center gap-2 px-4 py-1 rounded-[10px]
            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
            ">
                <i className="fa-solid fa-arrow-left-long"></i>
                Back
            </button>

        </section>
    )
}

export default memo(Figures);