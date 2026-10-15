import { memo, useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { btnBase, inputClass } from "./learnFormUtils";
import Toast from "../AdminErasComponents/Toast";

interface AdminLearnListProps {
    title: string;
    subtitle: string;
    total: number;
    search: string;
    onSearch: (value: string) => void;
    addLabel: string;
    addPath: string;
    loading: boolean;
    errorMsg: string;
    isEmpty: boolean;
    emptyLabel: string;
    page: number;
    totalPages: number;
    setPage: (page: number) => void;
    // Lien de retour : par défaut la page Learn (comportement existant)
    backPath?: string;
    backLabel?: string;
    children: ReactNode;
}

const widthClass = "w-[900px] max-[950px]:w-[600px] max-[620px]:w-[320px]";

const AdminLearnList = ({
    title, subtitle, total, search, onSearch, addLabel, addPath,
    loading, errorMsg, isEmpty, emptyLabel, page, totalPages, setPage,
    backPath = "/admin/learn", backLabel = "Back to Learn", children
}: AdminLearnListProps) => {

    const navigate = useNavigate();
    const location = useLocation();

    const [term, setTerm] = useState<string>(search);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);
    const closeToast = useCallback(() => setSuccessMsg(null), []);

    // Message de succès transmis par les pages Ajout / Update / Delete
    useEffect(() => {
        const success = (location.state as { success?: string } | null)?.success;
        if (success) {
            setSuccessMsg(success);
            navigate(location.pathname, { replace: true, state: null });
        }
    }, [location.state, location.pathname, navigate]);

    // Recherche avec debounce
    useEffect(() => {
        if (term === search) return;
        const timer = setTimeout(() => onSearch(term), 400);
        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [term]);

    return (
        <div className="flex flex-col w-full items-center gap-5 p-5">

            {successMsg && <Toast message={successMsg} type="success" onClose={closeToast} />}

            {/* ================= HEADER ================= */}
            <div className={`flex flex-col gap-3 ${widthClass}`}>
                <span
                    onClick={() => navigate(backPath)}
                    className="text-[13px] text-gray-600 cursor-pointer hover:text-[#3E3025] w-fit"
                >
                    <i className="fa-solid fa-arrow-left"></i> {backLabel}
                </span>

                <div className="flex flex-row justify-between items-center gap-3 max-[620px]:flex-col max-[620px]:items-stretch">
                    <div className="flex flex-col">
                        <h1 className="text-[22px] font-bold text-[#3E3025]">
                            {title} <span className="text-gray-500 text-[16px]">({total})</span>
                        </h1>
                        <p className="text-[14px] text-gray-600">{subtitle}</p>
                    </div>

                    <button
                        onClick={() => navigate(addPath)}
                        className={`${btnBase} bg-[#3E3025] text-white text-[14px] rounded-[5px]`}
                    >
                        <i className="fa-solid fa-plus"></i> {addLabel}
                    </button>
                </div>

                <input
                    type="text"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder={`Search ${title.toLowerCase()}...`}
                    className={inputClass}
                />
            </div>

            {/* ================= CONTENT ================= */}
            {loading && (
                <p className="text-[15px] text-gray-600">
                    <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                </p>
            )}

            {errorMsg && !loading && (
                <p className="text-[14px] text-red-800 font-[600]">{errorMsg}</p>
            )}

            {!loading && !errorMsg && isEmpty && (
                <p className="text-[15px] text-gray-600">{emptyLabel}</p>
            )}

            <div className="flex flex-col gap-4 items-center">{children}</div>

            {/* ================= PAGINATION ================= */}
            {totalPages > 1 && (
                <div className="flex flex-row items-center gap-3 mt-2">
                    <button
                        onClick={() => setPage(page - 1)}
                        disabled={page <= 1 || loading}
                        className={`${btnBase} bg-gray-200 text-[#3E3025]`}
                    >
                        <i className="fa-solid fa-chevron-left"></i> Previous
                    </button>

                    <span className="text-[14px] font-[600] text-[#3E3025]">
                        Page {page} / {totalPages}
                    </span>

                    <button
                        onClick={() => setPage(page + 1)}
                        disabled={page >= totalPages || loading}
                        className={`${btnBase} bg-gray-200 text-[#3E3025]`}
                    >
                        Next <i className="fa-solid fa-chevron-right"></i>
                    </button>
                </div>
            )}
        </div>
    );
};

export default memo(AdminLearnList);