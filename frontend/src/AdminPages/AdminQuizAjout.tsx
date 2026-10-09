import { useNavigate } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useQuizAdminContext } from "../AdminContexts/QuizAdminContext";
import { buildQuizPayload, emptyQuizForm, validateQuizForm, type QuizFormState } from "../AdminComponents/AdminQuizzesComponents/quizFormUtils";
import QuizForm from "../AdminComponents/AdminQuizzesComponents/QuizForm";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import { useEraContext } from "../Contexts/EraContext";

const STORAGE_KEY = "nouveauQuiz-draft";

const AdminQuizAjout = () => {
    const navigate = useNavigate();
    const { addQuiz, loadingAddQuiz, errorMsg } = useQuizAdminContext();
    const {erasOptions} = useEraContext();

    const [form, setForm] = useState<QuizFormState>(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : emptyQuizForm;
        } catch {
            return emptyQuizForm;
        }
    });
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    }, [form]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const validationError = validateQuizForm(form);

        if (validationError) {
            setToast({ message: validationError, type: "error" });
            return;
        }

        const success = await addQuiz(buildQuizPayload(form));

        if (success) {
            setToast({ message: "Quiz added successfully!", type: "success" });
            localStorage.removeItem(STORAGE_KEY);
            setForm(emptyQuizForm);
            setTimeout(() => navigate("/admin/quizzes"), 1200);
        } else {
            setToast({ message: errorMsg || "Something went wrong.", type: "error" });
        }
    };

    return (
        <section className="flex flex-col min-h-screen w-full items-center bg-[#E8E2D6]">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <p className="text-[1.8em] mt-20 font-bold text-center underline px-3 leading-8">Add A New Quiz</p>

            <div className="flex flex-col w-[1000px] mt-10 max-[1050px]:w-full px-5 pb-20">
                <div
                    onClick={() => navigate(-1)}
                    className="text-[#3E3025] underline cursor-pointer transition-opacity duration-200
                    hover:opacity-80 active:opacity-60 mb-5"
                >
                    ← Back to quizzes
                </div>

                <QuizForm
                    form={form}
                    setForm={setForm}
                    eraOptions={erasOptions}
                    loading={loadingAddQuiz}
                    submitLabel="Add quiz"
                    loadingLabel="Adding..."
                    submitIcon="fa-solid fa-plus"
                    onSubmit={submitForm}
                    onCancel={() => navigate(-1)}
                />
            </div>
        </section>
    );
};

export default memo(AdminQuizAjout);