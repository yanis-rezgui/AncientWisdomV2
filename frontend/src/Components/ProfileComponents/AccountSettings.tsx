import { useEffect, useState } from "react";
import { useAuthContext } from "../../Contexts/AuthContext";
import { btnOutline, btnPrimary, Card, inputClass } from "./ProfileUI";

interface Props {
    editing: boolean;
    setEditing: (b: boolean) => void;
    notify: (message: string, type: "success" | "error") => void;
}

const AccountSettings = ({ editing, setEditing, notify }: Props) => {
    const {
        user, updateUserInfo, loadingUpdateUserInfo,
        updateUserPassword, loadingUpdatePassword,
        signOut, loadingSignOut,
    } = useAuthContext();

    const [firstName, setFirstName] = useState(user?.firstName ?? "");
    const [lastName, setLastName] = useState(user?.lastName ?? "");
    const [showPwd, setShowPwd] = useState(false);
    const [pwd, setPwd] = useState({ old: "", n1: "", n2: "" });

    useEffect(() => {
        if (!editing) {
            setFirstName(user?.firstName ?? "");
            setLastName(user?.lastName ?? "");
        }
    }, [editing, user]);

    const errorOf = (err: unknown) => (err instanceof Error ? err.message : "Something went wrong.");

    const saveInfo = async () => {
        if (!firstName.trim() || !lastName.trim()) return notify("First and last name are required.", "error");
        try {
            await updateUserInfo(firstName.trim(), lastName.trim());
            notify("Profile updated.", "success");
            setEditing(false);
        } catch (err) {
            notify(errorOf(err), "error");
        }
    };

    const savePassword = async () => {
        if (pwd.n1 !== pwd.n2) return notify("The new passwords do not match.", "error");
        try {
            await updateUserPassword(pwd.old, pwd.n1, pwd.n2);
            notify("Password updated.", "success");
            setPwd({ old: "", n1: "", n2: "" });
            setShowPwd(false);
        } catch (err) {
            notify(errorOf(err), "error");
        }
    };

    return (
        <div className="flex w-full flex-col gap-4">
            <h2 className="text-[1.2em] font-[600] text-[#3E3025]">Account settings</h2>

            <Card title="Personal information" subtitle="Name and account details">
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="text-[13px] text-[#3E3025]">First name
                        <input className={`${inputClass} mt-1`} value={firstName} disabled={!editing}
                            onChange={(e) => setFirstName(e.target.value)} />
                    </label>
                    <label className="text-[13px] text-[#3E3025]">Last name
                        <input className={`${inputClass} mt-1`} value={lastName} disabled={!editing}
                            onChange={(e) => setLastName(e.target.value)} />
                    </label>
                    <label className="text-[13px] text-[#3E3025] sm:col-span-2">Email address
                        <input className={`${inputClass} mt-1`} value={user?.email ?? ""} disabled />
                    </label>
                </div>
                <div className="mt-4 flex gap-2">
                    {editing ? (
                        <>
                            <button type="button" className={btnPrimary} onClick={saveInfo} disabled={loadingUpdateUserInfo}>
                                {loadingUpdateUserInfo ? "Saving..." : "Save"}
                            </button>
                            <button type="button" className={btnOutline} onClick={() => setEditing(false)}>Cancel</button>
                        </>
                    ) : (
                        <button type="button" className={btnOutline} onClick={() => setEditing(true)}>Edit</button>
                    )}
                </div>
            </Card>

            <Card
                title="Password"
                subtitle="Change your account password."
                action={
                    <button type="button" className={btnOutline} onClick={() => setShowPwd((v) => !v)}>
                        {showPwd ? "Close" : "Change"}
                    </button>
                }
            >
                {showPwd && (
                    <div className="flex flex-col gap-3">
                        <input type="password" placeholder="Current password" className={inputClass}
                            value={pwd.old} onChange={(e) => setPwd({ ...pwd, old: e.target.value })} />
                        <input type="password" placeholder="New password" className={inputClass}
                            value={pwd.n1} onChange={(e) => setPwd({ ...pwd, n1: e.target.value })} />
                        <input type="password" placeholder="Confirm new password" className={inputClass}
                            value={pwd.n2} onChange={(e) => setPwd({ ...pwd, n2: e.target.value })} />
                        <button type="button" className={`${btnPrimary} self-start`} onClick={savePassword}
                            disabled={loadingUpdatePassword || !pwd.old || !pwd.n1 || !pwd.n2}>
                            {loadingUpdatePassword ? "Updating..." : "Update password"}
                        </button>
                    </div>
                )}
            </Card>

            <Card title="Session" subtitle="Sign out of your account.">
                <button type="button" onClick={signOut} disabled={loadingSignOut}
                    className="rounded-lg bg-red-900 px-4 py-2 text-[14px] font-[600] text-white transition-opacity hover:opacity-80 active:opacity-60 disabled:opacity-50">
                    {loadingSignOut ? "Signing out..." : "Sign out"}
                </button>
            </Card>
        </div>
    );
};

export default AccountSettings;