import { memo } from "react"
import { Link } from "react-router-dom";
import ErasSearch from "../Components/ErasComponents/ErasSearch";
import { useEraContext } from "../Contexts/EraContext";
import Pagination from "../Components/Pagination/Pagination";
import AdminEraCard from "../AdminComponents/AdminErasComponents/AdminEraCard";
import { useErasAdminContext } from "../AdminContexts/ErasAdminContext";
import DeleteEraPop from "../AdminComponents/AdminErasComponents/DeleteEraPop";




const AdminEras = () => {

    const {totalEras, eras,  page, totalPages, limit, setPage, setLimit} = useEraContext();
    const {showDeletePop} = useErasAdminContext();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6]">
            <div className="w-[900px] flex flex-row  items-center justify-between mt-10
            max-[950px]:w-[600px] max-[650px]:flex-col max-[650px]:justify-center
            max-[650px]:px-4 max-[650px]:gap-3
            ">
                <h2 className="text-[#3E3025] text-[1.5em] font-[600]">
                    Historical Eras
                </h2>

                <Link to={"/admin/addEra"} className="bg-[#3E3025] text-white text-[14px] font-[600]
                p-2 rounded-lg cursor-pointer transition-opacity duration-200 
                hover:opacity-80 active:opacity-60
                ">
                    + Add Era
                </Link>
            </div>

            <p className="text-[#3E3025] mt-5 px-4 text-center">
                Manage the historical periods displayed on Ancient Wisdom, Add, Update And Delete
            </p>

            <ErasSearch/>

            <div className="flex flex-row justify-center items-center gap-2 mt-5 font-[600] text-[18px]">
              <p>
                Total Eras : 
              </p>
              <p>
                {totalEras}
              </p>
            </div>
 
             <div className="flex flex-col justify-center items-center gap-4 mt-5">
                {eras.map((e)=>{
                    return(
                        <AdminEraCard era={e} key={e._id}/>
                    )
                })}
             </div>
              
            <Pagination
            page={page}
            totalPages={totalPages} 
            totalItems={totalEras} 
            limit={limit} 
            setPage={setPage} 
            setLimit={setLimit} 
            />


          {showDeletePop && <DeleteEraPop/>}
        </section>
    )
}

export default memo(AdminEras);