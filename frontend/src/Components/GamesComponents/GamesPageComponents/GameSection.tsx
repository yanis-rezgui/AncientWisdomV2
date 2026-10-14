import { memo } from "react"
import { useGamesContext } from "../../../Contexts/GamesContexts/GamesContext";
import GameCard from "./GameCard";



const GameSection = () => {

    const {games} = useGamesContext();

    return(
        <section className="flex flex-col gap-2 items-center">
           <h2 className="text-gray-950 mt-15 text-[1.7em] font-bold">
            The collection
           </h2>
           <p className="text-gray-700 text-center">
             Choose your challenge and test your historical knowledge.
           </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-5 mt-5">
                {games.map((g)=>{
                    return <GameCard game={g} key={g._id}/>
                })}
            </div>
        </section>
    )
}

export default memo(GameSection);