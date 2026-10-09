import { memo, useEffect, useState } from "react";
import { useQuizQuestionsAdminContext } from "../../AdminContexts/QuizQuestionsAdminContext";
import type { IQuizQuestion, QuizQuestionDifficulty, QuizQuestionStatus } from "../../Types/Types";

import {
    buildQuestionPayload, emptyQuestionForm, questionToForm, validateQuestionForm,
    type QuestionFormState,
} from "./questionFormUtils";
import { useEraContext } from "../../Contexts/EraContext";

interface Props {
    question: IQuizQuestion | null; // null = ajout
    onClose: () => void;
    onSaved: (message: string) => void;
}

const inputClass = `w-full p-2 rounded-[5px] border border-gray-300 bg-white
text-[14px] text-gray-900 outline-none transition-colors duration-200
focus:border-[#3E3025]`;

const labelClass = "text-[14px] font-[600] text-[#3E3025]";

const QuestionFormPop = ({ question, onClose, onSaved }: Props) => {
    const {
        addQuestion, updateQuestion, loadingAddQuestion, loadingUpdateQuestion,
        errorMsg, setErrorMsg,
    } = useQuizQuestionsAdminContext();
    const {erasOptions} = useEraContext();

    const isEdit = question !== null;
    const loading = loadingAddQuestion || loadingUpdateQuestion;

    const [form, setForm] = useState<QuestionFormState>(question ? questionToForm(question) : emptyQuestionForm);
    const [formError, setFormError] = useState<string>("");

    useEffect(() => {
        setErrorMsg("");
        const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape" && !loading) onClose(); };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    const setOption = (index: number, value: string) => {
        setForm((p) => ({ ...p, options: p.options.map((o, i) => (i === index ? value : o)) }));
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormError("");

        const error = validateQuestionForm(form);
        if (error) {
            setFormError(error);
            return;
        }

        const payload = buildQuestionPayload(form);
        const result = isEdit ? await updateQuestion(question._id, payload) : await addQuestion(payload);

        if (result) onSaved(isEdit ? "Question updated successfully!" : "Question added successfully!");
    };

    return (
        <div onClick={() => !loading && onClose()} className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-3">
            <form
                onSubmit={submit}
                onClick={(e) => e.stopPropagation()}
                className="flex flex-col w-[640px] max-w-full max-h-[92vh] overflow-y-auto bg-[#F8F5EF]
                rounded-lg shadow-xl p-5 gap-4 max-[620px]:p-3"
            >
                <div className="flex flex-row justify-between items-center">
                    <h3 className="text-[18px] font-bold text-[#3E3025]">
                        {isEdit ? "Update the question" : "Add a question"}
                    </h3>
                    <i onClick={() => !loading && onClose()} className="fa-solid fa-xmark cursor-pointer text-gray-600 hover:text-gray-900"></i>
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Question</label>
                    <textarea
                        rows={3}
                        value={form.questionText}
                        onChange={(e) => setForm((p) => ({ ...p, questionText: e.target.value }))}
                        placeholder="Who was the first emperor of Rome?"
                        className={`${inputClass} resize-y`}
                    />
                </div>

                <div className="flex flex-col gap-2">
                    <label className={labelClass}>Options (select the correct one)</label>

                    {form.options.map((option, index) => (
                        <div key={index} className="flex flex-row items-center gap-2">
                            <input
                                type="radio"
                                name="correct"
                                checked={form.correctAnswerIndex === index}
                                onChange={() => setForm((p) => ({ ...p, correctAnswerIndex: index }))}
                                className="shrink-0 cursor-pointer"
                                aria-label={`Option ${index + 1} is correct`}
                            />
                            <input
                                type="text"
                                value={option}
                                onChange={(e) => setOption(index, e.target.value)}
                                placeholder={`Option ${index + 1}`}
                                className={inputClass}
                            />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Explanation <span className="font-normal text-gray-500">(optional)</span></label>
                    <textarea
                        rows={3}
                        value={form.explanation}
                        onChange={(e) => setForm((p) => ({ ...p, explanation: e.target.value }))}
                        placeholder="Shown to the player after answering"
                        className={`${inputClass} resize-y`}
                    />
                </div>

                <div className="grid grid-cols-3 gap-3 max-[620px]:grid-cols-1">
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Era</label>
                        <select
                            value={form.era}
                            onChange={(e) => setForm((p) => ({ ...p, era: e.target.value }))}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="">Choose an era</option>
                            {erasOptions.map((era) => (
                                <option key={era._id} value={era._id}>{era.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Difficulty</label>
                        <select
                            value={form.difficulty}
                            onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value as QuizQuestionDifficulty }))}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="Easy">Apprentice (Easy)</option>
                            <option value="Medium">Scholar (Medium)</option>
                            <option value="Hard">Sage (Hard)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as QuizQuestionStatus }))}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Source <span className="font-normal text-gray-500">(optional)</span></label>
                        <input
                            type="text"
                            value={form.source}
                            onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Tags <span className="font-normal text-gray-500">(comma separated)</span></label>
                        <input
                            type="text"
                            value={form.tags}
                            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
                            placeholder="rome, emperor"
                            className={inputClass}
                        />
                    </div>
                </div>

                {(formError || errorMsg) && (
                    <p className="text-[13px] text-red-800 font-[600]">{formError || errorMsg}</p>
                )}

                <div className="flex flex-row justify-end gap-2 max-[450px]:flex-col-reverse max-[450px]:items-stretch">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="bg-gray-200 text-[#3E3025] text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#3E3025] text-white text-[14px] font-[600] p-2 px-4 rounded-[5px] cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                        ) : (
                            <><i className={isEdit ? "fa-solid fa-floppy-disk" : "fa-solid fa-plus"}></i> {isEdit ? "Save changes" : "Add question"}</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default memo(QuestionFormPop);