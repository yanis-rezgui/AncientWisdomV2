import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Loader2 } from "lucide-react";

import type { GameDifficulty } from "../../Types/Games";
import type { ChallengeStatus } from "../../Types/GamesAdmin";
import {
    DIFFICULTY_OPTIONS,
    STATUS_OPTIONS,
    inputClass,
} from "./gameFormUtils";

/* =========================
   LAYOUT
========================= */

export const FormShell = ({
    onSubmit,
    children,
}: {
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    children: ReactNode;
}) => (
    <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full flex-col gap-5 rounded-2xl border border-[#E7E0D6] bg-white p-6 max-[600px]:p-4"
    >
        {children}
    </form>
);

export const Field = ({
    label,
    required,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: ReactNode;
}) => (
    <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-[#3E3025]">
            {label}
            {required && <span className="text-[#8B2E2E]"> *</span>}
        </span>
        {children}
        {hint && <span className="text-[12px] text-[#7A726A]">{hint}</span>}
    </label>
);

// Comme Field, mais pour plusieurs champs (pas de <label> englobant)
export const FieldGroup = ({
    label,
    required,
    hint,
    children,
}: {
    label: string;
    required?: boolean;
    hint?: string;
    children: ReactNode;
}) => (
    <div className="flex flex-col gap-2">
        <span className="text-[13px] font-semibold text-[#3E3025]">
            {label}
            {required && <span className="text-[#8B2E2E]"> *</span>}
        </span>
        {children}
        {hint && <span className="text-[12px] text-[#7A726A]">{hint}</span>}
    </div>
);

export const FormActions = ({
    loading,
    submitLabel,
    loadingLabel,
    onCancel,
}: {
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    onCancel: () => void;
}) => (
    <div className="flex flex-wrap justify-end gap-3 border-t border-[#E7E0D6] pt-5 max-[600px]:flex-col-reverse">
        <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-[#E7E0D6] px-5 py-2.5 text-[14px] font-medium text-[#3E3025] transition-colors hover:border-[#B89B72] disabled:opacity-60"
        >
            Cancel
        </button>

        <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3E3025] px-5 py-2.5 text-[14px] font-medium text-white transition-colors hover:bg-[#B89B72] disabled:opacity-60"
        >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? loadingLabel : submitLabel}
        </button>
    </div>
);

/* =========================
   DIFFICULTY + STATUS
========================= */

export const DifficultyStatusFields = ({
    difficulty,
    status,
    onDifficultyChange,
    onStatusChange,
}: {
    difficulty: GameDifficulty;
    status: ChallengeStatus;
    onDifficultyChange: (value: GameDifficulty) => void;
    onStatusChange: (value: ChallengeStatus) => void;
}) => (
    <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
        <Field label="Difficulty">
            <select
                value={difficulty}
                onChange={(e) =>
                    onDifficultyChange(e.target.value as GameDifficulty)
                }
                className={inputClass}
            >
                {DIFFICULTY_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </Field>

        <Field
            label="Status"
            hint="Only published challenges are playable."
        >
            <select
                value={status}
                onChange={(e) =>
                    onStatusChange(e.target.value as ChallengeStatus)
                }
                className={inputClass}
            >
                {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </Field>
    </div>
);

/* =========================
   IMAGE UPLOAD
========================= */

interface ImageUploadProps {
    label: string;
    file: File | null;
    currentUrl?: string;
    required?: boolean;
    hint?: string;
    onChange: (file: File | null) => void;
    // Pour les images facultatives déjà enregistrées (ex. figure)
    allowRemoveCurrent?: boolean;
    removeCurrent?: boolean;
    onRemoveCurrentChange?: (value: boolean) => void;
}

export const ImageUpload = ({
    label,
    file,
    currentUrl,
    required,
    hint,
    onChange,
    allowRemoveCurrent,
    removeCurrent,
    onRemoveCurrentChange,
}: ImageUploadProps) => {
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!file) {
            setPreview(null);
            return;
        }

        const url = URL.createObjectURL(file);
        setPreview(url);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    const shownUrl = preview ?? (removeCurrent ? null : currentUrl || null);

    return (
        <FieldGroup label={label} required={required} hint={hint}>
            <div className="flex items-center gap-4 max-[600px]:flex-col max-[600px]:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#E7E0D6] bg-[#F8F5EF] text-[11px] text-[#9A9289]">
                    {shownUrl ? (
                        <img
                            src={shownUrl}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        "No image"
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
                        className="text-[13px] text-[#3E3025] file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-[#3E3025] file:px-3 file:py-2 file:text-[13px] file:text-white hover:file:bg-[#B89B72]"
                    />

                    {allowRemoveCurrent && currentUrl && !file && (
                        <label className="flex items-center gap-2 text-[13px] text-[#3E3025]">
                            <input
                                type="checkbox"
                                checked={Boolean(removeCurrent)}
                                onChange={(e) =>
                                    onRemoveCurrentChange?.(e.target.checked)
                                }
                            />
                            Remove the current image
                        </label>
                    )}
                </div>
            </div>
        </FieldGroup>
    );
};
