import { memo, useState } from "react";
import { useUsersAdminContext } from "../../AdminContexts/UsersAdminContext";
import {
    ROLE_OPTIONS,
    emptyUserForm,
    inputClass,
    labelClass,
    userToForm,
    validateUserForm,
    type UserFormState,
} from "./userFormUtils";

interface UserFormPopProps {
    mode: "add" | "update";
    onSuccess: (message: string) => void;
}

const UserFormPop = ({ mode, onSuccess }: UserFormPopProps) => {
    const {
        addUser,
        updateUser,
        loadingAddUser,
        loadingUpdateUser,
        userDetails,
        setUserDetails,
        setShowAddUserPop,
        setShowUpdateUserPop,
        msg,
        setMsg,
    } = useUsersAdminContext();

    const isAdd = mode === "add";
    const loading = isAdd ? loadingAddUser : loadingUpdateUser;

    // Le popup est monté seulement quand il est affiché : l'état initial suffit
    const [form, setForm] = useState<UserFormState>(
        !isAdd && userDetails ? userToForm(userDetails) : emptyUserForm
    );
    const [localError, setLocalError] = useState<string | null>(null);

    const setField = (field: keyof UserFormState, value: string) =>
        setForm((prev) => ({ ...prev, [field]: value }));

    const close = () => {
        setMsg(null);
        if (isAdd) {
            setShowAddUserPop(false);
        } else {
            setShowUpdateUserPop(false);
            setUserDetails(null);
        }
    };

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLocalError(null);
        setMsg(null);

        const validationError = validateUserForm(form, mode);
        if (validationError) {
            setLocalError(validationError);
            return;
        }

        let success = false;

        if (isAdd) {
            success = await addUser(
                form.firstName.trim(),
                form.lastName.trim(),
                form.email.trim(),
                form.password1,
                form.password2,
                form.role
            );
        } else if (userDetails) {
            success = await updateUser(
                userDetails._id,
                form.firstName.trim(),
                form.lastName.trim(),
                form.role
            );
        }

        // Le context ferme déjà le popup en cas de succès
        if (success) {
            onSuccess(isAdd ? "User added successfully!" : "User updated successfully!");
        }
    };

    const error = localError || msg;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4"
            onClick={close}
        >
            <form
                onSubmit={submit}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#F8F5EF] rounded-xl p-6 w-[480px] max-w-full max-h-[90vh] overflow-y-auto
                flex flex-col gap-4"
            >
                <div className="flex flex-row justify-between items-center">
                    <p className="text-[#3E3025] text-[1.3em] font-bold">
                        {isAdd ? "Add A New User" : "Update User"}
                    </p>
                    <button
                        type="button"
                        onClick={close}
                        className="text-[#3E3025] text-[18px] cursor-pointer transition-opacity duration-200
                        hover:opacity-80 active:opacity-60"
                    >
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="flex flex-row gap-3 max-[480px]:flex-col">
                    <div className="flex flex-col flex-1">
                        <label className={labelClass}>First name</label>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={(e) => setField("firstName", e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div className="flex flex-col flex-1">
                        <label className={labelClass}>Last name</label>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={(e) => setField("lastName", e.target.value)}
                            className={inputClass}
                        />
                    </div>
                </div>

                <div className="flex flex-col">
                    <label className={labelClass}>Email</label>
                    <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setField("email", e.target.value)}
                        disabled={!isAdd}
                        className={inputClass}
                    />
                    {!isAdd && (
                        <p className="text-[12px] text-[#3E3025]/60 mt-1">
                            Email cannot be changed.
                        </p>
                    )}
                </div>

                {isAdd && (
                    <div className="flex flex-row gap-3 max-[480px]:flex-col">
                        <div className="flex flex-col flex-1">
                            <label className={labelClass}>Password</label>
                            <input
                                type="password"
                                value={form.password1}
                                onChange={(e) => setField("password1", e.target.value)}
                                autoComplete="new-password"
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col flex-1">
                            <label className={labelClass}>Confirm password</label>
                            <input
                                type="password"
                                value={form.password2}
                                onChange={(e) => setField("password2", e.target.value)}
                                autoComplete="new-password"
                                className={inputClass}
                            />
                        </div>
                    </div>
                )}

                <div className="flex flex-col">
                    <label className={labelClass}>Role</label>
                    <select
                        value={form.role}
                        onChange={(e) => setField("role", e.target.value)}
                        className={`${inputClass} cursor-pointer`}
                    >
                        {ROLE_OPTIONS.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                {error && <p className="text-red-900 text-[14px] font-[600]">{error}</p>}

                <div className="flex flex-row justify-end gap-3 mt-2">
                    <button
                        type="button"
                        onClick={close}
                        disabled={loading}
                        className="text-[#3E3025] border border-[#3E3025] text-[14px] font-[600] p-2 px-4 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#3E3025] text-white text-[14px] font-[600] p-2 px-4 rounded-lg
                        cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                        disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            isAdd ? "Adding..." : "Saving..."
                        ) : isAdd ? (
                            <>
                                <i className="fa-solid fa-plus"></i> Add user
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-floppy-disk"></i> Save changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default memo(UserFormPop);
