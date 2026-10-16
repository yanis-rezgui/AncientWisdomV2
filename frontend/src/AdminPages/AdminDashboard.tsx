import { useEffect } from "react";
import {
    Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend as RLegend,
    Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import {
    ChartCard, COLORS, EmptyChart, fmt, Legend, PALETTE, pct, ProgressRow, Section, StatCard, tooltipStyle,
} from "../AdminComponents/DashboardComponents/DashboardWidgets";
import type { CountByKey } from "../Types/Types";
import { useDashboardContext } from "../AdminContexts/DashboardContext";

/* ---------- helpers ---------- */
const axis = { stroke: COLORS.dark, fontSize: 11, tickLine: false, axisLine: false } as const;
type Item = { label: string; value: number; color: string };
type Row = { name: string; [k: string]: string | number };

const label = (s?: string | null) =>
    s ? s.replace(/[-_]/g, " ").replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^\w/, c => c.toUpperCase()) : "Unknown";
const dur = (s = 0) => (s >= 60 ? `${Math.floor(s / 60)}m ${Math.round(s % 60)}s` : `${Math.round(s)}s`);
const rows = (arr?: CountByKey[]): Row[] => (arr ?? []).map(x => ({ name: label(x._id), count: x.count }));
const palette = (r: Row[]): Item[] => r.map((x, i) => ({ label: x.name, value: Number(x.count), color: PALETTE[i % PALETTE.length] }));
const statuses = (s: Record<string, number> | undefined, colors: Record<string, string>): Item[] =>
    Object.entries(colors).map(([k, color]) => ({ label: label(k), value: s?.[k] ?? 0, color }));
const count = (arr: CountByKey[] | undefined, k: string) => arr?.find(x => x._id === k)?.count ?? 0;
const monthLabel = (m: string) => new Date(`${m}-01`).toLocaleDateString("en-GB", { month: "short", year: "2-digit" });

const STATUS = { draft: COLORS.gold, published: COLORS.olive, archived: COLORS.brown };
const PROGRESS = { completed: COLORS.olive, in_progress: COLORS.gold, abandoned: COLORS.terracotta };

/* ---------- charts ---------- */
const Donut = ({ items }: { items: Item[] }) => {
    if (!items.some(i => i.value > 0)) return <EmptyChart />;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie data={items} dataKey="value" nameKey="label" innerRadius="60%" outerRadius="85%" paddingAngle={2} stroke="none">
                    {items.map(i => <Cell key={i.label} fill={i.color} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
        </ResponsiveContainer>
    );
};

const DonutCard = ({ title, subtitle, items, className }: { title: string; subtitle?: string; items: Item[]; className?: string }) => (
    <ChartCard title={title} subtitle={subtitle} height={250} className={className}>
        <div className="flex h-full flex-col">
            <div className="min-h-0 flex-1"><Donut items={items} /></div>
            <Legend items={items} />
        </div>
    </ChartCard>
);

const Bars = ({ data, series, horizontal = false }: {
    data: Row[]; series: { key: string; color: string; name?: string }[]; horizontal?: boolean;
}) => {
    if (!data.some(r => series.some(s => Number(r[s.key]) > 0))) return <EmptyChart />;
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout={horizontal ? "vertical" : "horizontal"}
                margin={{ top: 5, right: 10, left: horizontal ? 10 : -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={horizontal} horizontal={!horizontal} />
                {horizontal && <XAxis type="number" allowDecimals={false} {...axis} />}
                {horizontal && <YAxis type="category" dataKey="name" width={100} {...axis} />}
                {!horizontal && <XAxis dataKey="name" {...axis} />}
                {!horizontal && <YAxis allowDecimals={false} {...axis} />}
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: COLORS.bg }} />
                {series.length > 1 && <RLegend iconType="circle" wrapperStyle={{ fontSize: 12 }} />}
                {series.map(s => (
                    <Bar key={s.key} dataKey={s.key} name={s.name ?? s.key} fill={s.color}
                        radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]} />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
};

const Skeleton = () => (
    <div className="animate-pulse space-y-6">
        <div className="h-8 w-60 rounded bg-[#E7DFD0]" />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-28 rounded-xl bg-[#E7DFD0]" />)}
        </div>
        <div className="h-72 rounded-xl bg-[#E7DFD0]" />
    </div>
);

const Panel = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="rounded-xl border border-[#E7DFD0] bg-white p-5 shadow-sm">
        <h3 className="mb-3 font-medium text-[#3E3025]">{title}</h3>
        {children}
    </div>
);

const Empty = ({ text }: { text: string }) => <p className="py-6 text-center text-sm text-[#3E3025]/40">{text}</p>;

/* ---------- page ---------- */
export default function AdminDashboard() {
    const { dashboard: d, getDashboard, loadingDashboard, errorMsg } = useDashboardContext();

    useEffect(() => { getDashboard(); }, [getDashboard]);

    if (loadingDashboard && !d) {
    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-20">
            <div className="w-full max-w-7xl p-4 sm:p-6"><Skeleton /></div>
        </section>
    );
}

if (!d) {
    return (
        <section className="flex flex-col w-full items-center justify-center min-h-screen bg-[#E8E2D6] pb-20">
            <p className="text-[#A8543A] font-[600] px-4 text-center">{errorMsg || "No dashboard data."}</p>
            <button onClick={getDashboard}
                className="mt-4 rounded-lg bg-[#3E3025] px-4 py-2 text-sm font-[600] text-white transition-opacity hover:opacity-80 active:opacity-60">
                Retry
            </button>
        </section>
    );
}
    const { overview: o, community: c, content: ct, quizzes: q, games: g, engagement: e } = d;
    const qa = q.attempts;
    const gs = g.sessions;

    const registrations = (c.monthlyRegistrations ?? []).map(m => ({ ...m, month: monthLabel(m.month) }));
    const breakdown: Row[] = Object.entries(ct.breakdown ?? {}).map(([k, v]) => ({ name: label(k), count: v }));
    const difficulty: Row[] = ["Easy", "Medium", "Hard"].map(k => ({
        name: k, quizzes: count(q.byDifficulty, k), questions: count(q.questions.byDifficulty, k),
    }));
    const challenges: Row[] = (g.challenges.byType ?? []).map(x => ({ name: label(x.type), count: x.total }));

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-20">
        <div className="w-full max-w-7xl space-y-10 p-4 sm:p-6">
            {/* Header */}
            <header className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-semibold text-[#3E3025]">Dashboard</h1>
                    <p className="text-sm text-[#3E3025]/60">
                        An overview of Ancient Wisdom · updated {new Date(d.generatedAt).toLocaleString("en-GB")}
                    </p>
                </div>
                <button onClick={getDashboard} disabled={loadingDashboard}
                    className="rounded-lg border border-[#3E3025] px-4 py-2 text-sm text-[#3E3025] transition hover:bg-[#3E3025] hover:text-[#F8F5EF] disabled:opacity-50">
                    {loadingDashboard ? "Refreshing..." : "Refresh"}
                </button>
            </header>

            {/* Overview */}
            <Section title="Overview" subtitle="Key figures across the platform.">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Users" value={fmt(o.totalUsers)} hint={`${fmt(o.totalAdmins)} admins`} accent={COLORS.dark} />
                    <StatCard label="Historical content" value={fmt(o.totalHistoricalContent)} accent={COLORS.gold} />
                    <StatCard label="Quizzes" value={fmt(o.totalQuizzes)} accent={COLORS.olive} />
                    <StatCard label="Questions" value={fmt(o.totalQuestions)} accent={COLORS.terracotta} />
                    <StatCard label="Games" value={fmt(o.totalGames)} accent={COLORS.brown} />
                    <StatCard label="Challenges" value={fmt(o.totalChallenges)} accent={COLORS.gold} />
                    <StatCard label="Quiz attempts" value={fmt(o.totalQuizAttempts)} accent={COLORS.olive} />
                    <StatCard label="Game sessions" value={fmt(o.totalGameSessions)} accent={COLORS.dark} />
                </div>
            </Section>

            {/* Community */}
            <Section title="Community" subtitle="User growth and activity.">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="New users · 7 days" value={fmt(c.newUsersLast7Days)} accent={COLORS.gold} />
                    <StatCard label="New users · 30 days" value={fmt(c.newUsersLast30Days)} accent={COLORS.olive} />
                    <StatCard label="Active learners · 30 days" value={fmt(c.activeLearnersLast30Days)} accent={COLORS.terracotta} />
                    <StatCard label="Regular users" value={fmt(c.regularUsers)} hint={`${fmt(c.totalAdmins)} admins`} accent={COLORS.brown} />
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                    <ChartCard title="User registrations" subtitle="Last 12 months" className="lg:col-span-2" height={260}>
                        {registrations.some(r => r.count > 0) ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={registrations} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                                    <XAxis dataKey="month" {...axis} />
                                    <YAxis allowDecimals={false} {...axis} />
                                    <Tooltip contentStyle={tooltipStyle} />
                                    <Area type="monotone" dataKey="count" name="Sign-ups" stroke={COLORS.gold} strokeWidth={2.5} fill={COLORS.gold} fillOpacity={0.15} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <EmptyChart />}
                    </ChartCard>
                    <DonutCard title="Roles" subtitle="Users vs admins" items={[
                        { label: "Users", value: c.regularUsers, color: COLORS.gold },
                        { label: "Admins", value: c.totalAdmins, color: COLORS.dark },
                    ]} />
                </div>
            </Section>

            {/* Content */}
            <Section title="Content" subtitle={`${fmt(ct.total)} historical items in total.`}>
                <div className="grid gap-4 lg:grid-cols-3">
                    <DonutCard title="Content breakdown" subtitle="By category" items={palette(breakdown)} />
                    <ChartCard title="Frames by type" subtitle="Monuments, statues and maps" height={250}>
                        <Bars data={rows(ct.framesByType)} series={[{ key: "count", color: COLORS.olive, name: "Frames" }]} />
                    </ChartCard>
                    <Panel title="Created in the last 30 days">
                        <div className="space-y-4">
                            <ProgressRow label={`Figures · ${fmt(ct.createdLast30Days.figures)}`}
                                value={ct.total ? (ct.createdLast30Days.figures / ct.total) * 100 : 0} color={COLORS.gold} />
                            <ProgressRow label={`Events · ${fmt(ct.createdLast30Days.events)}`}
                                value={ct.total ? (ct.createdLast30Days.events / ct.total) * 100 : 0} color={COLORS.terracotta} />
                            <ProgressRow label={`Articles · ${fmt(ct.createdLast30Days.articles)}`}
                                value={ct.total ? (ct.createdLast30Days.articles / ct.total) * 100 : 0} color={COLORS.olive} />
                            <p className="text-xs text-[#3E3025]/50">Share of total historical content.</p>
                        </div>
                    </Panel>
                </div>
            </Section>

            {/* Quizzes */}
            <Section title="Quizzes" subtitle="Quiz library and player performance.">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Quizzes" value={fmt(q.total)} hint={`${fmt(q.byStatus?.published)} published`} accent={COLORS.gold} />
                    <StatCard label="Questions" value={fmt(q.questions.total)} hint={`${fmt(q.questions.byStatus?.published)} published`} accent={COLORS.olive} />
                    <StatCard label="Attempts" value={fmt(qa.total)} hint={`${fmt(qa.last30Days)} in 30 days`} accent={COLORS.dark} />
                    <StatCard label="Average score" value={pct(qa.averagePercentage)} hint={`Avg. duration ${dur(qa.averageDurationSeconds)}`} accent={COLORS.terracotta} />
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                    <DonutCard title="Attempts status" items={statuses(qa.byStatus, PROGRESS)} />
                    <DonutCard title="Quizzes by status" items={statuses(q.byStatus, STATUS)} />
                    <DonutCard title="Questions by status" items={statuses(q.questions.byStatus, STATUS)} />
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                    <ChartCard title="Difficulty distribution" subtitle="Quizzes and questions" className="lg:col-span-2" height={240}>
                        <Bars data={difficulty} series={[
                            { key: "quizzes", color: COLORS.gold, name: "Quizzes" },
                            { key: "questions", color: COLORS.dark, name: "Questions" },
                        ]} />
                    </ChartCard>
                    <Panel title="Rates">
                        <div className="space-y-4">
                            <ProgressRow label="Completion rate" value={qa.completionRate} color={COLORS.olive} />
                            <ProgressRow label="Abandonment rate" value={qa.abandonmentRate} color={COLORS.terracotta} />
                            <ProgressRow label="Average score" value={qa.averagePercentage} color={COLORS.gold} />
                        </div>
                    </Panel>
                </div>
            </Section>

            {/* Games */}
            <Section title="Games" subtitle="Interactive challenges and sessions.">
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <StatCard label="Games" value={fmt(g.total)} hint={`${fmt(g.byStatus?.published)} published`} accent={COLORS.gold} />
                    <StatCard label="Challenges" value={fmt(g.challenges.total)} accent={COLORS.olive} />
                    <StatCard label="Sessions" value={fmt(gs.total)} hint={`${fmt(gs.last30Days)} in 30 days`} accent={COLORS.dark} />
                    <StatCard label="Average score" value={Math.round(gs.averageScore * 10) / 10} hint={`Avg. duration ${dur(gs.averageDurationSeconds)}`} accent={COLORS.terracotta} />
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                    <ChartCard title="Challenges per game" height={250}>
                        <Bars horizontal data={challenges} series={[{ key: "count", color: COLORS.gold, name: "Challenges" }]} />
                    </ChartCard>
                    <DonutCard title="Sessions status" items={statuses(gs.byStatus, PROGRESS)} />
                    <DonutCard title="Games by type" items={palette(rows(g.byType))} />
                </div>
                <div className="grid gap-4 lg:grid-cols-3">
                    <Panel title="Performance">
                        <div className="space-y-4">
                            <ProgressRow label="Completion rate" value={gs.completionRate} color={COLORS.olive} />
                            <ProgressRow label="Abandonment rate" value={gs.abandonmentRate} color={COLORS.terracotta} />
                            <ProgressRow label="Answer accuracy" value={gs.answerAccuracy} color={COLORS.gold} />
                        </div>
                    </Panel>
                    <DonutCard title="Answers" subtitle={`${fmt(gs.totalQuestions)} questions played`} items={[
                        { label: "Correct", value: gs.correctAnswers, color: COLORS.olive },
                        { label: "Incorrect", value: gs.incorrectAnswers, color: COLORS.terracotta },
                    ]} />
                    <DonutCard title="Games by status" items={statuses(g.byStatus, STATUS)} />
                </div>
            </Section>

            {/* Engagement */}
            <Section title="Engagement" subtitle="Favorites and notifications.">
                <div className="grid grid-cols-3 gap-4">
                    <StatCard label="Favorites" value={fmt(e.totalFavorites)} accent={COLORS.gold} />
                    <StatCard label="Notifications" value={fmt(e.notifications.total)} accent={COLORS.dark} />
                    <StatCard label="Unread" value={fmt(e.notifications.unread)} accent={COLORS.terracotta} />
                </div>
                <div className="grid gap-4 lg:grid-cols-2">
                    <ChartCard title="Favorites by type" height={240}>
                        <Bars data={rows(e.favoritesByType)} series={[{ key: "count", color: COLORS.brown, name: "Favorites" }]} />
                    </ChartCard>
                    <Panel title="Recent notifications">
                        {e.notifications.recent?.length ? (
                            <ul className="divide-y divide-[#E7DFD0]">
                                {e.notifications.recent.map(n => (
                                    <li key={n._id} className="flex items-start gap-3 py-2.5 text-sm">
                                        <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? "bg-[#D9C9A8]" : "bg-[#A8543A]"}`} />
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-[#3E3025]">{n.title}</p>
                                            <p className="truncate text-xs text-[#3E3025]/50">{n.message}</p>
                                        </div>
                                        <span className="shrink-0 text-xs text-[#3E3025]/50">{new Date(n.createdAt).toLocaleDateString("en-GB")}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <Empty text="No notifications" />}
                    </Panel>
                </div>
            </Section>

            {/* Recent activity */}
            <Section title="Recent activity" subtitle="Latest content and newest members.">
                <div className="grid gap-4 lg:grid-cols-2">
                    <Panel title="Recent content">
                        {d.recentContent?.length ? (
                            <ul className="divide-y divide-[#E7DFD0]">
                                {d.recentContent.map(i => (
                                    <li key={`${i.type}-${i.id}`} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium text-[#3E3025]">{i.title}</p>
                                            <p className="text-xs text-[#3E3025]/50">{new Date(i.createdAt).toLocaleDateString("en-GB")}</p>
                                        </div>
                                        <span className="shrink-0 rounded-full bg-[#F8F5EF] px-2.5 py-0.5 text-xs text-[#3E3025]">{label(i.type)}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : <Empty text="No recent content" />}
                    </Panel>

                    <Panel title="Newest users">
                        {c.recentUsers?.length ? (
                            <ul className="divide-y divide-[#E7DFD0]">
                                {c.recentUsers.map(u => (
                                    <li key={u._id} className="flex items-center gap-3 py-2.5 text-sm">
                                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#3E3025] text-xs font-semibold text-[#F8F5EF]">
                                            {u.firstName?.[0]}{u.lastName?.[0]}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate font-medium text-[#3E3025]">{u.firstName} {u.lastName}</p>
                                            <p className="truncate text-xs text-[#3E3025]/50">{u.email}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs ${u.role === "ADMIN" ? "bg-[#B8893B]/20 text-[#8A6A4A]" : "bg-[#F8F5EF] text-[#3E3025]"}`}>
                                            {u.role}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : <Empty text="No recent users" />}
                    </Panel>
                </div>
            </Section>
        </div>
        </section>
    );
}