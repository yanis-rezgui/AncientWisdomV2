import { memo } from "react"
import ErasSearch from "../Components/ErasComponents/ErasSearch";
import EraTimeLine from "../Components/ErasComponents/EraTimeLine";
import { useNavigate } from "react-router-dom";



const Eras = () => {

    const navigate = useNavigate();
    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">

            <h2 className="mt-10 text-[2em] font-bold">
                ERAS OF HISTORY
             </h2>

            <p className="text-center mt-3 font-bold">
               Explore the periods that shaped
              human civilization.
             </p>

            <ErasSearch/>

            <EraTimeLine/>

             <button
            onClick={()=>navigate(-1)}
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

export default memo(Eras);