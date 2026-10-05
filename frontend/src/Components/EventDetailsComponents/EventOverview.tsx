import { memo } from "react"


const EventOverview = ({description} : {description : string}) => {

    return(
        <section className="flex flex-col w-[900px] bg-gray-50
        p-3 rounded-lg shadow-2xl gap-4 max-[920px]:w-[600px]
        max-[620px]:w-[320px] justify-center 
        mt-10
        ">

            <h3
            className="text-[1.4em] font-bold"
            >Overview</h3>
            <p className="text-[17px]">
               {description}
            </p>

        </section>
    )
}


export default memo(EventOverview);