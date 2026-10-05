import { Search } from "lucide-react";
import { useEraContext } from "../../Contexts/EraContext";
import { memo } from "react";




const ErasSearch = () => {

        const {setSearch} = useEraContext();
    
        const handleSubmit = (e : React.FormEvent<HTMLFormElement>) => {
    
            e.preventDefault();
    
            const form = e.currentTarget;
            const formData = new FormData(form);
    
            const searchInput = formData.get("search") as string;
    
            if(searchInput){
                setSearch(searchInput)
            }
    
    
        }

    return(
         <form className="relative  mt-10" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="search"
                        placeholder="Search Era..."
                        className="w-[900px] text-[14px] border border-transparent pl-4 pr-10
                        h-[42px] rounded-lg resize-none bg-gray-50 text-[#222344]
                        focus:outline-none focus:ring-2 focus:ring-[#3E3025]
                        max-[950px]:w-[600px] max-[620px]:w-[300px]"
                    />
                    <Search
                    type="submit"
                        size={25}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3E3025]/90 
                        cursor-pointer
                        "
                    />
                </form>
    )
}


export default memo(ErasSearch);