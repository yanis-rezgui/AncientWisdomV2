import { memo, type ReactNode } from "react";
import type { HelpArticleType } from "../../Types/HelpTypes";

// ============================================================
// Constants & helpers
// ============================================================

export const ARTICLE_TYPES: { value: HelpArticleType; label: string }[] = [
    { value: "guide", label: "Guide" },
    { value: "faq", label: "FAQ" },
    { value: "troubleshooting", label: "Troubleshooting" },
];

export const typeLabel = (type: HelpArticleType) =>
    ARTICLE_TYPES.find((t) => t.value === type)?.label ?? type;

export const slugify = (value: string) =>
    value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

export const formatDate = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "short",
              year: "numeric",
          })
        : "—";

// ============================================================
// Shared classes
// ============================================================

export const labelClass = "text-[14px] font-semibold text-[#3E3025]";

export const inputClass =
    "w-full rounded-[5px] border border-[#3E3025]/20 bg-white px-3 py-2 text-[14px] text-[#3E3025] " +
    "placeholder:text-[#3E3025]/40 transition-colors duration-200 " +
    "focus:border-[#8C6A43] focus:outline-none focus:ring-2 focus:ring-[#8C6A43]/25";

export const btnPrimary =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#3E3025] px-4 py-2 " +
    "text-[14px] font-semibold text-white transition-opacity duration-200 " +
    "hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50";

export const btnSecondary =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[5px] border border-[#3E3025]/20 " +
    "bg-white px-3 py-1.5 text-[13px] font-semibold text-[#3E3025] transition-opacity duration-200 " +
    "hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50";

export const btnDanger =
    "inline-flex cursor-pointer items-center justify-center gap-2 rounded-[5px] border border-[#8B2E2E]/30 " +
    "bg-white px-3 py-1.5 text-[13px] font-semibold text-[#8B2E2E] transition-opacity duration-200 " +
    "hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50";

export const cardClass = "rounded-lg border border-[#3E3025]/10 bg-white";

// ============================================================
// Small components
// ============================================================

export const Field = ({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string;
    htmlFor?: string;
    hint?: string;
    children: ReactNode;
}) => (
    <div className="flex flex-col gap-1.5">
        <label htmlFor={htmlFor} className={labelClass}>
            {label}
        </label>
        {children}
        {hint && <p className="text-[12px] text-[#3E3025]/55">{hint}</p>}
    </div>
);

export const StatusBadge = memo(({ published }: { published: boolean }) => (
    <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[12px] font-medium ${
            published
                ? "bg-green-50 text-green-800"
                : "bg-[#3E3025]/10 text-[#3E3025]/65"
        }`}
    >
        <span
            className={`h-1.5 w-1.5 rounded-full ${
                published ? "bg-green-500" : "bg-[#3E3025]/40"
            }`}
        />
        {published ? "Published" : "Draft"}
    </span>
));

export const Tag = ({ children }: { children: ReactNode }) => (
    <span className="rounded-full bg-[#F0E6D8] px-2.5 py-0.5 text-[12px] font-medium text-[#3E3025]">
        {children}
    </span>
);

export const ConfirmDialog = ({
    title,
    message,
    confirmLabel = "Delete",
    loading,
    onConfirm,
    onCancel,
}: {
    title: string;
    message: string;
    confirmLabel?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) => (
    <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
        onClick={onCancel}
    >
        <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-lg bg-white p-6"
        >
            <h3 id="confirm-title" className="text-[1.15em] font-bold text-[#3E3025]">
                {title}
            </h3>
            <p className="mt-2 text-[14px] leading-6 text-[#3E3025]/75">{message}</p>

            <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={onCancel} className={btnSecondary}>
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="inline-flex cursor-pointer items-center justify-center rounded-[5px] bg-[#8B2E2E] px-4 py-1.5 text-[13px] font-semibold text-white transition-opacity duration-200 hover:opacity-80 active:opacity-60 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? "Deleting..." : confirmLabel}
                </button>
            </div>
        </div>
    </div>
);