import { memo } from "react";
import type { QuizStatus } from "../../Types/Types";

const statusStyle: Record<QuizStatus, string> = {
    draft: "bg-gray-200 text-gray-700 border-gray-400/40",
    published: "bg-green-900/10 text-green-900 border-green-900/30",
    archived: "bg-[#A67C2D]/15 text-[#7A5A14] border-[#A67C2D]/40",
};

const QuizStatusBadge = ({ status }: { status: QuizStatus }) => (
    <span className={`text-[12px] font-[600] px-2 py-[2px] rounded-full border capitalize ${statusStyle[status]}`}>
        {status}
    </span>
);

export default memo(QuizStatusBadge);