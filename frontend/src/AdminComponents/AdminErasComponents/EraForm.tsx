import { memo, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { EraFormState, EraSuffix } from "./eraFormUtils";


interface EraFormProps {
    form: EraFormState;
    setForm: Dispatch<SetStateAction<EraFormState>>;
    image: File | null;
    setImage: (file: File | null) => void;
    currentImageUrl?: string;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    submitIcon: string;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif"];

const inputClass = `w-full p-2 rounded-[5px] border border-gray-300 bg-white
text-[14px] text-gray-900 outline-none transition-colors duration-200
focus:border-[#3E3025]`;

const cardClass = `flex flex-col w-full bg-[#F8F5EF] rounded-lg shadow-lg p-5 gap-4
max-[620px]:p-3`;

const labelClass = "text-[14px] font-[600] text-[#3E3025]";


// ============================================================
// YEAR FIELD
// ============================================================

interface YearFieldProps {
    label: string;
    year: string;
    suffix: EraSuffix;
    onYearChange: (value: string) => void;
    onSuffixChange: (suffix: EraSuffix) => void;
}

const YearField = ({ label, year, suffix, onYearChange, onSuffixChange }: YearFieldProps) => (
    <div className="flex flex-col gap-1 w-full">
        <label className={labelClass}>{label}</label>
        <div className="flex flex-row gap-2">
            <input
                type="number"
                min={1}
                step={1}
                inputMode="numeric"
                value={year}
                onChange={(e) => onYearChange(e.target.value)}
                placeholder="e.g. 500"
                className={inputClass}
            />
            <select
                value={suffix}
                onChange={(e) => onSuffixChange(e.target.value as EraSuffix)}
                className={`${inputClass} w-[90px] cursor-pointer`}
            >
                <option value="BC">BC</option>
                <option value="AC">AC</option>
            </select>
        </div>
    </div>
);


// ============================================================
// MAIN FORM
// ============================================================

const EraForm = ({
    form,
    setForm,
    image,
    setImage,
    currentImageUrl,
    loading,
    submitLabel,
    loadingLabel,
    submitIcon,
    onSubmit,
    onCancel
}: EraFormProps) => {

    const [preview, setPreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string>("");

    // Preview de la nouvelle image (libérée au changement / démontage)
    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(image);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);

    const [isDragging, setIsDragging] = useState<boolean>(false);

    // Validation partagée entre le input file et le drop
    const selectFile = (file?: File) => {
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            setImageError("Only JPEG, PNG, AVIF and WEBP images are allowed.");
            return;
        }

        setImageError("");
        setImage(file);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        selectFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // obligatoire pour autoriser le drop
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        // Ignore les dragleave déclenchés en passant sur un enfant (évite le clignotement)
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        selectFile(e.dataTransfer.files?.[0]);
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

    const displayedImage = preview || currentImageUrl;

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
                        placeholder="e.g. Classical Greece"
                        className={inputClass}
                    />
                </div>

                <div className="flex flex-row gap-4 max-[620px]:flex-col">
                    <YearField
                        label="Start year"
                        year={form.startYear}
                        suffix={form.startSuffix}
                        onYearChange={(v) => setForm((prev) => ({ ...prev, startYear: v }))}
                        onSuffixChange={(s) => setForm((prev) => ({ ...prev, startSuffix: s }))}
                    />
                    <YearField
                        label="End year"
                        year={form.endYear}
                        suffix={form.endSuffix}
                        onYearChange={(v) => setForm((prev) => ({ ...prev, endYear: v }))}
                        onSuffixChange={(s) => setForm((prev) => ({ ...prev, endSuffix: s }))}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className={labelClass}>Description</label>
                    <textarea
                        rows={4}
                        value={form.description}
                        onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                        placeholder="A short summary of this era"
                        className={`${inputClass} resize-y`}
                    />
                </div>
            </div>

            {/* ================= IMAGE ================= */}
            <div className={cardClass}>
                <h2 className="text-[18px] font-bold text-[#3E3025]">Image</h2>

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`rounded-lg transition-all duration-200
                    ${isDragging ? "ring-2 ring-[#3E3025] ring-offset-2 opacity-80" : ""}`}
                >
                    {displayedImage ? (
                        <img
                            src={displayedImage}
                            alt="Era preview"
                            className="w-full max-h-[320px] object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex items-center justify-center text-center px-3 w-full h-[160px] rounded-lg
                        border-2 border-dashed border-gray-300 text-[14px] text-gray-500">
                            {isDragging ? "Drop the image here" : "Drag & drop an image here, or use the button below"}
                        </div>
                    )}
                </div>

                <div className="flex flex-row items-center gap-3 max-[620px]:flex-col max-[620px]:items-stretch">
                    <label
                        className="bg-[#3E3025] text-white text-[13px] font-[600] p-2 px-4 rounded-lg
                        text-center cursor-pointer transition-opacity duration-200
                        hover:opacity-80 active:opacity-60"
                    >
                        <i className="fa-solid fa-image"></i>{" "}
                        {displayedImage ? "Change image" : "Choose image"}
                        <input
                            type="file"
                            accept={ALLOWED_TYPES.join(",")}
                            onChange={handleImageChange}
                            className="hidden"
                        />
                    </label>

                    {image && (
                        <button
                            type="button"
                            onClick={() => setImage(null)}
                            className="bg-gray-200 text-[#3E3025] text-[13px] font-[600] p-2 px-4 rounded-lg
                            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                        >
                            Cancel new image
                        </button>
                    )}

                    {image && (
                        <span className="text-[13px] text-gray-600 break-all">{image.name}</span>
                    )}
                </div>

                {imageError && <p className="text-[13px] text-red-800">{imageError}</p>}
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

export default memo(EraForm);