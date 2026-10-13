import { memo } from "react";
import { useUsersAdminContext } from "../../AdminContexts/UsersAdminContext";

interface DeleteUserPopProps {
    onSuccess: (message: string) => void;
}

const DeleteUserPop = ({ onSuccess }: DeleteUserPopProps) => {
    const {
        userDetails,
        setUserDetails,
        setShowDeleteUserPop,
        deleteUser,
        loadingDeleteUser,
        msg,
        setMsg,
    } = useUsersAdminContext();

    if (!userDetails) return null;

    const close = () => {
        setMsg(null);
        setShowDeleteUserPop(false);
        setUserDetails(null);
    };

    const confirmDelete = async () => {
        const success = await deleteUser(userDetails._id);

        // Le context ferme déjà le popup en cas de succès
        if (success) onSuccess("User deleted successfully!");
    };

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
            onClick={close}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-[#F8F5EF] rounded-xl p-6 w-[440px] max-w-full flex flex-col gap-4"
            >
                <p className="text-[#3E3025] text-[1.3em] font-bold">Delete User</p>

                <p className="text-[#3E3025] text-[15px] leading-6">
                    Are you sure you want to delete{" "}
                    <span className="font-[600]">
                        {userDetails.firstName} {userDetails.lastName}
                    </span>{" "}
                    ({userDetails.email})? This action cannot be undone.
                </p>

                {msg && <p className="text-red-900 text-[14px] font-[600]">{msg}</p>}

                <div className="flex flex-row justify-end gap-3 mt-2">
                    <button
                        type="button"
                        onClick={close}
                        disabled={loadingDeleteUser}
                        className="text-[#3E3025] border border-[#3E3025] text-[14px] font-[600] p-2 px-4 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={confirmDelete}
                        disabled={loadingDeleteUser}
                        className="bg-red-900 text-white text-[14px] font-[600] p-2 px-4 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loadingDeleteUser ? (
                            "Deleting..."
                        ) : (
                            <>
                                <i className="fa-solid fa-trash"></i> Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteUserPop);
