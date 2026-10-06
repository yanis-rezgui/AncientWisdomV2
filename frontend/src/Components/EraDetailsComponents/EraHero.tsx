import { memo } from "react"
import type { HistoricalEra } from "../../Types/Types";
import { ArrowRight } from "lucide-react";



const EraHero = ({era} : {era : HistoricalEra}) => {

    return(
         <section className="flex flex-col justify-center items-center w-full">
                <h1 className="mt-10 text-[2em] font-bold text-gray-900">
                    {era.name.toUpperCase()}
                </h1>

                 <div
                className="
                    flex
                    mt-2
                    items-center
                    justify-center
                    gap-2
                    text-[25px]
                    font-bold
                    text-gray-600

                "
            >
                <span>{era.startYear < 0 ? `${-era.startYear} BC` : `${era.startYear} AC`}</span>

                <ArrowRight size={18} />

                <span>{era.endYear < 0 ? `${-era.endYear} BC` : `${era.endYear} AC`}</span>
            </div>

            <p className="text-center text-[18px] w-[900px] text-gray-700 mt-3
            max-[920px]:w-[600px] max-[620px]:w-[320px]
            ">
               {era.description}
            </p>

            

            <img src={era.image.url} alt="" 
            className="w-[600px] mt-5 max-[620px]:w-[320px]"
            />
        </section>
    )
}

export default memo(EraHero);