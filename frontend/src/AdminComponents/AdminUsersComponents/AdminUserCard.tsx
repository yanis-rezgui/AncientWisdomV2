import { memo } from "react";
import type { User } from "../../Types/Types";
import { useUsersAdminContext } from "../../AdminContexts/UsersAdminContext";
import { useAuthContext } from "../../Contexts/AuthContext";
import { formatDate } from "./userFormUtils";

const AdminUserCard = ({ user }: { user: User }) => {
    const { setUserDetails, setShowUpdateUserPop, setShowDeleteUserPop, setMsg } =
        useUsersAdminContext();
    const { user: currentUser } = useAuthContext();

    const isMe = currentUser?._id === user._id;
    const isAdmin = user.role === "ADMIN";

    const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

    return (
        <div
            className="w-[900px] bg-[#F8F5EF] rounded-xl p-4 flex flex-row items-center justify-between gap-4
            border border-[#3E3025]/15
            max-[950px]:w-[600px] max-[650px]:w-[92vw] max-[650px]:flex-col max-[650px]:items-start"
        >
            <div className="flex flex-row items-center gap-4 min-w-0">
                <div
                    className="w-12 h-12 shrink-0 rounded-full bg-[#3E3025] text-white font-bold
                    flex items-center justify-center text-[16px]"
                >
                    {initials || "?"}
                </div>

                <div className="flex flex-col min-w-0">
                    <div className="flex flex-row flex-wrap items-center gap-2">
                        <p className="text-[#3E3025] font-[600] text-[17px] break-words">
                            {user.firstName} {user.lastName}
                        </p>

                        <span
                            className={`text-[11px] font-[600] px-2 py-[2px] rounded-full ${
                                isAdmin
                                    ? "bg-[#3E3025] text-white"
                                    : "bg-[#3E3025]/10 text-[#3E3025]"
                            }`}
                        >
                            {user.role}
                        </span>

                        {isMe && (
                            <span className="text-[11px] font-[600] px-2 py-[2px] rounded-full bg-green-900/15 text-green-900">
                                You
                            </span>
                        )}
                    </div>

                    <p className="text-[#3E3025]/80 text-[14px] break-all">{user.email}</p>
                    <p className="text-[#3E3025]/60 text-[12px] mt-1">
                        Joined {formatDate(user.createdAt)}
                    </p>
                </div>
            </div>

            <div className="flex flex-row gap-2 shrink-0">
                <button
                    type="button"
                    onClick={() => {
                        setMsg(null);
                        setUserDetails(user);
                        setShowUpdateUserPop(true);
                    }}
                    className="bg-[#3E3025] text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    <i className="fa-solid fa-pen"></i> Update
                </button>

                <button
                    type="button"
                    disabled={isMe}
                    title={isMe ? "You cannot delete your own account" : "Delete user"}
                    onClick={() => {
                        setMsg(null);
                        setUserDetails(user);
                        setShowDeleteUserPop(true);
                    }}
                    className="bg-red-900 text-white text-[13px] font-[600] p-2 px-3 rounded-lg
                    cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                    disabled:opacity-40 disabled:cursor-not-allowed"
                >
                    <i className="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    );
};

export default memo(AdminUserCard);
