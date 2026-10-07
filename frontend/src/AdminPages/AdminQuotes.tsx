import { memo } from "react"
import QuotesFilter from "../Components/QuoteComponents/QuotesFilter";
import SearchBar from "../Components/QuoteComponents/SearchBar";
import { useQuotesContext } from "../Contexts/QuotesContext";
import QuoteAdminCard from "../AdminComponents/AdminQuotesComponents/QuoteAdminCard";
import { useQuotesAdminContext } from "../AdminContexts/QuotesAdminContext";
import AddQuotePop from "../AdminComponents/AdminQuotesComponents/AddQuotePop";
import UpdateQuotePop from "../AdminComponents/AdminQuotesComponents/UpdateQuotePop";
import DeleteQuotePop from "../AdminComponents/AdminQuotesComponents/DeleteQuotePop";
import Pagination from "../Components/Pagination/Pagination";




const AdminQuotes = () => {

    const {quotes, totalQuotes, page, totalPages, limit, setPage, setLimit} = useQuotesContext();
    const {showAddPop, setShowAddPop, showUpdatePop, showDeletePop} = useQuotesAdminContext();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6]">

            <h3 className="mt-10 text-gray-900 font-bold text-[2em]">
                Quotes
            </h3>

            <p className="text-[1.1em] text-center text-gray-900 mt-2">
                Manage the historical quotations of Ancient Wisdom.
            </p>

            <button 
            onClick={()=>setShowAddPop(true)}
            className="bg-[#3E3025] text-white p-2 rounded-[5px] text-[14px] font-[600] mt-4
            cursor-pointer transition-opacity duration-200 hover:opacity-80 
            active:opacity-60
            ">
                + Add Quote
            </button>

            
             <SearchBar/>
            <QuotesFilter/>

           <div className="flex flex-row justify-center items-center gap-2 mt-5 text-[17px] font-[600]">
              <p>
                Total Quotes : 
              </p>
              <p>
                {totalQuotes}
              </p>
           </div>
           <div className="flex flex-wrap gap-5 px-10 justify-center items-baseline mt-5 mb-10">
            {quotes.map((q)=>{
                return(
                    <QuoteAdminCard quote={q} key={q._id}/>
                )
            })}
            </div>

            <Pagination 
            
            page={page}
            totalPages={totalPages} 
            totalItems={totalQuotes} 
            limit={limit} 
            setPage={setPage} 
            setLimit={setLimit} 
            />

            {showAddPop && <AddQuotePop/>}
            {showUpdatePop && <UpdateQuotePop/>}
            {showDeletePop && <DeleteQuotePop/>}

        </section>
    )
}

export default memo(AdminQuotes);