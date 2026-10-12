import { memo } from "react"
import { useEraContext } from "../../../Contexts/EraContext";
import { Link } from "react-router-dom";
import {
    Users,
    CalendarDays,
    Quote,
    Landmark,
    type LucideIcon,
} from "lucide-react";


interface IHistoryCategory {
    title: string;
    description: string;
    link: string;
    cta: string;
    icon: LucideIcon;
}

 const historyCategories: IHistoryCategory[] = [
    {
        title: "Historical Figures",
        description:
            "Meet the leaders, thinkers, and visionaries who shaped the course of history.",
        link: "/figures",
        cta: "Discover Figures",
        icon: Users,
    },
    {
        title: "Historical Events",
        description:
            "Explore the defining moments that transformed civilizations and changed the world.",
        link: "/events",
        cta: "Explore Events",
        icon: CalendarDays,
    },
    {
        title: "Timeless Quotes",
        description:
            "Discover the words and ideas that have echoed across generations.",
        link: "/quotes",
        cta: "Read Quotes",
        icon: Quote,
    },
    {
        title: "Historical Eras",
        description:
            "Travel through the ages and uncover the civilizations that defined them.",
        link: "/eras",
        cta: "Explore Eras",
        icon: Landmark,
    },
];

const ExplorePast = () => {

    const {erasOptions} = useEraContext();

    return(
        <section className="flex flex-col w-full justify-center items-center px-5 mt-15 gap-1">
           
           <h3 className="text-[#3E3025] font-semibold text-center">
            EXPLORE THE PAST
           </h3>
           <h1 className="text-[1.5em] font-bold text-gray-800 text-center">
            Explore History Through the Ages
           </h1>
           <h4 className="text-[16px] text-center">
            Discover the civilizations, people, events, and ideas that shaped our world.
           </h4>

           <img 
           src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791795125/f804b0e3-040a-4d8d-825b-d3162e0e4ef9.png"
           className="w-[600px] mt-3 max-[650px]:w-[400px] max-[450px]:w-[300px]"
           />

           <div className="w-[600px] max-[650px]:w-[400px] max-[450px]:w-[300px]
            flex flex-col gap-1 mt-5">
            <h2 className="text-[1.3em] font-semibold text-gray-950">
                Choose an Era
            </h2>
            <p className="text-[16px] font-[600]">
                Select a historical period to explore its stories and legacy.
            </p>

            <div className="flex flex-wrap gap-2">
               {erasOptions.slice(0,5).map((e)=>{
                return(
                    <Link to={`/era/${e._id}`}
                    className="py-1 px-3 rounded-full bg-gray-600 text-white text-[13px]"
                    >
                       {e.name}
                    </Link> 
                )
               })}

                <Link to={`/eras`}
                    className="py-1 px-3 rounded-full bg-gray-600 text-white text-[13px]"
                    >
                       View All
                    </Link> 
            </div>
           </div>

           <div className="w-[600px] max-[650px]:w-[400px] max-[450px]:w-[300px]
           flex flex-col gap-2 mt-5 border-t border-t-gray-400 pt-3 mb-5
           ">
            <h2 className="text-[1.3em] font-semibold text-gray-950 mb-2">
                Explore by Category
            </h2>
            {historyCategories.map((h)=>{

                const Icon = h.icon;
                return(
                    <div className="w-full bg-gray-50 flex flex-col
                    rounded-lg
                    shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all
                duration-300
                p-2 gap-1
                    "> 
                      <Icon size={30}/>
                      <h3 className="text-[1.2em] font-semibold">
                        {h.title}
                      </h3>
                      <p className="text-[15px] text-gray-700">
                        {h.description}
                      </p>
                      <Link to={`${h.link}`}
                        className="p-2 bg-[#3E3025] text-white font-semibold text-[14px] rounded-lg flex flex-row gap-2
                 items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                 w-[180px] justify-center mt-2
                 "
                      >
                       <i className="fa-solid fa-arrow-up-right-from-square"></i> {h.cta}
                      </Link>
                    </div>
                )
            })}

           </div>


        </section>
    )
}

export default memo(ExplorePast);