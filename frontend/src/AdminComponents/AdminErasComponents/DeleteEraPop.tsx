import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useErasAdminContext } from "../../AdminContexts/ErasAdminContext";


const DeleteEraPop = () => {

    const navigate = useNavigate();

    const {
        eraDelete,
        setEraDelete,
        setShowDeletePop,
        deleteEra,
        loadingDeleteEra,
        errorMsg,
        setErrorMsg
    } = useErasAdminContext();

    const closePop = () => {
        if (loadingDeleteEra) return;
        setErrorMsg("");
        setShowDeletePop(false);
        setEraDelete(null);
    };

    // Fermeture avec la touche Échap
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") closePop();
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

    if (!eraDelete) return null;

    const handleDelete = async () => {
        const success = await deleteEra(eraDelete._id);

        if (success) {
            setShowDeletePop(false);
            setEraDelete(null);
            // Si on supprime depuis la page Update, on retourne à la liste
            navigate("/admin/eras");
        }
    };

    return (
        <div
            onClick={closePop}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-[420px] max-w-full bg-[#F8F5EF] rounded-lg shadow-xl
                p-5 gap-3 max-[450px]:p-4 justify-center"
            >
                <div className="flex flex-row items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-red-100">
                        <i className="fa-solid fa-triangle-exclamation text-red-900"></i>
                    </div>

                    <h3 className="text-[18px] font-bold text-[#3E3025]">Delete this era?</h3>
                </div>

                <p className="text-[14px] text-gray-700">
                    You are about to delete <span className="font-bold text-[#3E3025]">{eraDelete.name}</span>
                    {" "}with its image and its {eraDelete.sections?.length ?? 0} section(s).
                    This action cannot be undone.
                </p>

                {errorMsg && (
                    <p className="text-[13px] text-red-800 font-[600]">{errorMsg}</p>
                )}

                <div className="flex flex-row justify-end gap-2 mt-2 max-[450px]:flex-col-reverse max-[450px]:items-stretch">
                    <button
                        type="button"
                        onClick={closePop}
                        disabled={loadingDeleteEra}
                        className="bg-gray-200 text-[#3E3025] text-[14px] font-[600] p-2 px-4 rounded-[5px]
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={loadingDeleteEra}
                        className="bg-red-900 text-white text-[14px] font-[600] p-2 px-4 rounded-[5px]
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingDeleteEra ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</>
                        ) : (
                            <><i className="fa-solid fa-trash"></i> Delete era</>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteEraPop);