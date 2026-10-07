import { memo, useEffect } from "react";

interface ToastProps {
    message: string;
    type?: "success" | "error";
    onClose: () => void;
}

const Toast = ({ message, type = "success", onClose }: ToastProps) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div
            className={`fixed top-5 right-5 z-50 flex flex-row items-center gap-2 
            px-4 py-3 rounded-[8px] shadow-2xl text-white font-[600] text-[14px]
            max-[600px]:left-3 max-[600px]:right-3 max-[600px]:top-3
            ${type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
            <i className={`fa-solid ${type === "success" ? "fa-circle-check" : "fa-circle-exclamation"}`}></i>
            <p>{message}</p>
            <i onClick={onClose} className="fa-solid fa-xmark cursor-pointer ml-2 opacity-70 hover:opacity-100"></i>
        </div>
    );
};

export default memo(Toast);