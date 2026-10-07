import { memo, useState } from "react"
import { useFiguresContext } from "../../Contexts/FiguresContext";
import { useEraContext } from "../../Contexts/EraContext";
import { useQuotesAdminContext } from "../../AdminContexts/QuotesAdminContext";




const AddQuotePop = () => {

    
    const {figuresOptions} = useFiguresContext();
    const {erasOptions} = useEraContext();
    const [tags, setTags] = useState<string[]>([]);
    const [tag, setTag] = useState<string>("");
    const {setShowAddPop, addQuote} = useQuotesAdminContext();

    const addTag = (t : string) => {

        if(tag === "") return;

        const newTags = [...tags, t]

        setTags(newTags);
        setTag("");
    }

    const removeTag = (index : number) => {

        const newTags = tags.filter((_,i)=>i!==index);

        setTags(newTags);
    }

       const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const text = formData.get("text") as string;
    const source = formData.get("source") as string;
    const era = formData.get("era") as string;
    const author = formData.get("author") as string;

    const data = {
        text,
        source,
        era,
        author,
        tags
    };

    await addQuote(data);
};

    return(
       <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[800px] bg-white flex flex-col rounded-[10px] overflow-y-auto max-h-[90vh]"
            >
                <div className="flex flex-row justify-between items-center p-3 text-gray-950">
                    <h3 className="text-[1.3em] font-bold">
                        Add a new Quote
                    </h3>

                    <span 
                    onClick={()=>setShowAddPop(false)}
                    className="text-[2em] cursor-pointer transition-opacity duration-200 
                    hover:opacity-80 active:opacity-60
                    ">
                        &times;
                    </span>
                </div>

                <form className="flex flex-col w-full gap-4 p-3 border-t border-t-gray-300"
                onSubmit={submitForm}
                >
                    
                    <div className="flex flex-col w-full gap-1">
                    <label htmlFor=""
                    className="text-[#3E3025] font-[600]"
                    >
                        Author
                    </label>
                    <select name="author" id=""
                    className="p-2 bg-gray-50 border border-gray-300 rounded-[5px]
                    cursor-pointer text-[15px]
                    "
                    
                    required
                    >
                         {figuresOptions.map((f)=>{
                            return(
                                <option value={f._id}>{f.name}</option>
                            )
                         })}
                    </select>
                    </div>

                    <div className="flex flex-col w-full gap-1">
                    <label htmlFor="era"
                    className="text-[#3E3025] font-[600]"
                    >
                        Era
                    </label>
                    <select name="era" id=""
                    className="p-2 bg-gray-50 border border-gray-300 rounded-[5px]
                    cursor-pointer text-[15px]
                    "
                    required
                    >
                         {erasOptions.map((f)=>{
                            return(
                                <option value={f._id} key={f._id}>{f.name}</option>
                            )
                         })}
                    </select>
                    </div>

                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor=""
                        className="text-[#3E3025] font-[600]"
                        >
                            Text
                        </label>
                        <textarea name="text" id=""
                        placeholder="Text of the quote"
                        className="p-2 bg-gray-50 border border-gray-300 rounded-[5px]
                        text-[15px]
                        "
                        required
                        />
                    </div>

                    <div className="flex flex-col w-full gap-1">
                        <label htmlFor=""
                        className="text-[#3E3025] font-[600]"
                        >
                            Source
                        </label>

                        <input 
                        type="text" 
                        name="source"
                        placeholder="Ex. Name of a book"
                        className="p-2 bg-gray-50 border border-gray-300 rounded-[5px] text-[15px]"
                        required
                        />
                    </div>

                    <div className="flex flex-col w-full gap-1">
                       <label htmlFor=""
                       className="text-[#3E3025] font-[600]"
                       >Tags</label>
                       <div className="flex flex-row w-full gap-2 items-center">
                        <input 
                        name="tag"
                        type="text" 
                        value={tag}
                        placeholder="Tag"
                    
                        className="p-2 bg-gray-50 border border-gray-300 rounded-[5px] text-[15px] w-full"
                        onChange={(e)=>setTag(e.target.value)}
                        onKeyDown={(e)=>{
                            if(e.key === "Enter"){
                                e.preventDefault();
                                addTag(tag)
                            }
                        }}
                        />
                        <button 
                       type="button"
                        onClick={()=>addTag(tag)}
                        className="w-[80px] p-2 bg-[#3E3025] font-[600] rounded-[5px] text-white
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 
                        active:opacity-60
                        "
                            >
                            Add
                        </button>

                       </div>

                       <div className="p-2 flex flex-wrap items-center gap-4">
                        {tags.map((t, i)=>{
                            return(
                                <div 
                                className="text-[15px]  cursor-pointer text-[#3E3025] font-[500]
                                hover:text-[#A67C52] transition-colors duration-300 font-[600]"
                                onClick={()=>removeTag(i)} key={i}>
                                    {t} &times;
                                </div>
                            )
                        })}
                       </div>
                    </div>

                    <button type="submit"
                    className="bg-[#3E3025] text-white font-semibold rounded-lg w-full py-2
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 
                        active:opacity-60 mb-5
                    "
                    >
                       Add Quote
                    </button>
                </form>
            </div>
        </div>
    )
}


export default memo(AddQuotePop);