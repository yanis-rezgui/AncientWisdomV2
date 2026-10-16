
import { memo, useState } from "react";

import type { Notification } from "../../Types/Types";

import { formatNotificationDate } from "./notificationUtils";
import { DEFAULT_TYPE_CONFIG, TYPE_CONFIG } from "../../AdminComponents/AdminNotificationsComponents/notificationConfig";
import { useNotificationsContext } from "../../Contexts/NotificationsContext";

interface Props {
    notification: Notification;
}

const UserNotificationCard = ({ notification }: Props) => {
    const { markAsRead } = useNotificationsContext();
    const [marking, setMarking] = useState(false);

    const cfg = TYPE_CONFIG[notification.type] ?? DEFAULT_TYPE_CONFIG;
    const unread = !notification.read;

    const handleActivate = async () => {
        if (!unread || marking) return;

        setMarking(true);
        await markAsRead(notification._id);
        setMarking(false);
    };

    return (
        <article
            role={unread ? "button" : undefined}
            tabIndex={unread ? 0 : undefined}
            aria-label={
                unread ? `Mark "${notification.title}" as read` : undefined
            }
            onClick={() => void handleActivate()}
            onKeyDown={(e) => {
                if (unread && (e.key === "Enter" || e.key === " ")) {
                    e.preventDefault();
                    void handleActivate();
                }
            }}
            className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all duration-200 sm:p-5
                ${
                    unread
                        ? "cursor-pointer border-[#3E3025]/20 bg-white shadow-sm hover:-translate-y-px hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3E3025]/40"
                        : "border-[#3E3025]/10 bg-white/50 opacity-75"
                }
                ${marking ? "opacity-60" : ""}
            `}
        >
            {/* Notification type icon */}
            <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${cfg.iconBg} ${cfg.iconColor}`}
            >
                {cfg.icon}
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                    <p
                        className={`text-sm text-[#3E3025] sm:text-[15px] ${
                            unread ? "font-semibold" : "font-medium"
                        }`}
                    >
                        {notification.title}
                    </p>

                    {unread && (
                        <span
                            className={`mt-1.5 h-2 w-2 flex-shrink-0 rounded-full ${cfg.dot}`}
                            aria-label="Unread"
                        />
                    )}
                </div>

                <p className="mt-1 text-sm leading-relaxed text-[#3E3025]/70">
                    {notification.message}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cfg.badgeBg} ${cfg.badgeText}`}
                    >
                        {cfg.label}
                    </span>
                    <span className="text-xs text-[#3E3025]/50">
                        {formatNotificationDate(notification.createdAt)}
                    </span>
                </div>
            </div>
        </article>
    );
};

export default memo(UserNotificationCard);
