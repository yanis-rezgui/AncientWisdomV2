import { memo } from "react"
import { Link } from "react-router-dom"


const LearnHero = () => {

    return(
        <section className="flex flex-col justify-center items-center gap-2 mt-10 px-5">
            <h1 className="text-[1.5em] font-semibold text-center">
                The Past Holds More Than Stories.
            </h1>

            <p className="w-[500px] text-center text-gray-800
            max-[550px]:w-[300px] 
            ">
                Journey through the civilizations, ideas,
                 and events that shaped our world. 
                 Discover history through remarkable artifacts,
                  insightful articles, timeless books,
                   thoughtful guides,
                    and films that bring the past to life.
            </p>

            <div className="flex flex-row justify-center items-center gap-5 mt-3">
                <Link
                 to="/explore"
                 className="p-2 bg-[#3E3025] text-white font-semibold text-[14px] rounded-lg flex flex-row gap-2
                 items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                 "
                 >
                   <i className="fa-solid fa-arrow-up-right-from-square"></i> Explore History
                </Link>

                <a href="#collection"
                className="p-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
                 items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                 "
                >
                  <i className="fa-solid fa-arrow-up-right-from-square"></i>  Discover Our Collection
                </a>
            </div>
        </section>
    )
}

export default memo(LearnHero);