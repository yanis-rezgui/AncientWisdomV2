import { memo } from "react";
import { Loader2, Trash2 } from "lucide-react";

interface Props {
    kind: string;
    name: string;
    loading: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const DeleteChallengePop = ({ kind, name, loading, onConfirm, onClose }: Props) => (
    <div
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
        onClick={() => !loading && onClose()}
    >
        <div
            role="dialog"
            aria-modal="true"
            className="flex w-full max-w-md flex-col gap-4 rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
        >
            <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#8B2E2E]/10 p-3 text-[#8B2E2E]">
                    <Trash2 size={22} />
                </span>
                <h2 className="text-[1.15em] font-semibold text-[#3E3025]">
                    Delete this {kind}?
                </h2>
            </div>

            <p className="text-[14px] leading-6 text-[#6B645D]">
                <strong className="text-[#3E3025]">{name}</strong> will be
                permanently deleted, along with its images. This action cannot
                be undone.
            </p>

            <div className="flex justify-end gap-3 max-[600px]:flex-col-reverse">
                <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="rounded-lg border border-[#E7E0D6] px-5 py-2.5 text-[14px] font-medium text-[#3E3025] hover:border-[#B89B72] disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    onClick={onConfirm}
                    disabled={loading}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#8B2E2E] px-5 py-2.5 text-[14px] font-medium text-white hover:bg-[#6F2323] disabled:opacity-60"
                >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    {loading ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    </div>
);

export default memo(DeleteChallengePop);
