import { memo, useCallback, useEffect, useState } from "react";
import { useNotificationsContext } from "../Contexts/NotificationsContext";
import type { ToastState } from "../AdminComponents/AdminLearn/useLearnToast";
import SettingsToast from "../AdminComponents/AdminSettingsComponents/SettingsToast";
import NotificationsList from "../AdminComponents/AdminNotificationsComponents/NotificationsList";
import NotificationsFilter from "../AdminComponents/AdminNotificationsComponents/NotificationsFilter";


const AdminNotifications = () => {
    const {
        notificationsStats,
        loadingNotificationsStats,
        markAllAsRead,
        loadingMarkAllAsRead,
        pagination,
        currentPage,
        setCurrentPage,
        socketConnected,
        msg,
    } = useNotificationsContext();

    const [toast, setToast] = useState<ToastState | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        if (msg) {
            setToast({ type: "error", message: msg });
        }
    }, [msg]);

    return (
        <section className="min-h-screen w-full bg-[#F8F5EF]">
            <SettingsToast toast={toast} onClose={closeToast} />

            <div className="mx-auto max-w-3xl px-4 pb-20 pt-6 sm:px-8 sm:pt-10">
                {/* En-tête */}
                <header className="mb-8 text-center sm:text-left">
                    <div className="flex items-center justify-center gap-3 sm:justify-start">
                        <h1 className="font-serif text-3xl font-bold text-[#3E3025]">
                            Notifications
                        </h1>

                        <span
                            title={
                                socketConnected
                                    ? "Temps réel actif"
                                    : "Temps réel déconnecté"
                            }
                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
                                socketConnected
                                    ? "bg-green-50 text-green-800"
                                    : "bg-[#3E3025]/10 text-[#3E3025]/60"
                            }`}
                        >
                            <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                    socketConnected
                                        ? "bg-green-500"
                                        : "bg-[#3E3025]/40"
                                }`}
                            />
                            {socketConnected ? "En direct" : "Hors ligne"}
                        </span>
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-[#3E3025]/65">
                        Suivez l'activité d'Ancient Wisdom : nouveaux contenus,
                        utilisateurs, modifications et alertes. Consultez,
                        filtrez et marquez vos notifications comme lues.
                    </p>
                </header>

                {/* KPI */}
                <div className="mb-6 grid grid-cols-3 gap-3">
                    <KpiCard
                        label="Total"
                        value={notificationsStats.total}
                        loading={loadingNotificationsStats}
                        color="text-[#3E3025]"
                    />
                    <KpiCard
                        label="Non lues"
                        value={notificationsStats.unread}
                        loading={loadingNotificationsStats}
                        color="text-red-700"
                    />
                    <KpiCard
                        label="Lues"
                        value={notificationsStats.read}
                        loading={loadingNotificationsStats}
                        color="text-green-700"
                    />
                </div>

                {/* Filtre + tout marquer comme lu */}
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <NotificationsFilter />

                    {notificationsStats.unread > 0 && (
                        <button
                            type="button"
                            onClick={() => void markAllAsRead()}
                            disabled={loadingMarkAllAsRead}
                            className="flex cursor-pointer items-center gap-2 rounded-[5px] border border-[#3E3025]/20 px-4 py-2 text-sm
                            text-[#3E3025]/75 transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loadingMarkAllAsRead
                                ? "Marquage..."
                                : "✓✓ Tout marquer comme lu"}
                        </button>
                    )}
                </div>

                {/* Liste */}
                <NotificationsList />

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="cursor-pointer rounded-[5px] bg-[#3E3025]/10 px-4 py-2 text-[14px] font-semibold text-[#3E3025]
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ← Précédent
                        </button>

                        <span className="text-sm font-semibold text-[#3E3025]">
                            Page {pagination.page} / {pagination.totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= pagination.totalPages}
                            className="cursor-pointer rounded-[5px] bg-[#3E3025]/10 px-4 py-2 text-[14px] font-semibold text-[#3E3025]
                            transition-opacity duration-200 hover:opacity-80 active:opacity-60
                            disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Suivant →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default memo(AdminNotifications);

// ─── KpiCard (local) ──────────────────────────────────────────────────────────
interface KpiCardProps {
    label: string;
    value: number;
    color: string;
    loading: boolean;
}

function KpiCard({ label, value, color, loading }: KpiCardProps) {
    return (
        <div className="rounded-lg border border-[#3E3025]/10 bg-white p-4">
            <p className="mb-1 text-xs text-[#3E3025]/60">{label}</p>
            {loading ? (
                <div className="h-6 w-10 animate-pulse rounded bg-[#3E3025]/10" />
            ) : (
                <p className={`text-xl font-semibold ${color}`}>{value}</p>
            )}
        </div>
    );
}