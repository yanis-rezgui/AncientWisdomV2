import  { memo } from "react"
import type { HistoricalEra } from "../../Types/Types";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useErasAdminContext } from "../../AdminContexts/ErasAdminContext";



const AdminEraCard = ({era} : {era: HistoricalEra}) => {

    const navigate = useNavigate();
    const {setShowDeletePop, setEraDelete} = useErasAdminContext();

    return(
        <div className="flex flex-row w-[900px] bg-[#F8F5EF] rounded-lg 
        justify-center items-start gap-4 p-3
         shadow-lg
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl
        max-[950px]:w-[600px]
        max-[620px]:w-[320px] 
        max-[620px]:flex-col
        ">
           <img src={era.image.url || ""} alt="" 
           className="w-[200px]  rounded-lg h-full"
           />
            <div className="flex flex-col gap-1">
               <h3 className="text-[18px] font-[600] text-[#3E3025]">
                {era.name}</h3>
                  <div
                className="
                    flex
                    items-center
                    gap-2
                    text-[17px]
                    font-bold
                    text-gray-600
                "
            >
                <span>{era.startYear < 0 ? `${-era.startYear} BC` : `${era.startYear} AC`}</span>

                <ArrowRight size={15} />

                <span>{era.endYear < 0 ? `${-era.endYear} BC` : `${era.endYear} AC`}</span>
            </div>
            <p className="text-[14px] text-gray-700">
                {era.description}
            </p>
            <div className="flex flex-row w-full justify-between items-center">
            <p className="text-[17px] text-gray-950">
                {era.sections.length} sections
            </p>

            <div className="flex flex-row justify-center items-center gap-2 mt-3">
                <button className="bg-green-900 text-white text-[13px] font-[600] p-2
                rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80
                active:opacity-60
                "
                onClick={()=>navigate(`/admin/era/${era._id}`)}
                >
                    <i className="fa-solid fa-pen-to-square"></i> Update
                </button>

                <button 
                 
                className="bg-red-900 text-white text-[13px] font-[600] p-2
                rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80
                active:opacity-60
                "
                onClick={()=>{
                    setEraDelete(era);
                    setShowDeletePop(true);
                }}
                >
                    <i className="fa-solid fa-trash"></i> Delete
                </button>
            </div>

            </div>


            </div>
        </div>
    )
}

export default memo(AdminEraCard);