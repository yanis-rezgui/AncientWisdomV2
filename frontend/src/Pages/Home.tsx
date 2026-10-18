import { memo } from "react";
import Hero from "../Components/HomeComponents/Hero";
import CivilisationsSection from "../Components/HomeComponents/CivilisationsSection";
import FeaturedFigures from "../Components/HomeComponents/FeaturedFigures";
import FeaturedEvents from "../Components/HomeComponents/FeaturedEvents";
import QuotesOfTheDay from "../Components/HomeComponents/QuotesOfTheDay";
import GamesQuizzesSection from "../Components/HomeComponents/GamesQuizzesSection";
import FeaturedArticles from "../Components/HomeComponents/FeaturedArticles";
import LearnPaths from "../Components/HomeComponents/LearnPaths";
import FAQSection from "../Components/HomeComponents/FAQSection";



const Home = () => {

    return(
        <section className="flex flex-col w-full">
            <Hero/>
            <CivilisationsSection/>
            <FeaturedFigures/>
            <FeaturedEvents/>
            <QuotesOfTheDay/>
            <GamesQuizzesSection/>
            <FeaturedArticles/>
            <LearnPaths/>
            <FAQSection/>
        </section>
    )
}

export default memo(Home);