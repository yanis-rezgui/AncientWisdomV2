import { ArrowRight } from "lucide-react";
import { memo } from "react"
import { Link } from "react-router-dom";




const Hero = () => {

    return(
        <div
            id="home"
            style={{ backgroundImage: "url('https://res.cloudinary.com/dub4fhabm/image/upload/v1792176222/bgGreece_awhn6s.jpg')" }}
            className="bg-cover bg-center w-full flex items-center justify-center h-[650px]"
        >

            <div
                className="
                    flex flex-col px-10 w-full h-full
                    bg-gradient-to-b from-black/70 via-black/55 to-black/70
                    gap-3
                    max-[1025px]:px-10
                    max-[780px]:px-5
                    max-[600px]:px-5
                    items-center 
                "
            >
                <h1 className="text-[#B08D57] font-black text-[2.5em] mt-10 max-[700px]:text-[1.7em] text-center
                font-['Playfair_Display']
                ">
                    Welcome to Ancient Wisdom
                </h1>

                <p className="text-white text-[1.5em] font-bold w-[500px] text-center leading-7 mt-5 font-sans max-[700px]:text-[1.2em] max-[700px]:w-[300px]">
                    Discover the Stories That Shaped Human History
                </p>
                <p className="text-[1.5em] text-white font-black max-[500px]:w-[300px] max-[500px]:text-[1.2em] font-sans mt-1 text-center">
                    Your #1 Companion in Learning from the Past.
                </p>
                <p className="text-[18px] text-gray-200 w-[500px] text-center font-semibold max-[700px]:text-[16px] max-[700px]:w-[300px]">
                    Explore ancient civilizations, legendary historical figures, 
                    pivotal events, and remarkable monuments. Journey through the past with in-depth articles, 
                    interactive quizzes, and history games designed to make learning unforgettable.
                </p>

                <div className="flex flex-row justify-center items-center gap-3 mt-2 max-[500px]:flex-col">
                    <Link to="/explore" 
                    className="bg-[#3E3025] text-white p-3 w-[180px] flex flex-row items-center justify-center gap-2 border
                    border-[#3E3025] rounded-lg
                    text-[15px] font-semibold
                    transition-transform duration-200
                    hover:scale-105
                    "
                    >
                       Explore History <ArrowRight size={17}/>
                    </Link>

                    <Link to="/games" 
                    className="bg-black/60 text-white p-3 w-[180px] flex flex-row items-center justify-center gap-2 border-1
                    border-black rounded-lg
                    text-[15px] font-semibold
                    transition-transform duration-200
                    hover:scale-105
                    "
                    >
                       Test Your Knowledge
                    </Link>
                </div>
            </div>
        </div>
    )
}


export default memo(Hero);