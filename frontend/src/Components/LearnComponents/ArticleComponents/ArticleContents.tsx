import { memo, useEffect, useState } from "react";

interface ArticleContentsProps {
    sections: { title: string }[];
    // Highlights the section currently being read (desktop sidebar only)
    trackActive?: boolean;
}

const ArticleContents = ({ sections, trackActive = false }: ArticleContentsProps) => {
    const [active, setActive] = useState<number>(0);

    useEffect(() => {
        if (!trackActive) return;

        const elements = sections
            .map((_, i) => document.getElementById(`section-${i}`))
            .filter((el): el is HTMLElement => el !== null);

        if (elements.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible[0]) {
                    setActive(Number(visible[0].target.id.replace("section-", "")));
                }
            },
            { rootMargin: "-90px 0px -60% 0px" }
        );

        elements.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [sections, trackActive]);

    const goTo = (e: React.MouseEvent, index: number) => {
        e.preventDefault();
        document
            .getElementById(`section-${index}`)
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <nav aria-label="In this article" className="flex flex-col gap-2">
            <h2 className="text-[1.1em] font-semibold text-gray-950">
                In this article
            </h2>

            <ul className="flex flex-col gap-1 border-l-2 border-l-gray-400">
                {sections.map((s, i) => (
                    <li key={i}>
                        <a
                            href={`#section-${i}`}
                            onClick={(e) => goTo(e, i)}
                            className={`block -ml-[2px] pl-3 py-1 text-[14px] leading-snug border-l-2
                            transition-colors duration-200 ${
                                trackActive && active === i
                                    ? "border-l-[#3E3025] text-[#3E3025] font-semibold"
                                    : "border-l-transparent text-gray-700 hover:text-[#3E3025]"
                            }`}
                        >
                            {s.title}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default memo(ArticleContents);