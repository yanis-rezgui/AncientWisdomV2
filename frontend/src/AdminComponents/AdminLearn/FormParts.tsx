import type { ReactNode } from "react";
import { btnBase, labelClass } from "./learnFormUtils";

export const Field = ({ label, children }: { label: string; children: ReactNode }) => (
    <div className="flex flex-col gap-1 w-full">
        <label className={labelClass}>{label}</label>
        {children}
    </div>
);

interface FormActionsProps {
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    submitIcon: string;
    onCancel: () => void;
}

export const FormActions = ({ loading, submitLabel, loadingLabel, submitIcon, onCancel }: FormActionsProps) => (
    <div className="flex flex-row gap-3 items-center justify-end w-full mt-3
    max-[600px]:flex-col max-[600px]:items-stretch">
        <button
            type="button"
            onClick={onCancel}
            className={`${btnBase} bg-gray-200 text-[#3E3025] text-[14px] rounded-[5px]`}
        >
            Cancel
        </button>

        <button
            type="submit"
            disabled={loading}
            className={`${btnBase} bg-[#3E3025] text-white text-[14px] rounded-[5px]`}
        >
            {loading ? (
                <><i className="fa-solid fa-spinner fa-spin"></i> {loadingLabel}</>
            ) : (
                <><i className={submitIcon}></i> {submitLabel}</>
            )}
        </button>
    </div>
);
