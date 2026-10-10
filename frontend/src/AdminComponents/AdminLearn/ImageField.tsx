import { memo, useEffect, useState } from "react";
import { ALLOWED_TYPES, btnBase, cardClass } from "./learnFormUtils";

interface ImageFieldProps {
    image: File | null;
    setImage: (file: File | null) => void;
    currentImageUrl?: string;
    alt?: string;
}

const ImageField = ({ image, setImage, currentImageUrl, alt = "Preview" }: ImageFieldProps) => {

    const [preview, setPreview] = useState<string | null>(null);
    const [imageError, setImageError] = useState<string>("");
    const [isDragging, setIsDragging] = useState<boolean>(false);

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

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
    };

    const displayedImage = preview || currentImageUrl;

    return (
        <div className={cardClass}>
            <h2 className="text-[18px] font-bold text-[#3E3025]">Image</h2>

            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={handleDragLeave}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    selectFile(e.dataTransfer.files?.[0]);
                }}
                className={`rounded-lg transition-all duration-200
                ${isDragging ? "ring-2 ring-[#3E3025] ring-offset-2 opacity-80" : ""}`}
            >
                {displayedImage ? (
                    <img
                        src={displayedImage}
                        alt={alt}
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
                <label className={`${btnBase} bg-[#3E3025] text-white text-center`}>
                    <i className="fa-solid fa-image"></i>{" "}
                    {displayedImage ? "Change image" : "Choose image"}
                    <input
                        type="file"
                        accept={ALLOWED_TYPES.join(",")}
                        onChange={(e) => {
                            selectFile(e.target.files?.[0]);
                            e.target.value = "";
                        }}
                        className="hidden"
                    />
                </label>

                {image && (
                    <button
                        type="button"
                        onClick={() => setImage(null)}
                        className={`${btnBase} bg-gray-200 text-[#3E3025]`}
                    >
                        Cancel new image
                    </button>
                )}

                {image && <span className="text-[13px] text-gray-600 break-all">{image.name}</span>}
            </div>

            {imageError && <p className="text-[13px] text-red-800">{imageError}</p>}
        </div>
    );
};

export default memo(ImageField);
