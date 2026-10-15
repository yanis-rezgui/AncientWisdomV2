import { memo } from "react";
import NotificationItem from "./NotificationItem";
import { useNotificationsContext } from "../../Contexts/NotificationsContext";

const cardClass =
    "overflow-hidden rounded-xl border border-[#3E3025]/10 bg-white";

const NotificationsList = () => {
    const { notifications, loadingNotifications } = useNotificationsContext();

    if (loadingNotifications && notifications.length === 0) {
        return (
            <div className={cardClass}>
                {[...Array(5)].map((_, i) => (
                    <SkeletonRow key={i} />
                ))}
            </div>
        );
    }

    if (notifications.length === 0) {
        return (
            <div
                className={`${cardClass} flex flex-col items-center justify-center gap-3 p-12 text-[#3E3025]/45`}
            >
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
                <p className="text-sm">Aucune notification</p>
            </div>
        );
    }

    return (
        <div
            className={`${cardClass} transition-opacity ${
                loadingNotifications ? "opacity-60" : ""
            }`}
        >
            {notifications.map((notification, i) => (
                <NotificationItem
                    key={notification._id}
                    notification={notification}
                    isLast={i === notifications.length - 1}
                />
            ))}
        </div>
    );
};

export default memo(NotificationsList);

function SkeletonRow() {
    return (
        <div className="flex animate-pulse items-start gap-3 border-b border-[#3E3025]/10 p-4 last:border-b-0">
            <div className="h-9 w-9 flex-shrink-0 rounded-full bg-[#3E3025]/10" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 rounded bg-[#3E3025]/10" />
                <div className="h-3 w-2/3 rounded bg-[#3E3025]/10" />
                <div className="h-3 w-1/4 rounded bg-[#3E3025]/10" />
            </div>
        </div>
    );
}