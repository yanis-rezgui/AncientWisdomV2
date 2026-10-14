import { memo } from "react"
import GamePageHero from "../../Components/GamesComponents/GamesPageComponents/GamePageHero";
import GameSection from "../../Components/GamesComponents/GamesPageComponents/GameSection";



const Games = () => {

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">
        <GamePageHero/>
        <GameSection/>
        </section>
    )
}

export default memo(Games);