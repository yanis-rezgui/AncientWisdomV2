import { memo, useEffect, useState } from "react";
import { useFiguresContext } from "../../Contexts/FiguresContext";
import { useEraContext } from "../../Contexts/EraContext";
import { useQuotesAdminContext } from "../../AdminContexts/QuotesAdminContext";

const UpdateQuotePop = () => {

    const { figuresOptions } = useFiguresContext();
    const { erasOptions } = useEraContext();

    const {
        selectedQuote,
        setSelectedQuote,
        setShowUpdatePop,
        updateQuote,
        loadingUpdateQuote
    } = useQuotesAdminContext();

    const [tags, setTags] = useState<string[]>([]);
    const [tag, setTag] = useState<string>("");

    /*
    --------------------------------------------------
    Préremplir les tags lorsque selectedQuote change
    --------------------------------------------------
    */

    useEffect(() => {

        if (selectedQuote) {
            setTags(selectedQuote.tags || []);
        }

    }, [selectedQuote]);


    /*
    --------------------------------------------------
    Ajouter un tag
    --------------------------------------------------
    */

    const addTag = (t: string) => {

        const normalizedTag = t.trim();

        if (!normalizedTag) return;

        if (tags.includes(normalizedTag)) return;

        setTags(prev => [...prev, normalizedTag]);
        setTag("");
    };


    /*
    --------------------------------------------------
    Supprimer un tag
    --------------------------------------------------
    */

    const removeTag = (index: number) => {

        setTags(prev =>
            prev.filter((_, i) => i !== index)
        );
    };


    /*
    --------------------------------------------------
    Fermer popup
    --------------------------------------------------
    */

    const closePop = () => {
        setShowUpdatePop(false);
        setSelectedQuote(null);
    };


    /*
    --------------------------------------------------
    Submit
    --------------------------------------------------
    */

    const submitForm = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        if (!selectedQuote) return;

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

        await updateQuote(
            selectedQuote._id,
            data
        );
    };


    /*
    --------------------------------------------------
    Aucun quote sélectionné
    --------------------------------------------------
    */

    if (!selectedQuote) return null;


    return (
        <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[800px] bg-white flex flex-col rounded-[10px] 
                overflow-y-auto max-h-[90vh]"
            >

                {/* HEADER */}

                <div
                    className="flex flex-row justify-between items-center 
                    p-3 text-gray-950"
                >

                    <h3 className="text-[1.3em] font-bold">
                        Update Quote
                    </h3>

                    <span
                        onClick={closePop}
                        className="text-[2em] cursor-pointer 
                        transition-opacity duration-200
                        hover:opacity-80 active:opacity-60"
                    >
                        &times;
                    </span>

                </div>


                {/* FORM */}

                <form
                    onSubmit={submitForm}
                    className="flex flex-col w-full gap-4 p-3 
                    border-t border-t-gray-300"
                >

                    {/* QUOTE */}

                    <div className="flex flex-col gap-1">

                        <label
                            htmlFor="text"
                            className="font-semibold text-gray-800"
                        >
                            Quote
                        </label>

                        <textarea
                            id="text"
                            name="text"
                            defaultValue={selectedQuote.text}
                            placeholder="Quote"
                            rows={5}
                            className="w-full border border-gray-300 
                            rounded-[5px] p-2 outline-none
                            focus:border-gray-500 resize-none"
                            required
                        />

                    </div>


                    {/* SOURCE */}

                    <div className="flex flex-col gap-1">

                        <label
                            htmlFor="source"
                            className="font-semibold text-gray-800"
                        >
                            Source
                        </label>

                        <input
                            id="source"
                            name="source"
                            type="text"
                            defaultValue={selectedQuote.source}
                            placeholder="Source"
                            className="w-full border border-gray-300 
                            rounded-[5px] p-2 outline-none
                            focus:border-gray-500"
                            required
                        />

                    </div>


                    {/* AUTHOR */}

                    <div className="flex flex-col gap-1">

                        <label
                            htmlFor="author"
                            className="font-semibold text-gray-800"
                        >
                            Author
                        </label>

                        <select
                            id="author"
                            name="author"
                            defaultValue={selectedQuote.author?._id}
                            className="w-full border border-gray-300 
                            rounded-[5px] p-2 outline-none
                            focus:border-gray-500 bg-white"
                            required
                        >

                            <option value="">
                                Select an author
                            </option>

                            {figuresOptions.map((figure) => (

                                <option
                                    key={figure._id}
                                    value={figure._id}
                                >
                                    {figure.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* ERA */}

                    <div className="flex flex-col gap-1">

                        <label
                            htmlFor="era"
                            className="font-semibold text-gray-800"
                        >
                            Historical Era
                        </label>

                        <select
                            id="era"
                            name="era"
                            defaultValue={selectedQuote.era?._id}
                            className="w-full border border-gray-300 
                            rounded-[5px] p-2 outline-none
                            focus:border-gray-500 bg-white"
                            required
                        >

                            <option value="">
                                Select an era
                            </option>

                            {erasOptions.map((era) => (

                                <option
                                    key={era._id}
                                    value={era._id}
                                >
                                    {era.name}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* TAGS */}

                    <div className="flex flex-col gap-2">

                        <label
                            htmlFor="tag"
                            className="font-semibold text-gray-800"
                        >
                            Tags
                        </label>


                        <div className="flex flex-row gap-2">

                            <input
                                id="tag"
                                name="tag"
                                type="text"
                                value={tag}
                                placeholder="Tag"
                                className="flex-1 border border-gray-300 
                                rounded-[5px] p-2 outline-none
                                focus:border-gray-500"
                                onChange={(e) =>
                                    setTag(e.target.value)
                                }
                                onKeyDown={(e) => {

                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        addTag(tag);
                                    }

                                }}
                            />

                            <button
                                type="button"
                                onClick={() => addTag(tag)}
                                className="bg-gray-200 text-gray-800 
                                px-4 rounded-[5px] cursor-pointer
                                transition-opacity duration-200
                                hover:opacity-80 active:opacity-60"
                            >
                                Add
                            </button>

                        </div>


                        {/* TAG LIST */}

                        {tags.length > 0 && (

                            <div className="flex flex-wrap gap-2 mt-1">

                                {tags.map((currentTag, index) => (

                                    <div
                                        key={`${currentTag}-${index}`}
                                        className="flex items-center gap-2
                                        bg-gray-100 border border-gray-300
                                        rounded-full px-3 py-1"
                                    >

                                        <span className="text-sm">
                                            {currentTag}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeTag(index)
                                            }
                                            className="text-gray-500
                                            cursor-pointer
                                            hover:text-red-600"
                                        >
                                            &times;
                                        </button>

                                    </div>

                                ))}

                            </div>

                        )}

                    </div>


                    {/* BUTTONS */}

                    <div
                        className="flex flex-row justify-end gap-3 
                        mt-3"
                    >

                        <button
                            type="button"
                            onClick={closePop}
                            className="bg-gray-200 text-gray-800 
                            p-2 px-4 rounded-[5px] font-[600]
                            cursor-pointer
                            transition-opacity duration-200
                            hover:opacity-80 active:opacity-60"
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="bg-gray-950 text-white
                            p-2 px-4 rounded-[5px] font-[600]
                            cursor-pointer
                            transition-opacity duration-200
                            hover:opacity-80 active:opacity-60"
                        >
                            {loadingUpdateQuote ? "Loading..." : "Update Quote"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default memo(UpdateQuotePop);