import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type { User, Pagination } from "../Types/Types";
import { useAuthContext } from "../Contexts/AuthContext";

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/users`;

// =========================================================
// TYPES
// =========================================================

interface UsersAdminContextType {
    // USERS
    allUsers: User[];
    loadingAllUsers: boolean;
    getAllUsers: () => Promise<void>;

    // FILTERS
    search: string;
    setSearch: (search: string) => void;

    role: string;
    setRole: (role: string) => void;

    // PAGINATION
    currentPage: number;
    setCurrentPage: (page: number) => void;

    pageLimit: number;
    setPageLimit: (limit: number) => void;

    pagination: Pagination | null;

    // ADD
    addUser: (
        firstName: string,
        lastName: string,
        email: string,
        password1: string,
        password2: string,
        role: string
    ) => Promise<boolean>;

    loadingAddUser: boolean;

    // UPDATE
    updateUser: (
        id: string,
        firstName: string,
        lastName: string,
        role: string
    ) => Promise<boolean>;

    loadingUpdateUser: boolean;

    // DELETE
    deleteUser: (id: string) => Promise<boolean>;

    loadingDeleteUser: boolean;

    // POPUPS
    showAddUserPop: boolean;
    setShowAddUserPop: (show: boolean) => void;

    showUpdateUserPop: boolean;
    setShowUpdateUserPop: (show: boolean) => void;

    showDeleteUserPop: boolean;
    setShowDeleteUserPop: (show: boolean) => void;

    // DETAILS
    userDetails: User | null;
    setUserDetails: (user: User | null) => void;

    // MESSAGE
    msg: string | null;
    setMsg: (message: string | null) => void;
}

const UsersAdminContext =
    createContext<UsersAdminContextType | null>(null);

// =========================================================
// PROVIDER
// =========================================================

export const UsersAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const { token, user } = useAuthContext();

    // USERS
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [loadingAllUsers, setLoadingAllUsers] = useState(false);

    // FILTERS
    const [search, setSearch] = useState("");
    const [role, setRole] = useState("");

    // PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const [pageLimit, setPageLimit] = useState(10);
    const [pagination, setPagination] = useState<Pagination | null>(null);

    // LOADING STATES
    const [loadingAddUser, setLoadingAddUser] = useState(false);
    const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
    const [loadingDeleteUser, setLoadingDeleteUser] = useState(false);

    // POPUPS
    const [showAddUserPop, setShowAddUserPop] = useState(false);
    const [showUpdateUserPop, setShowUpdateUserPop] = useState(false);
    const [showDeleteUserPop, setShowDeleteUserPop] = useState(false);

    // DETAILS AND MESSAGE
    const [userDetails, setUserDetails] = useState<User | null>(null);
    const [msg, setMsg] = useState<string | null>(null);

    // =====================================================
    // GET ALL USERS
    // =====================================================

    const getAllUsers = useCallback(async (): Promise<void> => {
        if (!token || user?.role !== "ADMIN") return;

        try {
            setLoadingAllUsers(true);
            setMsg(null);

            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(pageLimit),
            });

            if (search.trim()) {
                params.set("search", search.trim());
            }

            if (role) {
                params.set("role", role);
            }

            const res = await fetch(`${API_URL}?${params.toString()}`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.message || "Failed to fetch users"
                );
            }

            setAllUsers(data.data ?? []);
            setPagination(data.pagination ?? null);
        } catch (error) {
            console.error("getAllUsers:", error);
            setMsg(
                error instanceof Error
                    ? error.message
                    : "Network error while fetching users"
            );
        } finally {
            setLoadingAllUsers(false);
        }
    }, [token, user?.role, currentPage, pageLimit, search, role]);

    // =====================================================
    // ADD USER
    // =====================================================

    const addUser = async (
        firstName: string,
        lastName: string,
        email: string,
        password1: string,
        password2: string,
        role: string
    ): Promise<boolean> => {
        try {
            setLoadingAddUser(true);
            setMsg(null);

            const res = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    password1,
                    password2,
                    role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to create user");
            }

            setShowAddUserPop(false);
            setCurrentPage(1);
            await getAllUsers();

            return true;
        } catch (error) {
            console.error("addUser:", error);
            setMsg(
                error instanceof Error
                    ? error.message
                    : "Network error while creating user"
            );
            return false;
        } finally {
            setLoadingAddUser(false);
        }
    };

    // =====================================================
    // UPDATE USER
    // =====================================================

    const updateUser = async (
        id: string,
        firstName: string,
        lastName: string,
        role: string
    ): Promise<boolean> => {
        try {
            setLoadingUpdateUser(true);
            setMsg(null);

            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    role,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to update user");
            }

            setShowUpdateUserPop(false);
            setUserDetails(null);

            await getAllUsers();

            return true;
        } catch (error) {
            console.error("updateUser:", error);
            setMsg(
                error instanceof Error
                    ? error.message
                    : "Network error while updating user"
            );
            return false;
        } finally {
            setLoadingUpdateUser(false);
        }
    };

    // =====================================================
    // DELETE USER
    // =====================================================

    const deleteUser = async (id: string): Promise<boolean> => {
        try {
            setLoadingDeleteUser(true);
            setMsg(null);

            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || "Failed to delete user");
            }

            setShowDeleteUserPop(false);
            setUserDetails(null);

            await getAllUsers();

            return true;
        } catch (error) {
            console.error("deleteUser:", error);
            setMsg(
                error instanceof Error
                    ? error.message
                    : "Network error while deleting user"
            );
            return false;
        } finally {
            setLoadingDeleteUser(false);
        }
    };

    // =====================================================
    // RESET PAGE WHEN FILTERS CHANGE
    // =====================================================

    useEffect(() => {
        setCurrentPage(1);
    }, [search, role, pageLimit]);

    // =====================================================
    // FETCH USERS
    // =====================================================

    useEffect(() => {
        void getAllUsers();
    }, [getAllUsers]);

    // =====================================================
    // PROVIDER
    // =====================================================

    return (
        <UsersAdminContext.Provider
            value={{
                allUsers,
                loadingAllUsers,
                getAllUsers,

                search,
                setSearch,
                role,
                setRole,

                currentPage,
                setCurrentPage,
                pageLimit,
                setPageLimit,
                pagination,

                addUser,
                loadingAddUser,

                updateUser,
                loadingUpdateUser,

                deleteUser,
                loadingDeleteUser,

                showAddUserPop,
                setShowAddUserPop,
                showUpdateUserPop,
                setShowUpdateUserPop,
                showDeleteUserPop,
                setShowDeleteUserPop,

                userDetails,
                setUserDetails,

                msg,
                setMsg,
            }}
        >
            {children}
        </UsersAdminContext.Provider>
    );
};

// =========================================================
// HOOK
// =========================================================

export const useUsersAdminContext = () => {
    const context = useContext(UsersAdminContext);

    if (!context) {
        throw new Error(
            "useUsersAdminContext must be used inside UsersAdminProvider"
        );
    }

    return context;
};