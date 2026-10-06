import { memo, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../Contexts/AuthContext";
import Icon from "../../Icons/Icons";


// ============================================================
// Navigation
// ============================================================

type NavItem = {
    label: string;
    path: string;
    icon: string;
    badge?: number;
};


const MAIN_LINKS: NavItem[] = [
    {
        label: "Dashboard",
        path: "/admin/dashboard",
        icon: "LayoutDashboard",
    },
    {
        label: "Notifications",
        path: "/admin/notifications",
        icon: "Bell",
    },
    {
        label: "Quotes",
        path: "/admin/quotes",
        icon: "Quote",
    },
    {
        label: "Historical Eras",
        path: "/admin/eras",
        icon: "Landmark",
    },
    {
        label: "Figures",
        path: "/admin/figures",
        icon: "Users",
    },
    {
        label: "Historical Events",
        path: "/admin/events",
        icon: "ScrollText",
    },
    {
        label: "Users",
        path: "/admin/users",
        icon: "UserRound",
    },
];


const SETTINGS_LINKS: NavItem[] = [
    {
        label: "General",
        path: "/admin/general",
        icon: "Settings",
    },
    {
        label: "Profile",
        path: "/admin/profile",
        icon: "User",
    },
];


const AdminHeader = () => {

    const [showSide, setShowSide] = useState<boolean>(() => {
        const saved = localStorage.getItem("showSide");
        return saved ? JSON.parse(saved) : false;
    });

    const { signOut } = useAuthContext();

    const navigate = useNavigate();
    const location = useLocation();


    // ============================================================
    // Persist sidebar state
    // ============================================================

    useEffect(() => {
        localStorage.setItem(
            "showSide",
            JSON.stringify(showSide)
        );
    }, [showSide]);


    // ============================================================
    // Navigation
    // ============================================================

    const goTo = (path: string) => {

        navigate(path);

        // Close sidebar on mobile
        if (window.innerWidth < 600) {
            setShowSide(false);
        }
    };


    // ============================================================
    // Navigation item
    // ============================================================

    const NavLink = ({ item }: { item: NavItem }) => {

        const isActive =
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`);

        const badge = item.badge;


        return (
            <div
                onClick={() => goTo(item.path)}
                className={`
                    relative
                    flex
                    flex-row
                    items-center
                    gap-3
                    px-4
                    py-3
                    text-[14px]
                    cursor-pointer
                    border-l-4
                    transition-all
                    duration-150

                    ${
                        isActive
                            ? `
                                border-l-[#B89B72]
                                bg-[#B89B72]/10
                                text-[#3E3025]
                                font-semibold
                            `
                            : `
                                border-l-transparent
                                text-[#6B645D]
                                hover:bg-[#F3EFE8]
                                hover:text-[#3E3025]
                            `
                    }
                `}
            >

                {/* Icon */}
                <div className="relative flex items-center justify-center">

                    <Icon
                        name={item.icon}
                        size={20}
                    />

                    {badge != null && badge > 0 && (
                        <span
                            className="
                                absolute
                                -top-1.5
                                -right-2
                                min-w-[16px]
                                h-[16px]
                                px-1
                                flex
                                items-center
                                justify-center
                                rounded-full
                                bg-[#8B2E2E]
                                text-white
                                text-[10px]
                                font-bold
                                leading-none
                            "
                        >
                            {badge > 9 ? "9+" : badge}
                        </span>
                    )}

                </div>


                {/* Label */}
                <p>
                    {item.label}
                </p>

            </div>
        );
    };


    return (
        <>

            {/* ====================================================
                HEADER
            ==================================================== */}

            <header
                className="
                    w-full
                    flex
                    flex-row
                    items-center
                    px-5
                    h-[60px]
                    bg-[#171717]
                    text-[#B89B72]
                    fixed
                    top-0
                    z-50
                    border-b
                    border-[#2A2A2A]
                "
            >

                <div
                    className="
                        flex
                        flex-row
                        gap-5
                        items-center
                        max-[600px]:gap-3
                    "
                >

                    {/* Hamburger */}

                    <button
                        onClick={() => setShowSide(prev => !prev)}
                        aria-label="Open administration menu"
                        className="
                            flex
                            items-center
                            justify-center
                            w-8
                            h-8
                            cursor-pointer
                        "
                    >

                        <motion.div
                            animate={showSide ? "open" : "closed"}
                            className="relative w-7 h-6"
                        >

                            <motion.span
                                className="
                                    absolute
                                    left-0
                                    top-0
                                    w-7
                                    h-[2px]
                                    bg-[#B89B72]
                                    rounded
                                "
                                variants={{
                                    closed: {
                                        rotate: 0,
                                        y: 0,
                                    },
                                    open: {
                                        rotate: 45,
                                        y: 10,
                                    },
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                            />

                            <motion.span
                                className="
                                    absolute
                                    left-0
                                    top-[10px]
                                    w-7
                                    h-[2px]
                                    bg-[#B89B72]
                                    rounded
                                "
                                variants={{
                                    closed: {
                                        opacity: 1,
                                        x: 0,
                                    },
                                    open: {
                                        opacity: 0,
                                        x: -10,
                                    },
                                }}
                                transition={{
                                    duration: 0.2,
                                }}
                            />

                            <motion.span
                                className="
                                    absolute
                                    left-0
                                    top-[20px]
                                    w-7
                                    h-[2px]
                                    bg-[#B89B72]
                                    rounded
                                "
                                variants={{
                                    closed: {
                                        rotate: 0,
                                        y: 0,
                                    },
                                    open: {
                                        rotate: -45,
                                        y: -10,
                                    },
                                }}
                                transition={{
                                    duration: 0.3,
                                }}
                            />

                        </motion.div>

                    </button>


                    {/* Brand */}

                    <div
                        className="
                            flex
                            flex-row
                            items-center
                            gap-2
                            text-[1.35em]
                            max-[600px]:text-[1.15em]
                            font-semibold
                            tracking-wide
                        "
                    >

                        <span>
                            Ancient Wisdom
                        </span>

                        <Icon
                            name="Landmark"
                            size={24}
                        />

                    </div>

                </div>

            </header>


            {/* ====================================================
                SIDEBAR
            ==================================================== */}

            <AnimatePresence>

                {showSide && (

                    <>

                        {/* ==================================================
                            MOBILE OVERLAY
                        ================================================== */}

                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            exit={{
                                opacity: 0,
                            }}
                            onClick={() => setShowSide(false)}
                            className="
                                fixed
                                inset-0
                                bg-black/40
                                z-40
                                min-[601px]:hidden
                                mt-[60px]
                            "
                        />


                        {/* ==================================================
                            SIDEBAR
                        ================================================== */}

                        <motion.nav
                            initial={{
                                x: -250,
                                opacity: 0,
                            }}
                            animate={{
                                x: 0,
                                opacity: 1,
                            }}
                            exit={{
                                x: -250,
                                opacity: 0,
                            }}
                            transition={{
                                duration: 0.3,
                                ease: "easeInOut",
                            }}
                            className="
                                flex
                                flex-col
                                h-[calc(100%-60px)]
                                bg-[#FFFFFF]
                                shadow-2xl
                                z-50
                                fixed
                                left-0
                                w-[250px]
                                mt-[60px]
                                border-r
                                border-[#E7E0D6]
                            "
                        >

                            {/* ==================================================
                                SIDEBAR BRAND / DESCRIPTION
                            ================================================== */}

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-1
                                    p-4
                                    border-b
                                    border-[#E7E0D6]
                                    bg-[#F8F6F1]
                                "
                            >

                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        text-[1.35em]
                                        text-[#3E3025]
                                        font-semibold
                                    "
                                >

                                    <span>
                                        Ancient Wisdom
                                    </span>

                                </div>


                                <div
                                    className="
                                        text-[12px]
                                        text-[#7A726A]
                                        leading-5
                                    "
                                >
                                    Manage the historical knowledge
                                    and content of the platform.
                                </div>

                            </div>


                            {/* ==================================================
                                MAIN MENU
                            ================================================== */}

                            <div className="flex-1 overflow-y-auto">

                                <h3
                                    className="
                                        text-[11px]
                                        tracking-[0.12em]
                                        text-[#9A9289]
                                        font-semibold
                                        px-4
                                        pt-5
                                        pb-2
                                        uppercase
                                    "
                                >
                                    Content
                                </h3>


                                <div className="flex flex-col">

                                    {MAIN_LINKS.map(item => (
                                        <NavLink
                                            key={item.path}
                                            item={item}
                                        />
                                    ))}

                                </div>

                            </div>


                            {/* ==================================================
                                SETTINGS
                            ================================================== */}

                            <div
                                className="
                                    border-t
                                    border-[#E7E0D6]
                                    bg-[#FFFFFF]
                                "
                            >

                                <h3
                                    className="
                                        text-[11px]
                                        tracking-[0.12em]
                                        text-[#9A9289]
                                        font-semibold
                                        px-4
                                        pt-4
                                        pb-2
                                        uppercase
                                    "
                                >
                                    Administration
                                </h3>


                                <div className="flex flex-col">

                                    {SETTINGS_LINKS.map(item => (
                                        <NavLink
                                            key={item.path}
                                            item={item}
                                        />
                                    ))}


                                    {/* Logout */}

                                    <div
                                        onClick={signOut}
                                        className="
                                            flex
                                            flex-row
                                            items-center
                                            gap-3
                                            px-4
                                            py-3
                                            text-[#8B2E2E]
                                            text-[14px]
                                            border-l-4
                                            border-l-transparent
                                            hover:bg-[#8B2E2E]/5
                                            cursor-pointer
                                            transition-colors
                                            duration-150
                                        "
                                    >

                                        <Icon
                                            name="LogOut"
                                            size={20}
                                        />

                                        <p>
                                            Sign out
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </motion.nav>

                    </>
                )}

            </AnimatePresence>

        </>
    );
};


export default memo(AdminHeader);