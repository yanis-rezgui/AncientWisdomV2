import { memo } from "react";
import { btnBase } from "./learnFormUtils";

interface AdminLearnCardProps {
    image?: string;
    title: string;
    subtitle?: string;
    description: string;
    badge?: string;
    footer: string;
    onUpdate: () => void;
    onDelete: () => void;
}

const AdminLearnCard = ({ image, title, subtitle, description, badge, footer, onUpdate, onDelete }: AdminLearnCardProps) => (
    <div className="flex flex-row w-[900px] bg-[#F8F5EF] rounded-lg
    justify-center items-start gap-4 p-3
    shadow-lg
    transition-all duration-300
    hover:-translate-y-1
    hover:shadow-xl
    max-[950px]:w-[600px]
    max-[620px]:w-[320px]
    max-[620px]:flex-col
    ">
        {image ? (
            <img
                src={image}
                alt={title}
                className="w-[200px] h-[150px] object-cover rounded-lg shrink-0 max-[620px]:w-full"
            />
        ) : (
            <div className="flex items-center justify-center w-[200px] h-[150px] rounded-lg bg-gray-200
            text-gray-500 shrink-0 max-[620px]:w-full">
                <i className="fa-solid fa-image"></i>
            </div>
        )}

        <div className="flex flex-col gap-1 w-full">
            <div className="flex flex-row items-center justify-between gap-2">
                <h3 className="text-[18px] font-[600] text-[#3E3025]">{title}</h3>
                {badge && (
                    <span className="text-[12px] font-[600] bg-[#3E3025] text-white rounded-full px-3 py-[2px] shrink-0">
                        {badge}
                    </span>
                )}
            </div>

            {subtitle && <p className="text-[15px] font-bold text-gray-600">{subtitle}</p>}

            <p className="text-[14px] text-gray-700 line-clamp-3">{description}</p>

            <div className="flex flex-row w-full justify-between items-center gap-2 max-[620px]:flex-col max-[620px]:items-start">
                <p className="text-[15px] text-gray-950">{footer}</p>

                <div className="flex flex-row justify-center items-center gap-2 mt-3">
                    <button onClick={onUpdate} className={`${btnBase} bg-green-900 text-white p-2`}>
                        <i className="fa-solid fa-pen-to-square"></i> Update
                    </button>

                    <button onClick={onDelete} className={`${btnBase} bg-red-900 text-white p-2`}>
                        <i className="fa-solid fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
);

export default memo(AdminLearnCard);
