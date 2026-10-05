import { memo } from "react"
import { Link } from "react-router-dom"



const Explore = () => {

    const data = [
        {
            name : "FIGURES",
            text : "Meet the minds who shaped history, from philosophers and rulers to scientists and visionaries.",
            icon : "https://res.cloudinary.com/dub4fhabm/image/upload/v1791209406/323d5fc7-55d2-4005-aa11-5ef1378820cf.png",
            href : "/figures"
        },
        {
            name : "EVENTS",
            text : "Relive the pivotal moments, conflicts, discoveries, and decisions that changed the course of history.",
            icon : "https://res.cloudinary.com/dub4fhabm/image/upload/v1791209455/5a4e2179-7bac-4e92-b6ab-c526c277d5e1.png",
            href : "/events"
        },
        {
            name : "ERAS",
            text : "Journey through the civilizations and periods that defined cultures, ideas, and the world we know today.",
            icon : "https://res.cloudinary.com/dub4fhabm/image/upload/v1791209639/f59eb14c-76d1-407d-95fa-f1a1adc253e5.png",
            href : "/eras"
        }
    ]

    

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">

           <h2
           className="mt-10 font-bold text-[2em]"
           >Explore History</h2>

           <div className="flex flex-row gap-5 w-full justify-center mt-10 items-center
            max-[900px]:flex-col
           ">
               <div className="w-[600px] flex flex-col gap-5 max-[1300px]:w-[400px] max-[900px]:text-center
               max-[500px]:w-[320px] max-[500px]:gap-3
               ">
                  <p className="text-[1.1em]">
                    Ancient Wisdom is more than a collection of quotes.
                     It is a journey through the people, ideas, events, and civilizations that shaped our world.
                  </p>

                  <p className="text-[1.1em]">
                    Meet the minds behind history, uncover the stories that defined entire eras,
                     and revisit the moments that changed the course of civilizations.
                      Explore their lives, their choices, their struggles, and the ideas
                       they left behind, and discover the wisdom that still resonates centuries later.
                  </p>

                  <p className="text-[1.2em] font-[600]">
                    Step beyond the present. Explore the past. Let history speak.
                  </p>
               </div>

               <img
               className="w-[600px] max-[1300px]:w-[400px] max-[500px]:w-[320px] rounded-lg"
               src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791204378/2bf5612e-d3d5-4226-80f9-1a8561fe940d.png"/>
           </div>

           <div className="flex flex-wrap gap-5 justify-center items-center mt-15 mb-10
           
           ">
            {data.map((p, i)=>{
                return(
                    <div key={i} 
                    className="flex flex-col gap-3 justify-center items-center  w-[350px] bg-[#F5F5F5] p-3 rounded-lg shadow-2xl
                    transition-transform duration-200 hover:scale-105
                    "
                    >

                       <img src={p.icon} alt="" 
                       className="w-[150px]"
                       />

                       <h3 className="text-[1.5em] font-bold mt-2">
                        {p.name}
                       </h3>

                       <p className="text-center text-gray-700">
                        {p.text}
                       </p>

                       <Link 
                       to={p.href}
                       className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                       font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                       ">
                        Explore <i className="fa-solid fa-arrow-right-long"></i>
                       </Link>
                    </div>
                )
            })}
           </div>

         
        </section>
    )
}


export default memo(Explore);