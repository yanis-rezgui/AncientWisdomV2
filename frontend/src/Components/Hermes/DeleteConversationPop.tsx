import { memo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useConversationContext } from "../../Contexts/ConversationContext";
import { useHermesContext } from "../../Contexts/HermesContext";

const DeleteConversationPop = () => {
    const navigate = useNavigate();

    const {
        conversationToDelete,
        setConversationToDelete,
        deletingConversationId,
    } = useConversationContext();

    const { conversationId, removeConversation } = useHermesContext();

    const deleting = deletingConversationId !== null;

    useEffect(() => {
        if (!conversationToDelete) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !deleting) setConversationToDelete(null);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [conversationToDelete, deleting, setConversationToDelete]);

    const handleDelete = async () => {
        if (!conversationToDelete) return;

        const id = conversationToDelete._id;
        const wasActive = id === conversationId;

        const deleted = await removeConversation(id);

        if (deleted && wasActive) navigate("/hermes");
    };

    return (
        <AnimatePresence>
            {conversationToDelete && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => !deleting && setConversationToDelete(null)}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5"
                >
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="delete-conversation-title"
                        initial={{ opacity: 0, y: 20, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.97 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        onClick={(e) => e.stopPropagation()}
                        className="flex w-full max-w-[420px] flex-col gap-3 rounded-lg border border-gray-400
                        bg-[#F5E6C8] p-6 shadow-xl"
                    >
                        <h2
                            id="delete-conversation-title"
                            className="font-['Playfair_Display'] text-[1.4em] font-bold text-gray-950"
                        >
                            Delete conversation?
                        </h2>

                        <p className="text-[14px] text-gray-700">
                            "<span className="font-semibold">{conversationToDelete.title}</span>" and all
                            its messages will be permanently deleted. This action cannot be undone.
                        </p>

                        <div className="mt-2 flex flex-row justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setConversationToDelete(null)}
                                disabled={deleting}
                                className="rounded-lg border border-[#3E3025] px-5 py-2 text-[13px] font-semibold
                                text-[#3E3025] transition-colors duration-200 hover:bg-[#E3CFA3]
                                disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={() => void handleDelete()}
                                disabled={deleting}
                                className="flex flex-row items-center gap-2 rounded-lg bg-[#7A2E24] px-5 py-2 text-[13px]
                                font-semibold text-white transition-opacity duration-200 hover:opacity-80
                                disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {deleting && (
                                    <Loader2 size={14} className="animate-spin" aria-hidden="true" />
                                )}
                                Delete
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default memo(DeleteConversationPop);