import type { ReactNode } from "react";

export const COLORS = {
    bg: "#F8F5EF",
    dark: "#3E3025",
    border: "#E7DFD0",
    gold: "#B8893B",
    brown: "#8A6A4A",
    olive: "#6B7A4F",
    terracotta: "#A8543A",
    sand: "#D9C9A8",
};

export const PALETTE = [COLORS.dark, COLORS.gold, COLORS.olive, COLORS.terracotta, COLORS.brown, COLORS.sand];

export const tooltipStyle = {
    backgroundColor: "#fff",
    border: `1px solid ${COLORS.border}`,
    borderRadius: 8,
    fontSize: 12,
    color: COLORS.dark,
};

export const fmt = (n: number | undefined) => (n ?? 0).toLocaleString("en-US");
export const pct = (n: number | undefined) => `${Math.round((n ?? 0) * 10) / 10}%`;

export const Section = ({ title, subtitle, children }: { title: string; subtitle?: string; children: ReactNode }) => (
    <section className="space-y-4">
        <div>
            <h2 className="text-lg font-semibold text-[#3E3025]">{title}</h2>
            {subtitle && <p className="text-sm text-[#3E3025]/60">{subtitle}</p>}
        </div>
        {children}
    </section>
);

export const StatCard = ({
    label, value, hint, accent = COLORS.dark, badge,
}: { label: string; value: string | number; hint?: string; accent?: string; badge?: ReactNode }) => (
    <div className="relative overflow-hidden rounded-xl border border-[#E7DFD0] bg-white p-5 shadow-sm">
        <span className="absolute left-0 top-0 h-full w-1" style={{ backgroundColor: accent }} />
        <div className="flex items-start justify-between gap-2">
            <p className="text-xs font-medium uppercase tracking-wider text-[#3E3025]/60">{label}</p>
            {badge}
        </div>
        <p className="mt-2 text-3xl font-semibold text-[#3E3025]">{value}</p>
        {hint && <p className="mt-1 text-xs text-[#3E3025]/50">{hint}</p>}
    </div>
);

export const ChartCard = ({
    title, subtitle, children, height = 260, className = "",
}: { title: string; subtitle?: string; children: ReactNode; height?: number; className?: string }) => (
    <div className={`rounded-xl border border-[#E7DFD0] bg-white p-5 shadow-sm ${className}`}>
        <h3 className="font-medium text-[#3E3025]">{title}</h3>
        {subtitle && <p className="mb-3 text-xs text-[#3E3025]/50">{subtitle}</p>}
        <div style={{ height }} className={subtitle ? "" : "mt-3"}>{children}</div>
    </div>
);

export const EmptyChart = () => (
    <div className="flex h-full items-center justify-center text-sm text-[#3E3025]/40">No data available</div>
);

export const ProgressRow = ({ label, value, color = COLORS.gold }: { label: string; value: number; color?: string }) => (
    <div>
        <div className="mb-1 flex justify-between text-sm text-[#3E3025]">
            <span>{label}</span>
            <span className="font-medium">{pct(value)}</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#F8F5EF]">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(Math.max(value, 0), 100)}%`, backgroundColor: color }} />
        </div>
    </div>
);

export const Legend = ({ items }: { items: { label: string; value: number; color: string }[] }) => (
    <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-[#3E3025]">
        {items.map(i => (
            <li key={i.label} className="flex items-center justify-between gap-2">
                <span className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: i.color }} />{i.label}
                </span>
                <span className="font-medium">{fmt(i.value)}</span>
            </li>
        ))}
    </ul>
);