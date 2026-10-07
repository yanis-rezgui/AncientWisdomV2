
import { memo, useEffect, useState } from "react";
import type { Dispatch, SetStateAction } from "react";

import { useEraContext } from "../../Contexts/EraContext";
import type { FigureFormState } from "./figureformUtils";


interface FigureFormProps {
    form: FigureFormState;
    setForm: Dispatch<SetStateAction<FigureFormState>>;
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

const ALLOWED_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/jpg",
    "image/avif"
];

const inputClass = `w-full p-2 rounded-[5px] border border-gray-300 bg-white
text-[14px] text-gray-900 outline-none transition-colors duration-200
focus:border-[#3E3025]`;

const cardClass = `flex flex-col w-full bg-[#F8F5EF] rounded-lg shadow-lg p-5 gap-4
max-[620px]:p-3`;

const labelClass = "text-[14px] font-[600] text-[#3E3025]";


// ============================================================
// MAIN FORM
// ============================================================

const FigureForm = ({
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
}: FigureFormProps) => {

    const { erasOptions } = useEraContext();

    const [preview, setPreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string>("");
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [tagInput, setTagInput] = useState<string>("");

    // ========================================================
    // IMAGE PREVIEW
    // ========================================================

    useEffect(() => {
        if (!image) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(image);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [image]);


    // ========================================================
    // IMAGE HANDLING
    // ========================================================

    const selectFile = (file?: File) => {
        if (!file) return;

        if (!ALLOWED_TYPES.includes(file.type)) {
            setImageError(
                "Only JPEG, PNG, AVIF and WEBP images are allowed."
            );
            return;
        }

        setImageError("");
        setImage(file);
    };

    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        selectFile(e.target.files?.[0]);
        e.target.value = "";
    };

    const handleDragOver = (
        e: React.DragEvent<HTMLDivElement>
    ) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (
        e: React.DragEvent<HTMLDivElement>
    ) => {
        if (
            e.currentTarget.contains(
                e.relatedTarget as Node
            )
        ) {
            return;
        }

        setIsDragging(false);
    };

    const handleDrop = (
        e: React.DragEvent<HTMLDivElement>
    ) => {
        e.preventDefault();
        setIsDragging(false);

        selectFile(e.dataTransfer.files?.[0]);
    };


    // ========================================================
    // BIOGRAPHY SECTIONS
    // ========================================================

    const addSection = () => {
        setForm((prev) => ({
            ...prev,
            biography: [
                ...prev.biography,
                {
                    title: "",
                    content: ""
                }
            ]
        }));
    };

    const updateSection = (
        index: number,
        field: "title" | "content",
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            biography: prev.biography.map((section, i) =>
                i === index
                    ? {
                        ...section,
                        [field]: value
                    }
                    : section
            )
        }));
    };

    const removeSection = (index: number) => {
        setForm((prev) => ({
            ...prev,
            biography: prev.biography.filter(
                (_, i) => i !== index
            )
        }));
    };


    // ========================================================
    // ERA HANDLING
    // ========================================================

    const toggleEra = (eraId: string) => {
        setForm((prev) => {
            const alreadySelected = prev.eras.includes(eraId);

            return {
                ...prev,
                eras: alreadySelected
                    ? prev.eras.filter((id) => id !== eraId)
                    : [...prev.eras, eraId]
            };
        });
    };


    const displayedImage = preview || currentImageUrl;

    const addTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;

    // Évite les doublons et ajoute le nouveau tag
    if (!form.tags.includes(trimmed)) {
        setForm((prev) => ({
            ...prev,
            tags: [...prev.tags, trimmed]
        }));
    }
    setTagInput("");
};

const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        e.preventDefault(); // EMPÊCHE LA SOUMISSION DU FORMULAIRE
        addTag();
    }
};

const removeTag = (tagToRemove: string) => {
    setForm((prev) => ({
        ...prev,
        tags: prev.tags.filter((tag) => tag !== tagToRemove)
    }));
};


    return (
        <form
            onSubmit={onSubmit}
            className="flex flex-col w-full items-center gap-5"
        >

            {/* ==================================================
                GENERAL INFORMATION
            ================================================== */}

            <div className={cardClass}>

                <h2 className="text-[18px] font-bold text-[#3E3025]">
                    General information
                </h2>


                {/* NAME */}

                <div className="flex flex-col gap-1">

                    <label className={labelClass}>
                        Name
                    </label>

                    <input
                        type="text"
                        value={form.name}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                name: e.target.value
                            }))
                        }
                        placeholder="e.g. Socrates"
                        className={inputClass}
                    />

                </div>


                {/* BIRTH / DEATH DATES */}

                <div className="flex flex-row gap-4 max-[620px]:flex-col">

                    <div className="flex flex-col gap-1 w-full">

                        <label className={labelClass}>
                            Birth date
                        </label>

                        <input
                            type="text"
                            value={form.birthDate}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    birthDate: e.target.value
                                }))
                            }
                            placeholder="e.g. c. 470 BC"
                            className={inputClass}
                        />

                    </div>


                    <div className="flex flex-col gap-1 w-full">

                        <label className={labelClass}>
                            Death date
                        </label>

                        <input
                            type="text"
                            value={form.deathDate}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    deathDate: e.target.value
                                }))
                            }
                            placeholder="e.g. 399 BC"
                            className={inputClass}
                        />

                    </div>

                </div>


                {/* BIRTH / DEATH PLACES */}

                <div className="flex flex-row gap-4 max-[620px]:flex-col">

                    <div className="flex flex-col gap-1 w-full">

                        <label className={labelClass}>
                            Birth place
                        </label>

                        <input
                            type="text"
                            value={form.birthPlace}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    birthPlace: e.target.value
                                }))
                            }
                            placeholder="e.g. Athens, Greece"
                            className={inputClass}
                        />

                    </div>


                    <div className="flex flex-col gap-1 w-full">

                        <label className={labelClass}>
                            Death place
                        </label>

                        <input
                            type="text"
                            value={form.deathPlace}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    deathPlace: e.target.value
                                }))
                            }
                            placeholder="e.g. Athens, Greece"
                            className={inputClass}
                        />

                    </div>

                </div>

            </div>


            {/* ==================================================
                ERAS
            ================================================== */}

            <div className={cardClass}>

                <h2 className="text-[18px] font-bold text-[#3E3025]">
                    Historical eras
                </h2>

                <p className="text-[13px] text-gray-600">
                    Select one or more eras associated with this figure.
                </p>


                {erasOptions.length === 0 ? (

                    <p className="text-[14px] text-gray-500">
                        No eras available.
                    </p>

                ) : (

                    <div className="flex flex-col gap-2">

                        {erasOptions.map((era) => {

                            const isSelected =
                                form.eras.includes(era._id);

                            return (
                                <label
                                    key={era._id}
                                    className={`flex flex-row items-center gap-3
                                    p-3 rounded-lg border cursor-pointer
                                    transition-colors duration-200
                                    ${
                                        isSelected
                                            ? "border-[#3E3025] bg-[#E8E2D6]"
                                            : "border-gray-200 bg-white"
                                    }`}
                                >

                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() =>
                                            toggleEra(era._id)
                                        }
                                        className="w-4 h-4 accent-[#3E3025]"
                                    />

                                    <span className="text-[14px] text-[#3E3025]">
                                        {era.name}
                                    </span>

                                </label>
                            );
                        })}

                    </div>

                )}


                {form.eras.length === 0 && (
                    <p className="text-[13px] text-red-800">
                        At least one era must be selected.
                    </p>
                )}

            </div>


            {/* ==================================================
    TAGS
================================================== */}

<div className={cardClass}>

    <h2 className="text-[18px] font-bold text-[#3E3025]">
        Tags
    </h2>

    <div className="flex flex-col gap-2">

        <label className={labelClass}>
            Add Tags
        </label>

        {/* Input + Bouton Ajouter */}
        <div className="flex flex-row gap-2">

            <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter or Add"
                className={inputClass}
            />

            <button
                type="button"
                onClick={addTag}
                className="bg-[#3E3025] text-white text-[13px] font-[600] px-4 rounded-[5px]
                cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 whitespace-nowrap"
            >
                <i className="fa-solid fa-plus"></i> Add
            </button>

        </div>

        {/* Liste des Badges / Chips */}
        <div className="flex flex-wrap gap-2 mt-2">

            {form.tags.map((tag) => (

                <span
                    key={tag}
                    className="flex items-center gap-2 bg-[#E8E2D6] text-[#3E3025]
                    text-[13px] font-[500] px-3 py-1 rounded-full border border-[#3E3025]/20"
                >
                    #{tag}

                    <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-[#3E3025] hover:text-red-700 font-bold ml-1 cursor-pointer"
                    >
                        &times;
                    </button>

                </span>

            ))}

        </div>

    </div>

</div>


            {/* ==================================================
                IMAGE
            ================================================== */}

            <div className={cardClass}>

                <h2 className="text-[18px] font-bold text-[#3E3025]">
                    Image
                </h2>

                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`rounded-lg transition-all duration-200
                    ${
                        isDragging
                            ? "ring-2 ring-[#3E3025] ring-offset-2 opacity-80"
                            : ""
                    }`}
                >

                    {displayedImage ? (

                        <img
                            src={displayedImage}
                            alt="Figure preview"
                            className="w-full max-h-[320px] object-cover rounded-lg"
                        />

                    ) : (

                        <div
                            className="flex items-center justify-center text-center px-3
                            w-full h-[160px] rounded-lg border-2 border-dashed
                            border-gray-300 text-[14px] text-gray-500"
                        >
                            {isDragging
                                ? "Drop the image here"
                                : "Drag & drop an image here, or use the button below"}
                        </div>

                    )}

                </div>


                <div
                    className="flex flex-row items-center gap-3
                    max-[620px]:flex-col max-[620px]:items-stretch"
                >

                    <label
                        className="bg-[#3E3025] text-white text-[13px]
                        font-[600] p-2 px-4 rounded-lg text-center
                        cursor-pointer transition-opacity duration-200
                        hover:opacity-80 active:opacity-60"
                    >

                        <i className="fa-solid fa-image"></i>{" "}

                        {displayedImage
                            ? "Change image"
                            : "Choose image"}

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
                            className="bg-gray-200 text-[#3E3025]
                            text-[13px] font-[600] p-2 px-4 rounded-lg
                            cursor-pointer transition-opacity duration-200
                            hover:opacity-80 active:opacity-60"
                        >
                            Cancel new image
                        </button>

                    )}


                    {image && (

                        <span className="text-[13px] text-gray-600 break-all">
                            {image.name}
                        </span>

                    )}

                </div>


                {imageError && (
                    <p className="text-[13px] text-red-800">
                        {imageError}
                    </p>
                )}

            </div>


            {/* ==================================================
                BIOGRAPHY
            ================================================== */}

            <div className={cardClass}>

                <div className="flex flex-row justify-between items-center gap-3">

                    <h2 className="text-[18px] font-bold text-[#3E3025]">
                        Biography ({form.biography.length})
                    </h2>

                </div>


                {form.biography.length === 0 && (

                    <p className="text-[14px] text-gray-600">
                        No biography sections yet. Sections are optional.
                    </p>

                )}


                {form.biography.map((section, index) => (

                    <div
                        key={index}
                        className="flex flex-col gap-2 bg-white rounded-lg
                        p-3 border border-gray-200"
                    >

                        <div
                            className="flex flex-row justify-between
                            items-center gap-2"
                        >

                            <span className="text-[13px] font-[600] text-gray-600">
                                Section {index + 1}
                            </span>


                            <button
                                type="button"
                                onClick={() => removeSection(index)}
                                className="bg-red-900 text-white text-[12px]
                                font-[600] p-1 px-2 rounded-lg
                                cursor-pointer transition-opacity duration-200
                                hover:opacity-80 active:opacity-60"
                            >
                                <i className="fa-solid fa-trash"></i>{" "}
                                Remove
                            </button>

                        </div>


                        <input
                            type="text"
                            value={section.title}
                            onChange={(e) =>
                                updateSection(
                                    index,
                                    "title",
                                    e.target.value
                                )
                            }
                            placeholder="Section title"
                            className={inputClass}
                        />


                        <textarea
                            rows={5}
                            value={section.content}
                            onChange={(e) =>
                                updateSection(
                                    index,
                                    "content",
                                    e.target.value
                                )
                            }
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
                        className="bg-green-900 text-white text-[13px]
                        font-[600] p-2 px-3 rounded-lg cursor-pointer
                        transition-opacity duration-200
                        hover:opacity-80 active:opacity-60"
                    >
                        <i className="fa-solid fa-plus"></i>{" "}
                        Add section
                    </button>

                </div>

            </div>


            {/* ==================================================
                ACTIONS
            ================================================== */}

            <div
                className="flex flex-row gap-3 items-center justify-end
                w-full mt-3 max-[600px]:flex-col max-[600px]:items-stretch"
            >

                <button
                    type="button"
                    onClick={onCancel}
                    className="bg-gray-200 text-[#3E3025] text-[14px]
                    cursor-pointer transition-opacity duration-200
                    hover:opacity-80 active:opacity-60
                    p-2 px-4 rounded-[5px] font-[600]"
                >
                    Cancel
                </button>


                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#3E3025] text-white text-[14px]
                    cursor-pointer transition-opacity duration-200
                    hover:opacity-80 active:opacity-60
                    disabled:opacity-50 disabled:cursor-not-allowed
                    p-2 px-4 rounded-[5px] font-[600]"
                >

                    {loading ? (

                        <>
                            <i className="fa-solid fa-spinner fa-spin"></i>{" "}
                            {loadingLabel}
                        </>

                    ) : (

                        <>
                            <i className={submitIcon}></i>{" "}
                            {submitLabel}
                        </>

                    )}

                </button>

            </div>

        </form>
    );
};

export default memo(FigureForm);
