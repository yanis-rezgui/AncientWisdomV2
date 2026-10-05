import { memo } from "react"
import ErasSearch from "../Components/ErasComponents/ErasSearch";
import EraTimeLine from "../Components/ErasComponents/EraTimeLine";



const Eras = () => {

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
        </section>
    )
}

export default memo(Eras);