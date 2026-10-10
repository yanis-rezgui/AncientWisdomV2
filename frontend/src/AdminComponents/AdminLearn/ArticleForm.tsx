import { memo, useState, type Dispatch, type FormEvent, type KeyboardEvent, type SetStateAction } from "react";
import EraSelect from "./EraSelect";
import ImageField from "./ImageField";
import { Field, FormActions } from "./FormParts";
import { btnBase, cardClass, inputClass, type ArticleFormState } from "./learnFormUtils";

interface ArticleFormProps {
    form: ArticleFormState;
    setForm: Dispatch<SetStateAction<ArticleFormState>>;
    image: File | null;
    setImage: (file: File | null) => void;
    currentImageUrl?: string;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    submitIcon: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

const ArticleForm = ({
    form, setForm, image, setImage, currentImageUrl,
    loading, submitLabel, loadingLabel, submitIcon, onSubmit, onCancel
}: ArticleFormProps) => {

    const [tagInput, setTagInput] = useState<string>("");

    // ---------- Tags ----------

    const addTag = () => {
        const tag = tagInput.trim().toLowerCase();
        setTagInput("");

        if (tag === "" || form.tags.includes(tag)) return;

        setForm((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    };

    const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault(); // Entrée ne doit pas soumettre le formulaire
            addTag();
        }
    };

    const removeTag = (tag: string) => {
        setForm((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
    };

    // ---------- Sections ----------

    const addSection = () => {
        setForm((prev) => ({ ...prev, sections: [...prev.sections, { title: "", content: "" }] }));
    };

    const updateSection = (index: number, field: "title" | "content", value: string) => {
        setForm((prev) => ({
            ...prev,
            sections: prev.sections.map((s, i) => (i === index ? { ...s, [field]: value } : s)),
        }));
    };

    const removeSection = (index: number) => {
        setForm((prev) => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full items-center gap-5">

            {/* ================= GENERAL INFORMATION ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">General information</h2>

                <Field label="Title">
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. How the Roman Republic fell"
                        className={inputClass}
                    />
                </Field>

                <Field label="Era">
                    <EraSelect
                        value={form.era}
                        onChange={(era) => setForm((prev) => ({ ...prev, era }))}
                    />
                </Field>

                <Field label="Description">
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="A short summary of this article"
                        className={`${inputClass} resize-y`}
                    />
                </Field>
            </div>

            {/* ================= TAGS ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">Tags ({form.tags.length})</h2>

                <div className="flex flex-row gap-2">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="Type a tag then press Enter"
                        className={inputClass}
                    />
                    <button type="button" onClick={addTag} className={`${btnBase} bg-green-900 text-white shrink-0`}>
                        <i className="fa-solid fa-plus"></i> Add
                    </button>
                </div>

                {form.tags.length === 0 ? (
                    <p className="text-[14px] text-gray-600">No tags yet. Tags are optional.</p>
                ) : (
                    <div className="flex flex-row flex-wrap gap-2">
                        {form.tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex flex-row items-center gap-2 bg-white border border-gray-200
                                rounded-full px-3 py-1 text-[13px] text-[#3E3025]"
                            >
                                {tag}
                                <i
                                    onClick={() => removeTag(tag)}
                                    className="fa-solid fa-xmark cursor-pointer text-gray-500 hover:text-red-900"
                                ></i>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= IMAGE ================= */}
            <ImageField image={image} setImage={setImage} currentImageUrl={currentImageUrl} alt="Article cover" />

            {/* ================= SECTIONS ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">Sections ({form.sections.length})</h2>

                {form.sections.length === 0 && (
                    <p className="text-[14px] text-gray-600">No sections yet. Sections are optional.</p>
                )}

                {form.sections.map((section, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-2 bg-white rounded-lg p-3 border border-gray-200"
                    >
                        <div className="flex flex-row justify-between items-center gap-2">
                            <span className="text-[13px] font-[600] text-gray-600">Section {index + 1}</span>

                            <button
                                type="button"
                                onClick={() => removeSection(index)}
                                className={`${btnBase} bg-red-900 text-white text-[12px] p-1 px-2`}
                            >
                                <i className="fa-solid fa-trash"></i> Remove
                            </button>
                        </div>

                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSection(index, "title", e.target.value)}
                            placeholder="Section title"
                            className={inputClass}
                        />

                        <textarea
                            rows={6}
                            value={section.content}
                            onChange={(e) => updateSection(index, "content", e.target.value)}
                            placeholder="Section content"
                            className={`${inputClass} resize-y`}
                        />
                    </div>
                ))}

                <div className="flex flex-row justify-end">
                    <button type="button" onClick={addSection} className={`${btnBase} bg-green-900 text-white px-3`}>
                        <i className="fa-solid fa-plus"></i> Add section
                    </button>
                </div>
            </div>

            <FormActions
                loading={loading}
                submitLabel={submitLabel}
                loadingLabel={loadingLabel}
                submitIcon={submitIcon}
                onCancel={onCancel}
            />
        </form>
    );
};

export default memo(ArticleForm);
