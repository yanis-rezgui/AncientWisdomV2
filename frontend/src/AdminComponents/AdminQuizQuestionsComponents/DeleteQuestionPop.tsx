import { memo, useEffect } from "react";
import { useQuizQuestionsAdminContext } from "../../AdminContexts/QuizQuestionsAdminContext";

const DeleteQuestionPop = () => {
    const {
        questionDelete, setQuestionDelete, setShowDeletePop,
        deleteQuestion, updateQuestion,
        loadingDeleteQuestion, loadingUpdateQuestion,
        errorMsg, setErrorMsg,
    } = useQuizQuestionsAdminContext();

    const busy = loadingDeleteQuestion || loadingUpdateQuestion;

    const closePop = () => {
        if (busy) return;
        setErrorMsg("");
        setShowDeletePop(false);
        setQuestionDelete(null);
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") closePop(); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    });

    if (!questionDelete) return null;

    // 409 : question liée à un quiz ou une tentative
    const isLinked = errorMsg.toLowerCase().includes("archive");

    const handleDelete = async () => {
        const success = await deleteQuestion(questionDelete._id);
        if (success) {
            setShowDeletePop(false);
            setQuestionDelete(null);
        }
    };

    const handleArchive = async () => {
        const result = await updateQuestion(questionDelete._id, { status: "archived" });
        if (result) {
            setErrorMsg("");
            setShowDeletePop(false);
            setQuestionDelete(null);
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
                    <h3 className="text-[18px] font-bold text-[#3E3025]">Delete this question?</h3>
                </div>

                <p className="text-[14px] text-gray-700 break-words">
                    You are about to delete <span className="font-bold text-[#3E3025]">“{questionDelete.questionText}”</span>.
                    This action cannot be undone.
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

                    {isLinked && questionDelete.status !== "archived" ? (
                        <button
                            type="button"
                            onClick={handleArchive}
                            disabled={busy}
                            className="bg-[#A67C2D] text-white text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loadingUpdateQuestion ? (
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
                            {loadingDeleteQuestion ? (
                                <><i className="fa-solid fa-spinner fa-spin"></i> Deleting...</>
                            ) : (
                                <><i className="fa-solid fa-trash"></i> Delete question</>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteQuestionPop);