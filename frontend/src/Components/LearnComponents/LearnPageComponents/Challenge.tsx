import { memo } from "react"
import { Link } from "react-router-dom";




const Challenge = () => {

    return(
        <section className="w-full flex flex-col gap-2 justify-center items-center mt-10 mb-10">
            
              <h3 className="text-[#3E3025] font-semibold text-center">
            CHALLENGE YOURSELF
           </h3>
           <h1 className="text-[1.5em] font-bold text-gray-800 text-center">
            How Well Do You Know History?
           </h1>
           <div className="flex flex-row gap-10 items-start justify-center mt-5 px-5 max-[1100px]:flex-col
           max-[1100px]:items-center
           ">
            <div className="w-[500px] flex flex-col gap-2 max-[550px]:w-[300px] text-center">
                <p className="text-[17px]">
                    Think you know the stories that shaped our world?
                     Put your knowledge to the test, uncover fascinating facts,
                      and discover how much history you truly remember.
                </p>
                <div className="flex flex-row gap-2 max-[550px]:flex-col">
                    <Link
                 to="/quizzes"
                 className="p-2 bg-[#3E3025] text-white font-semibold text-[14px] rounded-lg flex flex-row gap-2
                 items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                 max-[550px]:justify-center
                 "
                 >
                   <i className="fa-solid fa-arrow-up-right-from-square"></i> Explore History Quizzes
                </Link>

                <Link
                 to="/quizzes"
                 className="p-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
                 items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                 max-[550px]:justify-center
                 "
                 >
                   <i className="fa-solid fa-arrow-up-right-from-square"></i> Test Your Knowledge
                </Link>
                </div>
            </div>

            <img 
            src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791795144/437400d6-0b51-4e4a-b691-a7587ce162e8.png" 
            className="w-[500px] max-[550px]:w-[300px]"
            alt="" />
           </div>
        </section>
    )
}

export default memo(Challenge);