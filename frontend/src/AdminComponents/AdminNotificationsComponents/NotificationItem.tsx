import { memo, useState } from "react";
import { DEFAULT_TYPE_CONFIG, TYPE_CONFIG } from "./notificationConfig";
import { useNotificationsContext } from "../../Contexts/NotificationsContext";
import type { Notification } from "../../Types/Types";

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "À l'instant";
    if (diffMin < 60) return `Il y a ${diffMin} min`;
    if (diffH < 24) return `Il y a ${diffH}h`;
    if (diffD === 1)
        return `Hier, ${date.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;

    return date.toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

interface Props {
    notification: Notification;
    isLast: boolean;
}

const NotificationItem = ({ notification, isLast }: Props) => {
    const { markAsRead, loadingMarkAsRead } = useNotificationsContext();
    const [marking, setMarking] = useState(false);

    const cfg = TYPE_CONFIG[notification.type] ?? DEFAULT_TYPE_CONFIG;

    const handleMarkAsRead = async (e: React.MouseEvent) => {
        e.stopPropagation();
        setMarking(true);
        await markAsRead(notification._id);
        setMarking(false);
    };

    return (
        <div
            className={`group flex items-start gap-3 p-4 transition-colors
                ${!isLast ? "border-b border-[#3E3025]/10" : ""}
                ${
                    !notification.read
                        ? "bg-[#3E3025]/[0.04] hover:bg-[#3E3025]/[0.07]"
                        : "opacity-70 hover:bg-[#3E3025]/[0.03]"
                }
            `}
        >
            {/* Icône du type */}
            <div
                className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${cfg.iconBg} ${cfg.iconColor}`}
            >
                {cfg.icon}
            </div>

            {/* Contenu */}
            <div className="min-w-0 flex-1">
                <p className="mb-0.5 text-sm font-semibold text-[#3E3025]">
                    {notification.title}
                </p>
                <p className="mb-2 text-sm leading-relaxed text-[#3E3025]/65">
                    {notification.message}
                </p>

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.badgeBg} ${cfg.badgeText}`}
                    >
                        {cfg.label}
                    </span>
                    <span className="text-xs text-[#3E3025]/50">
                        {formatDate(notification.createdAt)}
                    </span>
                </div>
            </div>

            {/* Point non-lu + bouton "marquer comme lu" */}
            {!notification.read && (
                <div className="flex flex-shrink-0 flex-col items-center gap-2 pt-0.5">
                    <div
                        className={`h-2 w-2 rounded-full ${cfg.dot}`}
                        aria-label="Non lu"
                    />

                    <button
                        type="button"
                        onClick={handleMarkAsRead}
                        disabled={loadingMarkAsRead || marking}
                        title="Marquer comme lu"
                        aria-label="Marquer comme lu"
                        className="cursor-pointer rounded-md p-1.5 text-[#3E3025]/45 transition-opacity
                        hover:bg-[#3E3025]/10 hover:text-[#3E3025] disabled:cursor-not-allowed
                        sm:opacity-0 sm:group-hover:opacity-100 sm:focus:opacity-100"
                    >
                        {marking ? (
                            <svg
                                className="animate-spin"
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                            >
                                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                            </svg>
                        ) : (
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                aria-hidden="true"
                            >
                                <path d="M5 12l5 5l10-10" />
                            </svg>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(NotificationItem);