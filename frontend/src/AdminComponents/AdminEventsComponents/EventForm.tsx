import { memo, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { EventFormState } from "./eventFormUtils";
import type { FilterOptionsType } from "../../Types/Types";


interface EventFormProps {
    form: EventFormState;
    setForm: Dispatch<SetStateAction<EventFormState>>;
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

const cardClass = `flex flex-col w-full bg-[#F8F5EF] rounded-lg shadow-lg p-5 gap-4
max-[620px]:p-3`;

const labelClass = "text-[14px] font-[600] text-[#3E3025]";


const EventForm = ({
    form,
    setForm,
    eraOptions,
    loading,
    submitLabel,
    loadingLabel,
    submitIcon,
    onSubmit,
    onCancel
}: EventFormProps) => {

    const [tagInput, setTagInput] = useState<string>("");

    // ---------- Tags ----------

    const addTag = () => {
        const tag = tagInput.trim();
        setTagInput("");

        if (tag === "") return;

        setForm((prev) => {
            const exists = prev.tags.some((t) => t.toLowerCase() === tag.toLowerCase());
            return exists ? prev : { ...prev, tags: [...prev.tags, tag] };
        });
    };

    const removeTag = (index: number) => {
        setForm((prev) => ({
            ...prev,
            tags: prev.tags.filter((_, i) => i !== index)
        }));
    };

    const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault(); // Enter ne doit pas soumettre le formulaire
            addTag();
        }
    };

    // ---------- Sections ----------

    const addSection = () => {
        setForm((prev) => ({
            ...prev,
            sections: [...prev.sections, { title: "", content: "" }]
        }));
    };

    const updateSection = (index: number, field: "title" | "content", value: string) => {
        setForm((prev) => ({
            ...prev,
            sections: prev.sections.map((s, i) =>
                i === index ? { ...s, [field]: value } : s
            )
        }));
    };

    const removeSection = (index: number) => {
        setForm((prev) => ({
            ...prev,
            sections: prev.sections.filter((_, i) => i !== index)
        }));
    };

    return (
        <form onSubmit={onSubmit} className="flex flex-col w-full items-center gap-5">

            {/* ================= GENERAL INFORMATION ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">General information</h2>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Name</label>
                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. Battle of Marathon"
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-row gap-4 max-[620px]:flex-col">
                    <div className="flex flex-col gap-1 w-full">
                        <label className={labelClass}>Start date</label>
                        <input
                            type="text"
                            value={form.startDate}
                            onChange={(e) => setForm((prev) => ({ ...prev, startDate: e.target.value }))}
                            placeholder="e.g. 490 BC"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className={labelClass}>End date</label>
                        <input
                            type="text"
                            value={form.endDate}
                            onChange={(e) => setForm((prev) => ({ ...prev, endDate: e.target.value }))}
                            placeholder="e.g. 490 BC"
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="flex flex-row gap-4 max-[620px]:flex-col">
                    <div className="flex flex-col gap-1 w-full">
                        <label className={labelClass}>Location</label>
                        <input
                            type="text"
                            value={form.location}
                            onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g. Marathon, Greece"
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col gap-1 w-full">
                        <label className={labelClass}>Era</label>
                        <select
                            value={form.era}
                            onChange={(e) => setForm((prev) => ({ ...prev, era: e.target.value }))}
                            className={`${inputClass} cursor-pointer`}
                        >
                            <option value="">Select an era</option>
                            {eraOptions.map((era) => (
                                <option key={era._id} value={era._id}>
                                    {era.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Description</label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="A short summary of this event (optional)"
                        className={`${inputClass} resize-y`}
                    />
                </div>
            </div>

            {/* ================= TAGS ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">Tags ({form.tags.length})</h2>

                <div className="flex flex-row gap-2 max-[620px]:flex-col">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        onBlur={addTag}
                        placeholder="Type a tag then press Enter"
                        className={inputClass}
                    />

                    <button
                        type="button"
                        onClick={addTag}
                        className="bg-green-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        whitespace-nowrap"
                    >
                        <i className="fa-solid fa-plus"></i> Add tag
                    </button>
                </div>

                {form.tags.length === 0 ? (
                    <p className="text-[14px] text-gray-600">No tags yet. Tags are optional.</p>
                ) : (
                    <div className="flex flex-row flex-wrap gap-2">
                        {form.tags.map((tag, index) => (
                            <span
                                key={tag}
                                className="flex flex-row items-center gap-2 bg-white border border-gray-200
                                text-[13px] font-[600] text-[#3E3025] px-3 py-1 rounded-full"
                            >
                                {tag}
                                <i
                                    onClick={() => removeTag(index)}
                                    className="fa-solid fa-xmark cursor-pointer opacity-60 hover:opacity-100"
                                ></i>
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= SECTIONS ================= */}
            <div className={cardClass}>
                <div className="flex flex-row justify-between items-center gap-3">
                    <h2 className="text-[18px] font-bold text-[#3E3025]">
                        Sections ({form.sections.length})
                    </h2>

                    <span></span>
                </div>

                {form.sections.length === 0 && (
                    <p className="text-[14px] text-gray-600">
                        No sections yet. Sections are optional.
                    </p>
                )}

                {form.sections.map((section, index) => (
                    <div
                        key={index}
                        className="flex flex-col gap-2 bg-white rounded-lg p-3 border border-gray-200"
                    >
                        <div className="flex flex-row justify-between items-center gap-2">
                            <span className="text-[13px] font-[600] text-gray-600">
                                Section {index + 1}
                            </span>

                            <button
                                type="button"
                                onClick={() => removeSection(index)}
                                className="bg-red-900 text-white text-[12px] font-[600] p-1 px-2 rounded-lg
                                cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
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
                            rows={5}
                            value={section.content}
                            onChange={(e) => updateSection(index, "content", e.target.value)}
                            placeholder="Section content"
                            className={`${inputClass} resize-y`}
                        />
                    </div>
                ))}

                <div className="flex flex-row justify-between items-center gap-3">
                    <span></span>

                    <button
                        type="button"
                        onClick={addSection}
                        className="bg-green-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                    >
                        <i className="fa-solid fa-plus"></i> Add section
                    </button>
                </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex flex-row gap-3 items-center justify-end w-full mt-3
            max-[600px]:flex-col max-[600px]:items-stretch">
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
        </form>
    );
};

export default memo(EventForm);