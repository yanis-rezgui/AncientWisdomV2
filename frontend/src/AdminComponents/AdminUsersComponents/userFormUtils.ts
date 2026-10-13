import type { User } from "../../Types/Types";

export const ROLE_OPTIONS = ["USER", "ADMIN"] as const;

export interface UserFormState {
    firstName: string;
    lastName: string;
    email: string;
    password1: string;
    password2: string;
    role: string;
}

export const emptyUserForm: UserFormState = {
    firstName: "",
    lastName: "",
    email: "",
    password1: "",
    password2: "",
    role: "USER",
};

export const userToForm = (user: User): UserFormState => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    password1: "",
    password2: "",
    role: user.role,
});

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// mode "add" : valide aussi email + mots de passe
export const validateUserForm = (
    form: UserFormState,
    mode: "add" | "update"
): string | null => {
    if (!form.firstName.trim()) return "First name is required.";
    if (!form.lastName.trim()) return "Last name is required.";
    if (!form.role) return "Role is required.";

    if (mode === "add") {
        if (!form.email.trim()) return "Email is required.";
        if (!EMAIL_REGEX.test(form.email.trim())) return "Email is not valid.";
        if (form.password1.length < 8) return "Password must contain at least 8 characters.";
        if (form.password1 !== form.password2) return "Passwords do not match.";
    }

    return null;
};

export const inputClass =
    " bg-white border border-[#3E3025]/30 rounded-lg p-2 text-[15px] text-[#3E3025] " +
    "outline-none focus:border-[#3E3025] disabled:opacity-60 disabled:cursor-not-allowed";

export const labelClass = "text-[#3E3025] text-[14px] font-[600] mb-1";

export const formatDate = (date?: string) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "-";
