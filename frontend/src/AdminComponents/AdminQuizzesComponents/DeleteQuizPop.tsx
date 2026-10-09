import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizAdminContext } from "../../AdminContexts/QuizAdminContext";

const DeleteQuizPop = () => {
    const navigate = useNavigate();

    const {
        quizDelete, setQuizDelete, setShowDeletePop,
        deleteQuiz, updateQuiz,
        loadingDeleteQuiz, loadingUpdateQuiz,
        errorMsg, setErrorMsg,
    } = useQuizAdminContext();

    const busy = loadingDeleteQuiz || loadingUpdateQuiz;

    const closePop = () => {
        if (busy) return;
        setErrorMsg("");
        setShowDeletePop(false);
        setQuizDelete(null);
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closePop(); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

    if (!quizDelete) return null;

    // Le backend refuse la suppression d'un quiz qui a des tentatives (409)
    const hasAttempts = errorMsg.toLowerCase().includes("attempts");

    const handleDelete = async () => {
        const success = await deleteQuiz(quizDelete._id);

        if (success) {
            setShowDeletePop(false);
            setQuizDelete(null);
            navigate("/admin/quizzes");
        }
    };

    const handleArchive = async () => {
        const success = await updateQuiz(quizDelete._id, { status: "archived" });

        if (success) {
            setErrorMsg("");
            setShowDeletePop(false);
            setQuizDelete(null);
            navigate("/admin/quizzes");
        }
    };

    return (
        <div onClick={closePop} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <div
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-[420px] max-w-full bg-[#F8F5EF] rounded-lg shadow-xl
                p-5 gap-3 max-[450px]:p-4 justify-center"
            >
                <div className="flex flex-row items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full bg-red-100">
                        <i className="fa-solid fa-triangle-exclamation text-red-900"></i>
                    </div>
                    <h3 className="text-[18px] font-bold text-[#3E3025]">Delete this quiz?</h3>
                </div>

                <p className="text-[14px] text-gray-700">
                    You are about to delete <span className="font-bold text-[#3E3025] break-words">{quizDelete.title}</span>
                    {" "}and its {quizDelete.questions?.length ?? 0} question link(s).
                    The questions themselves are kept. This action cannot be undone.
                </p>

                {errorMsg && <p className="text-[13px] text-red-800 font-[600]">{errorMsg}</p>}

                <div className="flex flex-row justify-end gap-2 mt-2 max-[450px]:flex-col-reverse max-[450px]:items-stretch">
                    <button
                        type="button"
                        onClick={closePop}
                        disabled={busy}
                        className="bg-gray-200 text-[#3E3025] text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    {hasAttempts && quizDelete.status !== "archived" ? (
                        <button
                            type="button"
                            onClick={handleArchive}
                            disabled={busy}
                            className="bg-[#A67C2D] text-white text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingUpdateQuiz ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Archiving...</>
                            ) : (
                                <><i className="fa-solid fa-box-archive"></i> Archive instead</>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={busy}
                            className="bg-red-900 text-white text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingDeleteQuiz ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</>
                            ) : (
                                <><i className="fa-solid fa-trash"></i> Delete quiz</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteQuizPop);