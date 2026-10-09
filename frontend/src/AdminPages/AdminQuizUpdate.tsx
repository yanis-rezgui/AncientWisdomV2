import { useNavigate, useParams } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useQuizAdminContext } from "../AdminContexts/QuizAdminContext";
import { buildQuizPayload, quizToForm, validateQuizForm, type QuizFormState } from "../AdminComponents/AdminQuizzesComponents/quizFormUtils";
import QuizForm from "../AdminComponents/AdminQuizzesComponents/QuizForm";
import DeleteQuizPop from "../AdminComponents/AdminQuizzesComponents/DeleteQuizPop";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import { useEraContext } from "../Contexts/EraContext";


const AdminQuizUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {erasOptions} = useEraContext();

    const {
        currentQuiz, loadingQuiz, getAdminQuiz,
        updateQuiz, loadingUpdateQuiz, errorMsg,
        showDeletePop, setShowDeletePop, setQuizDelete, setErrorMsg,
    } = useQuizAdminContext();

    const [form, setForm] = useState<QuizFormState | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const storageKey = `modifQuiz-${id}`;

    useEffect(() => {
        if (id) getAdminQuiz(id);
    }, [id]);

    // Charge le quiz (ou le brouillon s'il existe)
    useEffect(() => {
        if (!currentQuiz) return;

        try {
            const saved = localStorage.getItem(storageKey);
            setForm(saved ? JSON.parse(saved) : quizToForm(currentQuiz));
        } catch {
            setForm(quizToForm(currentQuiz));
        }
    }, [currentQuiz]);

    // Brouillon seulement s'il diffère du quiz enregistré
    useEffect(() => {
        if (!form || !currentQuiz) return;

        const isUnchanged = JSON.stringify(form) === JSON.stringify(quizToForm(currentQuiz));

        if (isUnchanged) localStorage.removeItem(storageKey);
        else localStorage.setItem(storageKey, JSON.stringify(form));
    }, [form, currentQuiz]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form || !id) return;

        const validationError = validateQuizForm(form);

        if (validationError) {
            setToast({ message: validationError, type: "error" });
            return;
        }

        const success = await updateQuiz(id, buildQuizPayload(form));

        if (success) {
            setToast({ message: "Quiz updated successfully!", type: "success" });
            localStorage.removeItem(storageKey);
        } else {
            setToast({ message: errorMsg || "Something went wrong.", type: "error" });
        }
    };

    return (
        <>
            <section className="flex flex-col min-h-screen w-full items-center bg-[#E8E2D6]">
                {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

                {loadingQuiz ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-40 text-center">Loading ...</p>
                ) : !currentQuiz || !form ? (
                    <p className="text-[17px] text-gray-900 font-bold mt-40 text-center">Quiz not available</p>
                ) : (
                    <>
                        <p className="text-[1.8em] mt-20 font-bold text-center underline px-3 leading-8 break-words max-w-full">
                            {currentQuiz.title}
                        </p>

                        <div className="flex flex-col w-[1000px] mt-10 max-[1050px]:w-full px-5 pb-20">
                            <div className="flex flex-row justify-between items-center gap-3 mb-5">
                                <div
                                    onClick={() => navigate(-1)}
                                    className="text-[#3E3025] underline cursor-pointer transition-opacity duration-200
                                    hover:opacity-80 active:opacity-60"
                                >
                                    ← Back to quizzes
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setErrorMsg("");
                                        setQuizDelete(currentQuiz);
                                        setShowDeletePop(true);
                                    }}
                                    className="bg-red-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                                >
                                    <i className="fa-solid fa-trash"></i> Delete
                                </button>
                            </div>

                            <p className="font-bold text-[1.8em] text-[#3E3025] underline mb-5 max-[620px]:text-[1.4em]">
                                Update The Quiz:
                            </p>

                            <QuizForm
                                form={form}
                                setForm={setForm as React.Dispatch<React.SetStateAction<QuizFormState>>}
                                eraOptions={erasOptions}
                                loading={loadingUpdateQuiz}
                                submitLabel="Save changes"
                                loadingLabel="Saving..."
                                submitIcon="fa-solid fa-floppy-disk"
                                onSubmit={submitForm}
                                onCancel={() => navigate(-1)}
                            />
                        </div>
                    </>
                )}
            </section>

            {showDeletePop && <DeleteQuizPop />}
        </>
    );
};

export default memo(AdminQuizUpdate);