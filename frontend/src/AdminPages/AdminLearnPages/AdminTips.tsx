import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import type { UpdateTipsData } from "../../Types/LearnTypes";
import { useTipsContext } from "../../Contexts/TipsContext";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import { btnBase, cardClass, cleanTipsForm, emptyTip, inputClass, validateTipsForm } from "../../AdminComponents/AdminLearn/learnFormUtils";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import { Field } from "../../AdminComponents/AdminLearn/FormParts";


const emptyForm: UpdateTipsData = { introduction: "", tips: [], conclusion: "" };

// Les tips sont un document unique : pas de liste, pas d'ajout, pas de suppression
const AdminTips = () => {

    const navigate = useNavigate();
    const { tips, loading, updating, errorMsg, updateTips } = useTipsContext();

    const [form, setForm] = useState<UpdateTipsData>(emptyForm);
    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    const tipsToForm = (): UpdateTipsData =>
        tips
            ? {
                introduction: tips.introduction,
                conclusion: tips.conclusion,
                tips: tips.tips.map((t) => ({ ...t })),
            }
            : emptyForm;

    // Pré-remplit le formulaire quand les tips sont chargés / sauvegardés
    useEffect(() => {
        if (tips) setForm(tipsToForm());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tips]);

    // ---------- Tips ----------

    const addTip = () => setForm((prev) => ({ ...prev, tips: [...prev.tips, emptyTip()] }));

    const removeTip = (index: number) =>
        setForm((prev) => ({ ...prev, tips: prev.tips.filter((_, i) => i !== index) }));

    const updateTip = (index: number, field: "title" | "why" | "how", value: string) =>
        setForm((prev) => ({
            ...prev,
            tips: prev.tips.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
        }));

    const moveTip = (index: number, direction: -1 | 1) =>
        setForm((prev) => {
            const target = index + direction;
            if (target < 0 || target >= prev.tips.length) return prev;

            const next = [...prev.tips];
            [next[index], next[target]] = [next[target], next[index]];
            return { ...prev, tips: next };
        });

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateTipsForm(form);
        if (error) return showToast(error);

        const success = await updateTips(cleanTipsForm(form));

        if (success) showToast("Learning tips updated successfully.", "success");
    };

    return (
        <AdminLearnFormPage
            title="Learning tips"
            subtitle="Edit the introduction, the tips and the conclusion shown on the Learn page."
            backPath="/admin/learn"
            backLabel="Back to Learn"
            loading={loading && !tips}
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <form onSubmit={handleSubmit} className="flex flex-col w-full items-center gap-5">

                {/* ================= INTRODUCTION ================= */}
                <div className={cardClass}>
                    <h2 className="text-[18px] font-bold text-[#3E3025]">Introduction</h2>

                    <textarea
                        rows={4}
                        value={form.introduction}
                        onChange={(e) => setForm((prev) => ({ ...prev, introduction: e.target.value }))}
                        placeholder="Introduce the learning tips"
                        className={`${inputClass} resize-y`}
                    />
                </div>

                {/* ================= TIPS ================= */}
                <div className={cardClass}>
                    <h2 className="text-[18px] font-bold text-[#3E3025]">Tips ({form.tips.length})</h2>

                    {form.tips.length === 0 && (
                        <p className="text-[14px] text-gray-600">No tips yet. Add at least one tip.</p>
                    )}

                    {form.tips.map((tip, index) => (
                        <div
                            key={tip._id ?? index}
                            className="flex flex-col gap-2 bg-white rounded-lg p-3 border border-gray-200"
                        >
                            <div className="flex flex-row justify-between items-center gap-2">
                                <span className="text-[13px] font-[600] text-gray-600">Tip {index + 1}</span>

                                <div className="flex flex-row gap-2">
                                    <button
                                        type="button"
                                        onClick={() => moveTip(index, -1)}
                                        disabled={index === 0}
                                        aria-label="Move tip up"
                                        className={`${btnBase} bg-gray-200 text-[#3E3025] text-[12px] p-1 px-2`}
                                    >
                                        <i className="fa-solid fa-arrow-up"></i>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => moveTip(index, 1)}
                                        disabled={index === form.tips.length - 1}
                                        aria-label="Move tip down"
                                        className={`${btnBase} bg-gray-200 text-[#3E3025] text-[12px] p-1 px-2`}
                                    >
                                        <i className="fa-solid fa-arrow-down"></i>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => removeTip(index)}
                                        className={`${btnBase} bg-red-900 text-white text-[12px] p-1 px-2`}
                                    >
                                        <i className="fa-solid fa-trash"></i> Remove
                                    </button>
                                </div>
                            </div>

                            <Field label="Title">
                                <input
                                    type="text"
                                    value={tip.title}
                                    onChange={(e) => updateTip(index, "title", e.target.value)}
                                    placeholder="e.g. Read primary sources"
                                    className={inputClass}
                                />
                            </Field>

                            <Field label="Why">
                                <textarea
                                    rows={3}
                                    value={tip.why}
                                    onChange={(e) => updateTip(index, "why", e.target.value)}
                                    placeholder="Why does this tip matter?"
                                    className={`${inputClass} resize-y`}
                                />
                            </Field>

                            <Field label="How">
                                <textarea
                                    rows={3}
                                    value={tip.how}
                                    onChange={(e) => updateTip(index, "how", e.target.value)}
                                    placeholder="How can the learner apply it?"
                                    className={`${inputClass} resize-y`}
                                />
                            </Field>
                        </div>
                    ))}

                    <div className="flex flex-row justify-end">
                        <button type="button" onClick={addTip} className={`${btnBase} bg-green-900 text-white px-3`}>
                            <i className="fa-solid fa-plus"></i> Add tip
                        </button>
                    </div>
                </div>

                {/* ================= CONCLUSION ================= */}
                <div className={cardClass}>
                    <h2 className="text-[18px] font-bold text-[#3E3025]">Conclusion</h2>

                    <textarea
                        rows={4}
                        value={form.conclusion}
                        onChange={(e) => setForm((prev) => ({ ...prev, conclusion: e.target.value }))}
                        placeholder="Wrap up the learning tips"
                        className={`${inputClass} resize-y`}
                    />
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="flex flex-row gap-3 items-center justify-end w-full mt-3
                max-[600px]:flex-col max-[600px]:items-stretch">
                    <button
                        type="button"
                        onClick={() => setForm(tipsToForm())}
                        disabled={updating}
                        className={`${btnBase} bg-gray-200 text-[#3E3025] text-[14px] rounded-[5px]`}
                    >
                        <i className="fa-solid fa-rotate-left"></i> Reset
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/admin/learn")}
                        className={`${btnBase} bg-gray-200 text-[#3E3025] text-[14px] rounded-[5px]`}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={updating}
                        className={`${btnBase} bg-[#3E3025] text-white text-[14px] rounded-[5px]`}
                    >
                        {updating ? (
                            <><i className="fa-solid fa-spinner fa-spin"></i> Saving...</>
                        ) : (
                            <><i className="fa-solid fa-floppy-disk"></i> Save changes</>
                        )}
                    </button>
                </div>
            </form>
        </AdminLearnFormPage>
    );
};

export default memo(AdminTips);
