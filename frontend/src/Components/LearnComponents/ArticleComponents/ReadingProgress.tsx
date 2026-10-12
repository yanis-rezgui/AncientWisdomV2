import { memo, useEffect, useRef } from "react";

const ReadingProgress = () => {
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const update = () => {
            const doc = document.documentElement;
            const scrollable = doc.scrollHeight - doc.clientHeight;
            const ratio = scrollable > 0 ? doc.scrollTop / scrollable : 0;

            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, ratio))})`;
            }
        };

        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);

        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] z-[60] pointer-events-none">
            <div
                ref={barRef}
                className="h-full w-full bg-[#3E3025] origin-left"
                style={{ transform: "scaleX(0)" }}
            />
        </div>
    );
};

export default memo(ReadingProgress);