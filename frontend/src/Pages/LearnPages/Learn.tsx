import  { memo } from "react";
import LearnHero from "../../Components/LearnComponents/LearnPageComponents/LearnHero";
import LearnPath from "../../Components/LearnComponents/LearnPageComponents/LearnPath";
import ExplorePast from "../../Components/LearnComponents/LearnPageComponents/ExplorePast";
import Challenge from "../../Components/LearnComponents/LearnPageComponents/Challenge";



const Learn = () => {

    return(
        <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6]">

            <LearnHero/>
            <LearnPath/>
            <ExplorePast/>
            <Challenge/>
        </section>
    );
}


export default memo(Learn);