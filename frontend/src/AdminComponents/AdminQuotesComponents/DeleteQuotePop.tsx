import { memo } from "react";
import { useQuotesAdminContext } from "../../AdminContexts/QuotesAdminContext";

const DeleteQuotePop = () => {

    const {
        selectedQuote,
        setSelectedQuote,
        setShowDeletePop,
        deleteQuote,
        loadingDeleteQuote
    } = useQuotesAdminContext();


    const closePop = () => {
        setShowDeletePop(false);
        setSelectedQuote(null);
    };


    const handleDelete = async () => {

        if (!selectedQuote) return;

        await deleteQuote(selectedQuote._id);
    };


    if (!selectedQuote) return null;


    return (
        <div
            className="fixed inset-0 bg-black/40 flex justify-center items-center
            z-50 p-4"
        >

            <div
                onClick={(e) => e.stopPropagation()}
                className="w-[500px] max-w-full bg-white flex flex-col
                rounded-[10px] overflow-hidden"
            >

                {/* HEADER */}

                <div
                    className="flex flex-row justify-between items-center
                    p-4 text-gray-950"
                >

                    <h3 className="text-[1.3em] font-bold">
                        Delete Quote
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


                {/* CONTENT */}

                <div
                    className="flex flex-col gap-4 p-4
                    border-t border-t-gray-300"
                >

                    <p className="text-gray-700 leading-6">
                        Are you sure you want to delete this quote?
                        This action cannot be undone.
                    </p>


                    {/* QUOTE PREVIEW */}

                    <div
                        className="bg-gray-50 border border-gray-200
                        rounded-[8px] p-4"
                    >

                        <p
                            className="text-gray-800 italic leading-6
                            line-clamp-4"
                        >
                            “{selectedQuote.text}”
                        </p>


                        <div
                            className="flex flex-row justify-between
                            items-center mt-3 gap-3"
                        >

                            <span
                                className="text-sm font-semibold
                                text-gray-700"
                            >
                                {selectedQuote.author?.name}
                            </span>

                            <span
                                className="text-xs text-gray-500"
                            >
                                {selectedQuote.source}
                            </span>

                        </div>

                    </div>


                    {/* WARNING */}

                    <div
                        className="bg-red-50 border border-red-200
                        rounded-[6px] p-3"
                    >

                        <p className="text-sm text-red-700">
                            Deleting this quote will permanently remove it
                            from Ancient Wisdom.
                        </p>

                    </div>


                    {/* ACTIONS */}

                    <div
                        className="flex flex-row justify-end gap-3
                        mt-1"
                    >

                        <button
                            type="button"
                            onClick={closePop}
                            disabled={loadingDeleteQuote}
                            className="bg-gray-200 text-gray-800
                            p-2 px-4 rounded-[5px] font-[600]
                            cursor-pointer
                            transition-opacity duration-200
                            hover:opacity-80 active:opacity-60
                            disabled:opacity-50
                            disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={loadingDeleteQuote}
                            className="bg-red-700 text-white
                            p-2 px-4 rounded-[5px] font-[600]
                            cursor-pointer
                            transition-opacity duration-200
                            hover:opacity-90 active:opacity-60
                            disabled:opacity-50
                            disabled:cursor-not-allowed"
                        >

                            {loadingDeleteQuote ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin mr-2"></i>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-trash mr-2"></i>
                                    Delete Quote
                                </>
                            )}

                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default memo(DeleteQuotePop);