
import type { Notification } from "../../Types/Types";

export function formatNotificationDate(dateStr: string): string {
    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) return "";

    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffMs / 86400000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin} min ago`;
    if (diffH < 24) return `${diffH}h ago`;
    if (diffD === 1)
        return `Yesterday, ${date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })}`;

    return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export interface NotificationGroup {
    label: string;
    items: Notification[];
}

const startOfDay = (date: Date) =>
    new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ).getTime();

const getGroupLabel = (dateStr: string, todayStart: number) => {
    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) return "Older";

    const diffDays = Math.round(
        (todayStart - startOfDay(date)) / 86400000
    );

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return "This week";
    return "Older";
};

// Notifications are already sorted (newest first):
// Map insertion order therefore preserves the order of the groups.
export function groupNotificationsByDay(
    notifications: Notification[]
): NotificationGroup[] {
    const todayStart = startOfDay(new Date());
    const groups = new Map<string, Notification[]>();

    for (const notification of notifications) {
        const label = getGroupLabel(notification.createdAt, todayStart);
        const bucket = groups.get(label);

        if (bucket) bucket.push(notification);
        else groups.set(label, [notification]);
    }

    return Array.from(groups, ([label, items]) => ({ label, items }));
}
