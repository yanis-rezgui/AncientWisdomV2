import { memo, useState } from "react";
import Pagination from "../Components/Pagination/Pagination";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import UsersFilter from "../AdminComponents/AdminUsersComponents/UsersFilter";
import AdminUserCard from "../AdminComponents/AdminUsersComponents/AdminUserCard";
import UserFormPop from "../AdminComponents/AdminUsersComponents/UserFormPop";
import DeleteUserPop from "../AdminComponents/AdminUsersComponents/DeleteUserPop";
import { useUsersAdminContext } from "../AdminContexts/UsersAdminContext";


const AdminUsers = () => {
    const {
        allUsers,
        loadingAllUsers,
        pagination,
        currentPage,
        setCurrentPage,
        pageLimit,
        setPageLimit,
        showAddUserPop,
        setShowAddUserPop,
        showUpdateUserPop,
        showDeleteUserPop,
        setMsg,
        msg,
    } = useUsersAdminContext();

    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const showSuccess = (message: string) => setToast({ message, type: "success" });

    const anyPopupOpen = showAddUserPop || showUpdateUserPop || showDeleteUserPop;
    const totalUsers = pagination?.total ?? 0;

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] pb-20">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-[900px] flex flex-row  items-center justify-between mt-10
            max-[950px]:w-[600px] max-[650px]:flex-col max-[650px]:justify-center
            max-[650px]:px-4 max-[650px]:gap-3
            ">
                <h2 className="text-[#3E3025] text-[1.5em] font-[600]">
                    Users
                </h2>

                <button
                    type="button"
                    onClick={() => {
                        setMsg(null);
                        setShowAddUserPop(true);
                    }}
                    className="bg-[#3E3025] text-white text-[14px] font-[600]
                    p-2 rounded-lg cursor-pointer transition-opacity duration-200
                    hover:opacity-80 active:opacity-60
                    ">
                    + Add User
                </button>
            </div>

            <p className="text-[#3E3025] mt-5 px-4 text-center">
                Manage the accounts registered on Ancient Wisdom, Add, Update And Delete
            </p>

            <UsersFilter />

            <div className="flex flex-row justify-center items-center gap-2 mt-5 font-[600] text-[18px]">
                <p>Total Users :</p>
                <p>{totalUsers}</p>
            </div>

            {/* Erreur de chargement (hors popups, qui affichent leurs propres erreurs) */}
            {msg && !anyPopupOpen && (
                <p className="text-red-900 text-[14px] font-[600] mt-4 px-4 text-center">{msg}</p>
            )}

            <div className="flex flex-col justify-center items-center gap-4 mt-5">
                {loadingAllUsers && allUsers.length === 0 ? (
                    <p className="text-[#3E3025] mt-10 text-center font-bold">Loading ...</p>
                ) : allUsers.length === 0 ? (
                    <p className="text-[#3E3025] mt-10 text-center">No users found.</p>
                ) : (
                    allUsers.map((u) => (
                        <AdminUserCard user={u} key={u._id} />
                    ))
                )}
            </div>

            <Pagination
                page={currentPage}
                totalPages={pagination?.totalPages ?? 1}
                totalItems={totalUsers}
                limit={pageLimit}
                setPage={setCurrentPage}
                setLimit={setPageLimit}
            />

            {showAddUserPop && <UserFormPop mode="add" onSuccess={showSuccess} />}
            {showUpdateUserPop && <UserFormPop mode="update" onSuccess={showSuccess} />}
            {showDeleteUserPop && <DeleteUserPop onSuccess={showSuccess} />}
        </section>
    );
};

export default memo(AdminUsers);