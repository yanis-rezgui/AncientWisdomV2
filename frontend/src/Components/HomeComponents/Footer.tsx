import { memo } from "react";
import { motion, type Variants } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useSettingsContext } from "../../Contexts/SettingsContext";
// ⚠️ Adapte ce chemin à l'emplacement réel de ton SettingsContext


// ============================================================
// CONFIG
// ============================================================

// ⚠️ Mets ici le chemin (ou l'URL Cloudinary) de ton logo.
// Le texte du logo est foncé : utilise la version transparente sur ce fond clair.
const LOGO_SRC = "https://res.cloudinary.com/dub4fhabm/image/upload/v1792360941/ancient-wisdom-logo_up1v11.svg";

const DEFAULT_SLOGAN = "Your Gateway to Ancient Knowledge";

// Quick links = sections de la home (ids déjà présents dans tes sections)
const QUICK_LINKS = [
    { label: "Ancient Civilizations", id: "civilizations" },
    { label: "Historical Figures", id: "figures" },
    { label: "Historical Events", id: "events" },
    { label: "Games & Quizzes", id: "games" },
    { label: "Learn", id: "LearnPaths" },
    { label: "Articles", id: "articles" },
    { label: "Quotes of the Day", id: "quotes" },
    { label: "FAQ", id: "faq" },
];

// ⚠️ Même liste que ton Header : ajuste les routes si besoin
const NAV_LINKS = [
    { label: "Home", to: "/" },
    { label: "Explore", to: "/explore" },
    { label: "Eras", to: "/eras" },
    { label: "Historical Figures", to: "/figures" },
    { label: "Historical Events", to: "/events" },
    { label: "Games", to: "/games" },
    { label: "Quizzes", to: "/quizzes" },
    { label: "Quotes", to: "/quotes" },
    { label: "Articles", to: "/learn/articles" },
];

const LEGAL_LINKS = [
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Legal Notice", to: "/legal-notice" },
];

// Icônes Font Awesome (brands) selon le nom du réseau
const SOCIAL_ICONS: Record<string, string> = {
    facebook: "fa-brands fa-facebook-f",
    instagram: "fa-brands fa-instagram",
    twitter: "fa-brands fa-x-twitter",
    x: "fa-brands fa-x-twitter",
    youtube: "fa-brands fa-youtube",
    tiktok: "fa-brands fa-tiktok",
    linkedin: "fa-brands fa-linkedin-in",
    github: "fa-brands fa-github",
    pinterest: "fa-brands fa-pinterest-p",
    telegram: "fa-brands fa-telegram",
    whatsapp: "fa-brands fa-whatsapp",
    discord: "fa-brands fa-discord",
};

// ============================================================
// HELPERS
// ============================================================

interface SocialLink {
    platform: string;
    url: string;
}

// Accepte un objet { facebook: "url" } ou un tableau [{ platform, url }]
const getSocialLinks = (raw: unknown): SocialLink[] => {
    if (!raw) return [];

    if (Array.isArray(raw)) {
        return raw
            .map((item) => {
                const obj = (item ?? {}) as Record<string, unknown>;
                const platform = String(obj.platform ?? obj.name ?? obj.type ?? "");
                const url = String(obj.url ?? obj.link ?? "");
                return { platform, url };
            })
            .filter((link) => link.url.trim());
    }

    if (typeof raw === "object") {
        return Object.entries(raw as Record<string, unknown>)
            .filter(([, url]) => typeof url === "string" && url.trim())
            .map(([platform, url]) => ({ platform, url: url as string }));
    }

    return [];
};

const capitalize = (value: string) =>
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value;

// ============================================================
// ANIMATION VARIANTS
// ============================================================

const gridVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const columnVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" },
    },
};

// ============================================================
// SMALL PARTS
// ============================================================

const ColumnTitle = ({ children }: { children: string }) => (
    <>
        <h2 className="font-['Playfair_Display'] text-[1.1em] font-bold text-[#3E3025]">
            {children}
        </h2>
        <div className="mt-2 mb-4 h-[2px] w-10 bg-[#8C6A43]" />
    </>
);

const linkClasses =
    "group inline-flex items-center gap-1 text-[14px] text-gray-700 " +
    "transition-colors duration-200 hover:text-[#8C6A43]";

// ============================================================
// FOOTER
// ============================================================

const Footer = () => {
    const { settings } = useSettingsContext();
    const location = useLocation();

    const siteName = settings?.name || "Ancient Wisdom";
    const slogan = settings?.slogan || DEFAULT_SLOGAN;
    const email = settings?.email;
    const socials = getSocialLinks(settings?.socialLinks);

    // Sur la home : scroll doux vers la section. Ailleurs : navigation vers /#section
    const handleQuickLink = (e: React.MouseEvent, id: string) => {
        if (location.pathname !== "/") return;

        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `/#${id}`);
    };

    return (
        <footer className="w-full" aria-labelledby="footer-title">
            <h2 id="footer-title" className="sr-only">
                {siteName} footer
            </h2>

            <div className="flex w-full flex-col items-center bg-[#F3ECDD] px-5 pt-12 pb-8">
                {/* Ornement */}
                <div
                    aria-hidden="true"
                    className="mb-10 flex items-center gap-3 text-[#B08D57]"
                >
                    <span className="h-px w-16 bg-current/60" />
                    <span className="h-2 w-2 rotate-45 border border-current" />
                    <span className="h-px w-16 bg-current/60" />
                </div>

                <motion.div
                    variants={gridVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="grid w-full max-w-[1200px] grid-cols-1 gap-15
                    min-[560px]:grid-cols-2 min-lg:grid-cols-4"
                >
                    {/* BRAND */}
                    <motion.div
                        variants={columnVariants}
                        className="flex flex-col items-center text-center
                        min-[560px]:col-span-2 min-[560px]:items-start min-[560px]:text-left
                        min-lg:col-span-1"
                    >
                        <Link to="/" aria-label={`${siteName} — home`}>
                            <img
                                src={LOGO_SRC}
                                alt={`${siteName} logo`}
                                width={400}
                                height={400}
                                loading="lazy"
                                className="h-auto w-[250px] max-w-full"
                            />
                        </Link>

                        <p className="mt-3 font-['Playfair_Display'] italic text-[1.05em] text-[#3E3025]">
                            {slogan}
                        </p>
                    </motion.div>

                    {/* QUICK LINKS */}
                    <motion.nav variants={columnVariants} aria-label="Quick links">
                        <ColumnTitle>Quick Links</ColumnTitle>
                        <ul className="flex flex-col gap-2">
                            {QUICK_LINKS.map((link) => (
                                <li key={link.id}>
                                    <Link
                                        to={{ pathname: "/", hash: `#${link.id}` }}
                                        onClick={(e) => handleQuickLink(e, link.id)}
                                        className={linkClasses}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>

                    {/* NAVIGATION */}
                    <motion.nav variants={columnVariants} aria-label="Site navigation">
                        <ColumnTitle>Navigation</ColumnTitle>
                        <ul className="flex flex-col gap-2">
                            {NAV_LINKS.map((link) => (
                                <li key={link.to}>
                                    <Link to={link.to} className={linkClasses}>
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.nav>

                    {/* LEGAL + CONTACT */}
                    <motion.div variants={columnVariants} className="flex flex-col gap-8">
                        <nav aria-label="Legal">
                            <ColumnTitle>Legal</ColumnTitle>
                            <ul className="flex flex-col gap-2">
                                {LEGAL_LINKS.map((link) => (
                                    <li key={link.to}>
                                        <Link to={link.to} className={linkClasses}>
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {(email || socials.length > 0) && (
                            <div>
                                <ColumnTitle>Contact</ColumnTitle>

                                {email && (
                                    <a
                                        href={`mailto:${email}`}
                                        className={`${linkClasses} break-all`}
                                    >
                                        <i
                                            aria-hidden="true"
                                            className="fa-solid fa-envelope mr-2 text-[#8C6A43]"
                                        ></i>
                                        {email}
                                    </a>
                                )}

                                {socials.length > 0 && (
                                    <ul className="mt-4 flex flex-wrap gap-2">
                                        {socials.map((social) => {
                                            const key = social.platform.toLowerCase();
                                            const icon =
                                                SOCIAL_ICONS[key] ?? "fa-solid fa-link";

                                            return (
                                                <li key={`${key}-${social.url}`}>
                                                    <motion.a
                                                        href={social.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={`${siteName} on ${capitalize(social.platform)}`}
                                                        whileHover={{ y: -3 }}
                                                        whileTap={{ scale: 0.92 }}
                                                        className="flex h-9 w-9 items-center justify-center
                                                        rounded-full border border-[#8C6A43] text-[#8C6A43]
                                                        transition-colors duration-300
                                                        hover:bg-[#8C6A43] hover:text-[#F8F5EF]"
                                                    >
                                                        <i aria-hidden="true" className={icon}></i>
                                                    </motion.a>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                )}
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            </div>

            {/* BARRE DU BAS */}
            <div className="flex w-full flex-col items-center justify-between gap-2 bg-[#3E3025] px-5 py-4 min-[700px]:flex-row min-[700px]:px-10">
                <p className="text-center text-[13px] text-[#F5E6C8]/80">
                    © {new Date().getFullYear()} {siteName}. All rights reserved.
                </p>

                <ul className="flex items-center gap-4 text-[13px]">
                    {LEGAL_LINKS.map((link) => (
                        <li key={link.to}>
                            <Link
                                to={link.to}
                                className="text-[#C9A66B] transition-colors duration-200 hover:text-[#F5E6C8]"
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
};

export default memo(Footer);