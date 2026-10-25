import { memo } from "react";
import { motion } from "framer-motion";

interface PageLoaderProps {
    fullScreen?: boolean;
}

const PageLoader = ({ fullScreen = false }: PageLoaderProps) => {
    return (
        <div
            role="status"
            aria-label="Loading page"
            className={`flex w-full flex-col items-center justify-center gap-6 bg-[#E8E2D6] px-5
            ${fullScreen ? "fixed inset-0 z-50" : "min-h-[60vh]"}`}
        >
            <motion.img
                src="/ancient-wisdom-emblem.svg"
                alt=""
                aria-hidden="true"
                width={96}
                height={96}
                draggable={false}
                animate={{ opacity: [0.6, 1, 0.6], scale: [0.97, 1, 0.97] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative h-[2px] w-40 overflow-hidden bg-[#8C6A43]/25" aria-hidden="true">
                <motion.div
                    className="absolute inset-y-0 w-2/5 bg-[#8C6A43]"
                    animate={{ x: ["-100%", "250%"] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            <span className="sr-only">Loading…</span>
        </div>
    );
};

export default memo(PageLoader);