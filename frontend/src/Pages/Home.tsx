import { memo } from "react";
import Hero from "../Components/HomeComponents/Hero";



const Home = () => {

    return(
        <section className="flex flex-col w-full">
            <Hero/>
        </section>
    )
}

export default memo(Home);