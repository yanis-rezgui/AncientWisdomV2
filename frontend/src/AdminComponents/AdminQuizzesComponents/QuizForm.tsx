import { memo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { FilterOptionsType, IQuizQuestion, QuizDifficulty, QuizStatus } from "../../Types/Types";
import type { QuizFormState } from "./quizFormUtils";
import QuestionPickerPop from "./QuestionPickerPop";


interface QuizFormProps {
    form: QuizFormState;
    setForm: Dispatch<SetStateAction<QuizFormState>>;
    eraOptions: FilterOptionsType[];
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    submitIcon: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

const inputClass = `w-full p-2 rounded-[5px] border border-gray-300 bg-white
text-[14px] text-gray-900 outline-none transition-colors duration-200
focus:border-[#3E3025]`;

const cardClass = `flex flex-col w-full bg-[#F8F5EF] rounded-lg shadow-lg p-5 gap-4 max-[620px]:p-3`;

const labelClass = "text-[14px] font-[600] text-[#3E3025]";

const QuizForm = ({
    form, setForm, eraOptions, loading, submitLabel, loadingLabel, submitIcon, onSubmit, onCancel,
}: QuizFormProps) => {

    const [showPicker, setShowPicker] = useState<boolean>(false);

    const toggleEra = (id: string) => {
        setForm((prev) => ({
            ...prev,
            eras: prev.eras.includes(id) ? prev.eras.filter((e) => e !== id) : [...prev.eras, id],
        }));
    };

    const addQuestions = (picked: IQuizQuestion[]) => {
        setForm((prev) => {
            const existing = new Set(prev.questions.map((q) => q.question));
            const toAdd = picked
                .filter((q) => !existing.has(q._id))
                .map((q) => ({ question: q._id, questionText: q.questionText, points: 1 }));

            return { ...prev, questions: [...prev.questions, ...toAdd] };
        });
        setShowPicker(false);
    };

    const moveQuestion = (index: number, direction: -1 | 1) => {
        setForm((prev) => {
            const target = index + direction;
            if (target < 0 || target >= prev.questions.length) return prev;

            const questions = [...prev.questions];
            [questions[index], questions[target]] = [questions[target], questions[index]];
            return { ...prev, questions };
        });
    };

    const updatePoints = (index: number, value: string) => {
        setForm((prev) => ({
            ...prev,
            questions: prev.questions.map((q, i) => (i === index ? { ...q, points: Number(value) } : q)),
        }));
    };

    const removeQuestion = (index: number) => {
        setForm((prev) => ({ ...prev, questions: prev.questions.filter((_, i) => i !== index) }));
    };

    const totalPoints = form.questions.reduce((sum, q) => sum + (q.points || 0), 0);

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full items-center gap-5">

            {/* ================= GENERAL ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">General information</h2>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Title</label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                        placeholder="e.g. Rome: from Republic to Empire"
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Slug <span className="font-normal text-gray-500">(optional, generated from the title)</span></label>
                    <input
                        type="text"
                        value={form.slug}
                        onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))}
                        placeholder="rome-republic-to-empire"
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Description</label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                        placeholder="A short summary of this quiz"
                        className={`${inputClass} resize-y`}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4 max-[620px]:grid-cols-1">
                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Difficulty</label>
                        <select
                            value={form.difficulty}
                            onChange={(e) => setForm((p) => ({ ...p, difficulty: e.target.value as QuizDifficulty }))}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="Easy">Apprentice (Easy)</option>
                            <option value="Medium">Scholar (Medium)</option>
                            <option value="Hard">Sage (Hard)</option>
                        </select>
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Time limit (min)</label>
                        <input
                            type="number"
                            min={1}
                            step={1}
                            inputMode="numeric"
                            value={form.timeLimit}
                            onChange={(e) => setForm((p) => ({ ...p, timeLimit: e.target.value }))}
                            placeholder="Unlimited"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className={labelClass}>Status</label>
                        <select
                            value={form.status}
                            onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as QuizStatus }))}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                            <option value="archived">Archived</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* ================= ERAS ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">Eras ({form.eras.length})</h2>

                {eraOptions.length === 0 ? (
                    <p className="text-[14px] text-gray-600">No era available.</p>
                ) : (
                    <div className="flex flex-row flex-wrap gap-2">
                        {eraOptions.map((era) => {
                            const active = form.eras.includes(era._id);
                            return (
                                <button
                                    key={era._id}
                                    type="button"
                                    onClick={() => toggleEra(era._id)}
                                    className={`text-[13px] font-[600] px-3 py-1 rounded-full border cursor-pointer
                                    transition-colors duration-200
                                    ${active
                                        ? "bg-[#3E3025] text-white border-[#3E3025]"
                                        : "bg-white text-[#3E3025] border-gray-300 hover:border-[#3E3025]"}`}
                                >
                                    {era.name}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ================= QUESTIONS ================= */}
            <div className={cardClass}>
                <div className="flex flex-row justify-between items-center gap-3 max-[450px]:flex-col max-[450px]:items-start">
                    <h2 className="text-[18px] font-bold text-[#3E3025]">
                        Questions ({form.questions.length}) · {totalPoints} pts
                    </h2>

                    <button
                        type="button"
                        onClick={() => setShowPicker(true)}
                        className="bg-green-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg cursor-pointer
                        transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <i className="fa-solid fa-plus"></i> Add questions
                    </button>
                </div>

                {form.questions.length === 0 && (
                    <p className="text-[14px] text-gray-600">
                        No question yet. A draft can be empty, a published quiz needs at least one.
                    </p>
                )}

                {form.questions.map((q, index) => (
                    <div key={q.question} className="flex flex-col gap-2 bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex flex-row justify-between items-center gap-2">
                            <span className="text-[13px] font-[600] text-gray-600">Question {index + 1}</span>

                            <div className="flex flex-row gap-1">
                                <button
                                    type="button"
                                    disabled={index === 0}
                                    onClick={() => moveQuestion(index, -1)}
                                    className="bg-gray-200 text-[#3E3025] text-[12px] px-2 py-1 rounded-lg cursor-pointer
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Move up"
                                >
                                    <i className="fa-solid fa-arrow-up"></i>
                                </button>
                                <button
                                    type="button"
                                    disabled={index === form.questions.length - 1}
                                    onClick={() => moveQuestion(index, 1)}
                                    className="bg-gray-200 text-[#3E3025] text-[12px] px-2 py-1 rounded-lg cursor-pointer
                                    disabled:opacity-40 disabled:cursor-not-allowed"
                                    aria-label="Move down"
                                >
                                    <i className="fa-solid fa-arrow-down"></i>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeQuestion(index)}
                                    className="bg-red-900 text-white text-[12px] font-[600] p-1 px-2 rounded-lg cursor-pointer
                                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                                >
                                    <i className="fa-solid fa-trash"></i> Remove
                                </button>
                            </div>
                        </div>

                        <p className="text-[14px] text-gray-900 break-words">{q.questionText}</p>

                        <div className="flex flex-row items-center gap-2">
                            <label className="text-[13px] font-[600] text-[#3E3025]">Points</label>
                            <input
                                type="number"
                                min={1}
                                step={1}
                                inputMode="numeric"
                                value={q.points}
                                onChange={(e) => updatePoints(index, e.target.value)}
                                className={`${inputClass} w-[80px]`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex flex-row gap-3 items-center justify-end w-full mt-3
            max-[600px]:flex-col-reverse max-[600px]:items-stretch">
                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 text-[#3E3025] text-[14px] cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60
                    p-2 px-4 rounded-[5px] font-[600]"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#3E3025] text-white text-[14px] cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60
                    disabled:opacity-50 disabled:cursor-not-allowed
                    p-2 px-4 rounded-[5px] font-[600]"
                >
                    {loading ? (
                        <><i className="fa-solid fa-spinner fa-spin"></i> {loadingLabel}</>
                    ) : (
                        <><i className={submitIcon}></i> {submitLabel}</>
                    )}
                </button>
            </div>

            {showPicker && (
                <QuestionPickerPop
                    alreadyAdded={form.questions.map((q) => q.question)}
                    onConfirm={addQuestions}
                    onClose={() => setShowPicker(false)}
                />
            )}
        </form>
    );
};

export default memo(QuizForm);