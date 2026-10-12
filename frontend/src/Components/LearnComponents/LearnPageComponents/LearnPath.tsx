import { memo } from "react"
import { Link } from "react-router-dom";



const LearnPath = () => {

    const learningPaths = [
    {
        title: "Frames",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791794990/98af560e-eeb0-4873-83cf-2c8969a76777.png",
        description:
            "Explore historical monuments, statues, and maps that preserve the legacy of past civilizations.",
        link: "/learn/frames",
        cta: "Explore Collection",
    },
    {
        title: "Articles",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791796566/ac4e1cda-c756-473a-9c93-40fdbfa62674.png",
        description:
            "Uncover the events, people, and ideas that shaped civilizations and transformed the course of history.",
        link: "/learn/articles",
        cta: "Read Articles",
    },
    {
        title: "Guides",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791795005/977ae36f-2e91-44fd-8ba5-b5dfb7cc4772.png",
        description:
            "Follow structured learning paths to understand historical periods, civilizations, and defining events.",
        link: "/learn/guides",
        cta: "Start Learning",
    },
    {
        title: "Books",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791795017/13337b8a-bbba-4b23-8f50-0ac9588b138a.png",
        description:
            "Dive into historical literature and discover books that deepen your understanding of the past.",
        link: "/learn/books",
        cta: "Discover Books",
    },
    {
        title: "Movies",
        image: "https://res.cloudinary.com/dub4fhabm/image/upload/v1791795031/fd85ea11-0a11-4151-90be-e5c5b8321f01.png",
        description:
            "Experience history through cinema and explore the stories behind historical films and their real-world inspirations.",
        link: "/learn/movies",
        cta: "Explore Movies",
    },
];

    return(
        <section id="collection" className="flex flex-col w-full justify-center items-center px-5">
           <h1 className="text-[1.5em] font-semibold text-center mt-15">
              Choose Your Learning Path
           </h1>

           <p className="w-[500px] text-center text-gray-800
            max-[550px]:w-[300px] 
            ">
            Explore history your way. Discover remarkable artifacts, uncover fascinating stories,
             follow guided journeys, and dive into books and films that bring the past to life.
           </p>

           <div className="flex flex-wrap justify-center items-center gap-5 mt-5 mb-5">
              {learningPaths.map((p)=>{
                return(
                    <div className="flex flex-col w-[300px] gap-2 rounded-lg bg-gray-50
                    shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all
                duration-300
                    ">
                        <img src={p.image} className="w-full rounded-t-lg h-[200px] bg-cover"/>
                        
                        <div className="flex flex-col gap-1 p-2">
                            <h3
                            className="text-[1.2em] font-semibold text-gray-950"
                            >{p.title}</h3>
                            <p className="text-[14px] text-gray-800 leading-4.5">
                                {p.description}
                            </p>

                           <Link
                            to={p.link}
                            className="py-2 bg-[#3E3025] text-white font-semibold text-[14px] rounded-lg flex flex-row gap-2
                            items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            w-[170px] justify-center mt-1
                            "
                            >
                            <i className="fa-solid fa-arrow-up-right-from-square"></i> {p.cta} 
                            </Link>
                        </div>
                    </div>
                )
              })}
           </div>
        </section>
    )
}

export default memo(LearnPath);