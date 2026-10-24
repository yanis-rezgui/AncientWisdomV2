import { memo } from "react"
import { useGamesContext } from "../../../Contexts/GamesContexts/GamesContext"


const GamePageHero = () => {
    
    const {games} = useGamesContext();

    const data = [
        {
            name : "Games",
            number : games.length
        },
        {
            name : "Difficulties",
            number: 3
        },
        {
            name : "Discoveries",
            number : 100
        }
    ]

    return(
        <section className="w-full flex flex-row justify-center items-start mt-15 gap-10 max-[1000px]:flex-col
        max-[1000px]:justify-center max-[1000px]:items-center px-5
        ">

           <div className="flex flex-col gap-1 max-[1000px]:items-center">
           <h1 className="text-[1.5em] text-[#B08D57] max-[600px]:text-[1.2em]">
            ANCIENT WISDOM · INTERACTIVE
           </h1>
           <h2 className="text-[2em] font-semibold">
            History, Reimagined.
           </h2>
           <p className="text-gray-600 max-[600px]:text-center">
              Test your knowledge. Discover the past. Challenge yourself.
           </p>

           <div className="mt-5 flex flex-wrap items-center gap-4 max-[600px]:justify-center">
              {data.map((d)=>{
                return(
                    <div key={d.name}
                    className="flex flex-col p-2 bg-black/60 text-white w-[130px] rounded-lg"
                    >
                        <p className="text-[25px] font-bold ">
                            {d.number < 100 ? d.number : "∞"} 
                        </p>
                        <p className="text-[14px] font-semibold">
                            {d.name}
                        </p>
                    </div>
                )
              })}
           </div>
           </div>


            <img 
            className="w-[500px]
            max-[550px]:w-[300px]
            "
            src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791972722/49304be3-6451-4186-b835-6dd2779e7830.png"/>

        </section>
    )
}

export default memo(GamePageHero);