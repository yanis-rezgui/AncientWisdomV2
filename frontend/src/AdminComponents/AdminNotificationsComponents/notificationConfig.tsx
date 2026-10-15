import type { ReactNode } from "react";
import type { NotificationType } from "../../Types/Types";


// ─── Icônes (tracés SVG 24x24) ────────────────────────────────────────────────
const NotifIcon = ({ children }: { children: ReactNode }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        {children}
    </svg>
);

const ICONS = {
    userPlus: (
        <NotifIcon>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <line x1="19" y1="8" x2="19" y2="14" />
            <line x1="22" y1="11" x2="16" y2="11" />
        </NotifIcon>
    ),
    user: (
        <NotifIcon>
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </NotifIcon>
    ),
    calendar: (
        <NotifIcon>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
        </NotifIcon>
    ),
    landmark: (
        <NotifIcon>
            <line x1="3" y1="22" x2="21" y2="22" />
            <line x1="6" y1="18" x2="6" y2="11" />
            <line x1="10" y1="18" x2="10" y2="11" />
            <line x1="14" y1="18" x2="14" y2="11" />
            <line x1="18" y1="18" x2="18" y2="11" />
            <polygon points="12 2 20 7 4 7" />
        </NotifIcon>
    ),
    quote: (
        <NotifIcon>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </NotifIcon>
    ),
    target: (
        <NotifIcon>
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="6" />
            <circle cx="12" cy="12" r="2" />
        </NotifIcon>
    ),
    star: (
        <NotifIcon>
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </NotifIcon>
    ),
    trash: (
        <NotifIcon>
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
        </NotifIcon>
    ),
    refresh: (
        <NotifIcon>
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </NotifIcon>
    ),
    sliders: (
        <NotifIcon>
            <line x1="4" y1="21" x2="4" y2="14" />
            <line x1="4" y1="10" x2="4" y2="3" />
            <line x1="12" y1="21" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12" y2="3" />
            <line x1="20" y1="21" x2="20" y2="16" />
            <line x1="20" y1="12" x2="20" y2="3" />
            <line x1="1" y1="14" x2="7" y2="14" />
            <line x1="9" y1="8" x2="15" y2="8" />
            <line x1="17" y1="16" x2="23" y2="16" />
        </NotifIcon>
    ),
    award: (
        <NotifIcon>
            <circle cx="12" cy="8" r="7" />
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </NotifIcon>
    ),
    checkCircle: (
        <NotifIcon>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </NotifIcon>
    ),
    userCheck: (
        <NotifIcon>
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <polyline points="17 11 19 13 23 9" />
        </NotifIcon>
    ),
    shield: (
        <NotifIcon>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </NotifIcon>
    ),
};

// ─── Tons de couleur (classes complètes pour que Tailwind les détecte) ────────
const TONES = {
    gold: {
        iconBg: "bg-[#B8860B]/10",
        iconColor: "text-[#8A6508]",
        badgeBg: "bg-[#B8860B]/10",
        badgeText: "text-[#7A5A07]",
        dot: "bg-[#B8860B]",
    },
    sky: {
        iconBg: "bg-sky-50",
        iconColor: "text-sky-700",
        badgeBg: "bg-sky-50",
        badgeText: "text-sky-800",
        dot: "bg-sky-500",
    },
    green: {
        iconBg: "bg-green-50",
        iconColor: "text-green-700",
        badgeBg: "bg-green-50",
        badgeText: "text-green-800",
        dot: "bg-green-500",
    },
    rose: {
        iconBg: "bg-rose-50",
        iconColor: "text-rose-700",
        badgeBg: "bg-rose-50",
        badgeText: "text-rose-800",
        dot: "bg-rose-500",
    },
    red: {
        iconBg: "bg-red-50",
        iconColor: "text-red-700",
        badgeBg: "bg-red-50",
        badgeText: "text-red-800",
        dot: "bg-red-500",
    },
    brown: {
        iconBg: "bg-[#3E3025]/10",
        iconColor: "text-[#3E3025]",
        badgeBg: "bg-[#3E3025]/10",
        badgeText: "text-[#3E3025]",
        dot: "bg-[#3E3025]",
    },
} as const;

export interface NotificationTypeConfig {
    label: string;
    icon: ReactNode;
    iconBg: string;
    iconColor: string;
    badgeBg: string;
    badgeText: string;
    dot: string;
}

export const TYPE_CONFIG: Record<NotificationType, NotificationTypeConfig> = {
    NEW_USER: { label: "Nouvel utilisateur", icon: ICONS.userPlus, ...TONES.sky },
    NEW_FIGURE: { label: "Nouveau personnage", icon: ICONS.user, ...TONES.gold },
    NEW_EVENT: { label: "Nouvel événement", icon: ICONS.calendar, ...TONES.gold },
    NEW_ERA: { label: "Nouvelle époque", icon: ICONS.landmark, ...TONES.gold },
    NEW_QUOTE: { label: "Nouvelle citation", icon: ICONS.quote, ...TONES.gold },
    NEW_CHALLENGE: { label: "Nouveau défi", icon: ICONS.target, ...TONES.green },
    NEW_TESTIMONIAL: { label: "Nouveau témoignage", icon: ICONS.star, ...TONES.rose },
    CONTENT_DELETED: { label: "Contenu supprimé", icon: ICONS.trash, ...TONES.red },
    STATUS_CHANGED: { label: "Statut modifié", icon: ICONS.refresh, ...TONES.brown },
    SETTINGS_UPDATED: { label: "Paramètres modifiés", icon: ICONS.sliders, ...TONES.brown },
    ACHIEVEMENT_UNLOCKED: { label: "Succès débloqué", icon: ICONS.award, ...TONES.green },
    QUIZ_COMPLETED: { label: "Quiz terminé", icon: ICONS.checkCircle, ...TONES.green },
    ACCOUNT_UPDATED: { label: "Compte modifié", icon: ICONS.userCheck, ...TONES.sky },
    SECURITY: { label: "Sécurité", icon: ICONS.shield, ...TONES.red },
};

// Fallback si le backend envoie un type inconnu
export const DEFAULT_TYPE_CONFIG: NotificationTypeConfig = {
    label: "Notification",
    icon: ICONS.quote,
    ...TONES.brown,
};