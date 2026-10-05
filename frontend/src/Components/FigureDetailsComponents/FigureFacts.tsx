import { memo } from "react"
import type { HistoricalFigure } from "../../Types/Types";



const FigureFacts = ({figure} : {figure : HistoricalFigure}) => {


    return(
        <div className="flex flex-col gap-10 p-4 w-[900px]  mt-10 rounded-lg
        max-[920px]:w-[600px] max-[620px]:w-[350px] max-[620px]:flex-col
        max-[620px]:w-full max-[620px]:items-center
        ">
             
             <h4 className="text-[1.5em] font-bold text-center">
                FIGURE FACTS
             </h4>

             <div
                className="
                    grid grid-cols-3 gap-5
                    max-[920px]:grid-cols-2
                    max-[620px]:grid-cols-1
                "
            >
                {/* BORN */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <p className="text-sm font-bold tracking-widest text-gray-500">
                        BORN
                    </p>

                    <div className="mt-3">
                        <p className="text-[18px] font-medium">
                            {figure.birthDate}
                        </p>

                        <p className="text-gray-600 mt-1">
                            {figure.birthPlace}
                        </p>
                    </div>
                </div>

                {/* DIED */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <p className="text-sm font-bold tracking-widest text-gray-500">
                        DIED
                    </p>

                    <div className="mt-3">
                        <p className="text-[18px] font-medium">
                            {figure.deathDate}
                        </p>

                        <p className="text-gray-600 mt-1">
                            {figure.deathPlace}
                        </p>
                    </div>
                </div>

                {/* ERAS */}
                <div className="bg-gray-50 p-6 rounded-lg shadow-md">
                    <p className="text-sm font-bold tracking-widest text-gray-500">
                        ERAS
                    </p>

                    <div className="flex flex-col gap-2 mt-3">
                        {figure.eras.map((era) => (
                            <p
                                key={era._id}
                                className="text-[18px] font-medium"
                            >
                                {era.name}
                            </p>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default memo(FigureFacts);