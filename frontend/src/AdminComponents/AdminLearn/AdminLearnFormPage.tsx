import { memo, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { btnBase } from "./learnFormUtils";

interface AdminLearnFormPageProps {
    title: string;
    subtitle: string;
    backPath: string;
    backLabel: string;
    loading?: boolean;
    error?: string;
    onDelete?: () => void;
    children: ReactNode;
}

const AdminLearnFormPage = ({
    title, subtitle, backPath, backLabel, loading = false, error = "", onDelete, children
}: AdminLearnFormPageProps) => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col w-full items-center gap-5 p-5">

            <div className="flex flex-col w-full max-w-[900px] gap-3">
                <span
                    onClick={() => navigate(backPath)}
                    className="text-[13px] text-gray-600 cursor-pointer hover:text-[#3E3025] w-fit"
                >
                    <i className="fa-solid fa-arrow-left"></i> {backLabel}
                </span>

                <div className="flex flex-row justify-between items-center gap-3">
                    <div className="flex flex-col">
                        <h1 className="text-[22px] font-bold text-[#3E3025]">{title}</h1>
                        <p className="text-[14px] text-gray-600">{subtitle}</p>
                    </div>

                    {onDelete && !loading && !error && (
                        <button onClick={onDelete} className={`${btnBase} bg-red-900 text-white`}>
                            <i className="fa-solid fa-trash"></i> Delete
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col w-full max-w-[900px] items-center">
                {loading ? (
                    <p className="text-[15px] text-gray-600">
                        <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                    </p>
                ) : error ? (
                    <p className="text-[14px] text-red-800 font-[600]">{error}</p>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default memo(AdminLearnFormPage);
