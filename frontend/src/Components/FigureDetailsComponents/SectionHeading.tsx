// SectionHeading.tsx
import { memo } from "react";

const SectionHeading = ({ id, title }: { id: string; title: string }) => (
    <div>
        <h2 id={id} className="text-[1.5em] font-bold text-[#3E3025]">
            {title}
        </h2>
        <span className="mt-2 block h-[3px] w-12 rounded bg-[#8C6A43]" />
    </div>
);

export default memo(SectionHeading);