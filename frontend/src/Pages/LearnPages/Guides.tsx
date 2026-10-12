import { memo } from "react"
import { Link } from "react-router-dom";
import { useTipsContext } from "../../Contexts/TipsContext";



const Guides = () => {

    const {tips} = useTipsContext();
    return(
        <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6] pb-10">

                  {/* Header */}
            <div className="flex flex-col justify-center items-center gap-2 mt-10 px-5">
                <h3 className="text-[#3E3025] font-semibold text-center">
                    HISTORICAL GUIDES
                </h3>

                <h1 className="text-[1.5em] font-bold text-gray-800 text-center">
                    Learn the Stories Behind History
                </h1>

                <p
                    className="w-[500px] text-center text-gray-800
                    max-[550px]:w-[300px]"
                >
                    {tips?.introduction}
                </p>

                <Link
                    to="/learn"
                    className="p-2 mt-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
                    items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    <i className="fa-solid fa-arrow-left"></i> Back to Learn
                </Link>

                <div className="max-w-[900px] flex flex-col justify-center items-baseline ">
                    {tips?.tips.length === 0 ?
                       <p className="mt-5 text-center text-[1.2em] font-semibold">
                         No tips
                       </p>
                       :
                       <div className="flex flex-col gap-3 mt-5">

                           {tips?.tips.map((t,i)=>{
                            return(
                                <div className="flex flex-col gap-1">
                                    <h2 className="text-[1.2em] font-semibold">
                                      {i+1}. {t.title}
                                    </h2> 

                                    <p className="text-gray-900">
                                        <strong>Why?: </strong> {t.why}
                                    </p>

                                    <p className="text-gray-900">
                                        <strong>How in Ancient Wisdom?: </strong> {t.how}
                                    </p>
                                </div>
                            )
                           })}   
                    </div>
                    }
                </div>
            </div>

            <p
                    className="w-[500px] text-center text-gray-800
                    max-[550px]:w-[300px] mt-7" 
                >
                    {tips?.conclusion}
                </p>


        </section>
    )
}

export default memo(Guides);