import type { ReactNode } from "react";

export const btnPrimary =
    "bg-[#3E3025] text-white text-[14px] font-[600] px-4 py-2 rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60 disabled:opacity-50 disabled:cursor-not-allowed";
export const btnOutline =
    "border border-[#3E3025] text-[#3E3025] text-[14px] font-[600] px-4 py-2 rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-70 active:opacity-50 disabled:opacity-50 disabled:cursor-not-allowed";
export const inputClass =
    "w-full rounded-lg border border-[#D9C9A8] bg-white px-3 py-2 text-[14px] text-[#3E3025] focus:outline-none focus:ring-2 focus:ring-[#3E3025]/20 disabled:bg-[#F8F5EF] disabled:text-[#3E3025]/60";

export const Card = ({ title, subtitle, action, children, className = "" }: {
    title?: string; subtitle?: string; action?: ReactNode; children: ReactNode; className?: string;
}) => (
    <div className={`w-full rounded-xl bg-white p-5 shadow-sm ${className}`}>
        {(title || action) && (
            <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                    {title && <h3 className="text-[16px] font-[600] text-[#3E3025]">{title}</h3>}
                    {subtitle && <p className="text-[13px] text-[#3E3025]/60">{subtitle}</p>}
                </div>
                {action}
            </div>
        )}
        {children}
    </div>
);

export const StatTile = ({ value, label }: { value: ReactNode; label: string }) => (
    <div className="flex flex-col items-center rounded-lg bg-[#F8F5EF] px-3 py-3 text-center">
        <span className="text-[1.6em] font-[700] leading-tight text-[#3E3025]">{value}</span>
        <span className="text-[12px] text-[#3E3025]/60">{label}</span>
    </div>
);

export const Meter = ({ label, value, color = "#B8893B" }: { label: string; value: number; color?: string }) => (
    <div>
        <div className="mb-1 flex justify-between text-[13px] text-[#3E3025]">
            <span>{label}</span>
            <span className="font-[600]">{Math.round(value * 10) / 10}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#F8F5EF]">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color }} />
        </div>
    </div>
);

export const Row = ({ label, value }: { label: string; value: ReactNode }) => (
    <div className="flex items-center justify-between border-b border-[#E7DFD0] py-2 text-[14px] text-[#3E3025] last:border-0">
        <span className="text-[#3E3025]/70">{label}</span>
        <span className="font-[600]">{value}</span>
    </div>
);

export const Empty = ({ text }: { text: string }) => (
    <p className="py-6 text-center text-[14px] text-[#3E3025]/40">{text}</p>
);

export const Badge = ({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "warn" | "bad" }) => {
    const tones = {
        neutral: "bg-[#F8F5EF] text-[#3E3025]",
        good: "bg-[#6B7A4F]/15 text-[#6B7A4F]",
        warn: "bg-[#B8893B]/20 text-[#8A6A4A]",
        bad: "bg-[#A8543A]/15 text-[#A8543A]",
    };
    return <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[12px] font-[600] ${tones[tone]}`}>{children}</span>;
};

export const formatDuration = (seconds = 0) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h}h ${m}m`;
    if (m > 0) return `${m}m`;
    return `${Math.round(seconds)}s`;
};

export const formatMonthYear = (date?: string) =>
    date ? new Date(date).toLocaleDateString("en-GB", { month: "long", year: "numeric" }) : "—";

export const formatShortDate = (date?: string | null) =>
    date ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" }) : "—";