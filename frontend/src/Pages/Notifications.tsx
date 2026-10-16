import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useNotificationsContext } from "../Contexts/NotificationsContext";
import type { ToastState } from "../AdminComponents/AdminLearn/useLearnToast";
import { groupNotificationsByDay } from "../Components/Notifications/notificationUtils";
import SettingsToast from "../AdminComponents/AdminSettingsComponents/SettingsToast";
import NotificationsFilter from "../AdminComponents/AdminNotificationsComponents/NotificationsFilter";
import UserNotificationCard from "../Components/Notifications/UserNotificationCard";
import { useAuthContext } from "../Contexts/AuthContext";



const Notifications = () => {
    const { user } = useAuthContext();

    const {
        notifications,
        loadingNotifications,
        notificationsStats,
        markAllAsRead,
        loadingMarkAllAsRead,
        read,
        pagination,
        currentPage,
        setCurrentPage,
        socketConnected,
        msg,
    } = useNotificationsContext();

    const [toast, setToast] = useState<ToastState | null>(null);
    const closeToast = useCallback(() => setToast(null), []);

    useEffect(() => {
        if (msg) setToast({ type: "error", message: msg });
    }, [msg]);

    const groups = useMemo(
        () => groupNotificationsByDay(notifications),
        [notifications]
    );

    /* ============ Unauthenticated user ============ */

    if (!user) {
        return (
            <section className="flex min-h-screen items-center justify-center bg-[#F8F5EF] px-4">
                <div className="max-w-md rounded-2xl border border-[#3E3025]/15 bg-white/70 p-8 text-center shadow-sm">
                    <h1 className="font-serif text-2xl font-bold text-[#3E3025]">
                        Your notifications
                    </h1>
                    <p className="mt-2 text-sm text-[#3E3025]/70">
                        Sign in to view your notifications.
                    </p>
                    <Link
                        to="/user"
                        className="mt-6 inline-block rounded-lg bg-[#3E3025] px-6 py-2.5 text-sm font-medium text-[#F8F5EF] transition hover:opacity-90"
                    >
                        Sign in
                    </Link>
                </div>
            </section>
        );
    }

    /* ============ Empty state message based on the filter ============ */

    const emptyMessage =
        read === false
            ? "You're all caught up: no unread notifications."
            : read === true
              ? "No read notifications yet."
              : "No notifications yet.";

    return (
        <section className="min-h-screen w-full bg-[#F8F5EF]">
            <SettingsToast toast={toast} onClose={closeToast} />

            <div className="mx-auto max-w-2xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
                {/* Header */}
                <header className="mb-8">
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="font-serif text-3xl font-bold text-[#3E3025] sm:text-4xl">
                            My notifications
                        </h1>

                        {notificationsStats.unread > 0 && (
                            <span className="rounded-full bg-[#3E3025] px-2.5 py-1 text-xs font-medium text-[#F8F5EF]">
                                {notificationsStats.unread} unread notification
                                {notificationsStats.unread > 1 ? "s" : ""}
                            </span>
                        )}

                        <span
                            title={
                                socketConnected
                                    ? "Live updates"
                                    : "Live updates unavailable"
                            }
                            className={`h-2 w-2 rounded-full ${
                                socketConnected
                                    ? "bg-green-500"
                                    : "bg-[#3E3025]/30"
                            }`}
                        />
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-[#3E3025]/65">
                        Keep track of your achievements, quiz results, and the latest
                        updates from Ancient Wisdom. Click a notification
                        to mark it as read.
                    </p>
                </header>

                {/* Filter + mark all as read */}
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <NotificationsFilter />

                    {notificationsStats.unread > 0 && (
                        <button
                            type="button"
                            onClick={() => void markAllAsRead()}
                            disabled={loadingMarkAllAsRead}
                            className="cursor-pointer rounded-lg border border-[#3E3025]/20 px-4 py-2 text-sm text-[#3E3025]/80
                            transition hover:bg-[#3E3025]/5 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loadingMarkAllAsRead
                                ? "Marking..."
                                : "Mark all as read"}
                        </button>
                    )}
                </div>

                {/* Content */}
                {loadingNotifications && notifications.length === 0 ? (
                    <div className="space-y-3">
                        {[...Array(4)].map((_, i) => (
                            <SkeletonCard key={i} />
                        ))}
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-[#3E3025]/25 px-6 py-16 text-center text-[#3E3025]/50">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3H4a4 4 0 0 0 2-3v-3a7 7 0 0 1 4-6" />
                            <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                        </svg>
                        <p className="text-sm">{emptyMessage}</p>
                    </div>
                ) : (
                    <div
                        className={`space-y-8 transition-opacity ${
                            loadingNotifications ? "opacity-60" : ""
                        }`}
                    >
                        {groups.map((group) => (
                            <div key={group.label}>
                                <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[#3E3025]/50">
                                    {group.label}
                                </h2>

                                <div className="space-y-3">
                                    {group.items.map((notification) => (
                                        <UserNotificationCard
                                            key={notification._id}
                                            notification={notification}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="mt-10 flex items-center justify-center gap-3">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage <= 1}
                            className="cursor-pointer rounded-lg bg-[#3E3025]/10 px-4 py-2 text-sm font-semibold text-[#3E3025]
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            ← Previous
                        </button>

                        <span className="text-sm font-semibold text-[#3E3025]">
                            {pagination.page} / {pagination.totalPages}
                        </span>

                        <button
                            type="button"
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage >= pagination.totalPages}
                            className="cursor-pointer rounded-lg bg-[#3E3025]/10 px-4 py-2 text-sm font-semibold text-[#3E3025]
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default memo(Notifications);

// ─── Skeleton (local) ─────────────────────────────────────────────────────────
function SkeletonCard() {
    return (
        <div className="flex animate-pulse items-start gap-3.5 rounded-2xl border border-[#3E3025]/10 bg-white/60 p-5">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-[#3E3025]/10" />
            <div className="flex-1 space-y-2.5">
                <div className="h-3.5 w-1/3 rounded bg-[#3E3025]/10" />
                <div className="h-3 w-3/4 rounded bg-[#3E3025]/10" />
                <div className="h-3 w-1/4 rounded bg-[#3E3025]/10" />
            </div>
        </div>
    );
}