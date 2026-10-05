import { memo } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEraContext } from "../../Contexts/EraContext";



const formatYear = (year: number) => {
    if (year < 0) {
        return `${Math.abs(year)} BCE`;
    }

    return `${year} CE`;
};

const EraTimeline = () => {

    const {eras} = useEraContext();
    return (
        <section className="w-full px-5 py-16 ">

            <div className="mx-auto w-full max-w-6xl">

             


                {/* Timeline */}
                <div className="relative">

                    {/* Central line */}
                    <motion.div
                        initial={{ height: 0 }}
                        whileInView={{ height: "100%" }}
                        viewport={{ once: true, amount: 0.15 }}
                        transition={{
                            duration: 1.5,
                            ease: "easeInOut",
                        }}
                        className="
                            absolute
                            left-[23px]
                            top-5
                            w-px
                            bg-[#8C6A43]/35
                            md:left-1/2
                            md:-translate-x-1/2
                        "
                    />

                    <div className="flex flex-col gap-16 md:gap-24">

                        {eras.map((era, index) => {

                            const isLeft = index % 2 === 0;

                            return (
                                <motion.div
                                    key={era._id}
                                    initial={{
                                        opacity: 0,
                                        x: isLeft ? -50 : 50,
                                    }}
                                    whileInView={{
                                        opacity: 1,
                                        x: 0,
                                    }}
                                    viewport={{
                                        once: true,
                                        amount: 0.25,
                                    }}
                                    transition={{
                                        duration: 0.7,
                                        ease: "easeOut",
                                    }}
                                    className={`
                                        relative
                                        flex
                                        w-full
                                        ${isLeft
                                            ? "md:justify-start"
                                            : "md:justify-end"
                                        }
                                    `}
                                >

                                    <div
                                        className={`
                                            flex
                                            w-full
                                            items-start
                                            gap-5
                                            md:w-[46%]
                                            ${
                                                !isLeft
                                                    ? "md:flex-row-reverse"
                                                    : ""
                                            }
                                        `}
                                    >

                                        {/* Timeline marker */}
                                        <motion.div
                                            whileHover={{
                                                scale: 1.12,
                                            }}
                                            transition={{
                                                duration: 0.2,
                                            }}
                                            className="
                                                relative
                                                z-10
                                                flex
                                                h-12
                                                w-12
                                                shrink-0
                                                items-center
                                                justify-center
                                                rounded-full
                                                border
                                                border-[#8C6A43]/50
                                                bg-[#F5E6C8]
                                            "
                                        >
                                            <div className="
                                                h-3
                                                w-3
                                                rounded-full
                                                bg-[#8C6A43]
                                            " />
                                        </motion.div>


                                        {/* Era content */}
                                        <div className="
                                            flex
                                            min-w-0
                                            flex-1
                                            flex-col
                                            gap-4
                                        ">

                                            {/* Date */}
                                            <div
                                                className={`
                                                    flex
                                                    items-center
                                                    gap-2
                                                    text-sm
                                                    font-semibold
                                                    text-[#8C6A43]
                                                    ${
                                                        !isLeft
                                                            ? "md:justify-end"
                                                            : ""
                                                    }
                                                `}
                                            >
                                                <span>
                                                    {formatYear(era.startYear)}
                                                </span>

                                                <span className="text-[#3E3A39]/40">
                                                    —
                                                </span>

                                                <span>
                                                    {formatYear(era.endYear)}
                                                </span>
                                            </div>


                                            {/* Card */}
                                            <motion.div
                                                whileHover={{
                                                    y: -5,
                                                }}
                                                transition={{
                                                    duration: 0.25,
                                                }}
                                                className="
                                                    overflow-hidden
                                                    rounded-xl
                                                    border
                                                    border-[#3E3A39]/10
                                                    bg-[#F9EED8]
                                                    shadow-[0_8px_30px_rgba(62,58,57,0.08)]
                                                "
                                            >

                                                {/* Image */}
                                                {era.image?.url && (
                                                    <div className="h-44 w-full overflow-hidden">

                                                        <motion.img
                                                            src={era.image.url}
                                                            alt={era.name}
                                                            whileHover={{
                                                                scale: 1.05,
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                            }}
                                                            className="
                                                                h-full
                                                                w-full
                                                                object-cover
                                                            "
                                                        />

                                                    </div>
                                                )}


                                                {/* Content */}
                                                <div className="flex flex-col gap-4 p-5">

                                                    <h3 className="
                                                        text-xl
                                                        md:text-2xl
                                                        font-bold
                                                        text-[#3E3A39]
                                                    ">
                                                        {era.name}
                                                    </h3>


                                                    <p className="
                                                        text-sm
                                                        leading-6
                                                        text-[#3E3A39]/65
                                                    ">
                                                        {era.description}
                                                    </p>


                                                    <Link
                                                        to={`/era/${era._id}`}
                                                        className="
                                                            group
                                                            mt-1
                                                            inline-flex
                                                            w-fit
                                                            items-center
                                                            gap-2
                                                            text-sm
                                                            font-semibold
                                                            text-[#8C6A43]
                                                            transition-colors
                                                            hover:text-[#6F5133]
                                                        "
                                                    >
                                                        Explore this era

                                                        <ArrowRight
                                                            size={17}
                                                            className="
                                                                transition-transform
                                                                duration-200
                                                                group-hover:translate-x-1
                                                            "
                                                        />
                                                    </Link>

                                                </div>

                                            </motion.div>

                                        </div>

                                    </div>

                                </motion.div>
                            );
                        })}

                    </div>

                </div>

            </div>

        </section>
    );
};

export default memo(EraTimeline);