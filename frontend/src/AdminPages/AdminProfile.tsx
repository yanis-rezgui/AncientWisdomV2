// pages/AdminProfile.tsx
import { useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";


const card = "rounded-xl border border-gray-200 bg-white p-6 shadow-sm";
const input = "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/20 disabled:bg-gray-100";
const btn = "rounded-lg bg-black px-4 py-2 text-sm text-white disabled:opacity-50";

export default function AdminProfile() {
  const {
    user, updateUserInfo, loadingUpdateUserInfo,
    updateUserPassword, loadingUpdatePassword,
    signOut, loadingSignOut,
  } = useAuthContext();

  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [editing, setEditing] = useState(false);

  const [pwd, setPwd] = useState({ old: "", n1: "", n2: "" });
  const [showPwd, setShowPwd] = useState(false);

  const [dark, setDark] = useState(document.documentElement.classList.contains("dark"));

  if (!user) return null;

  const saveInfo = async () => {
    await updateUserInfo(firstName, lastName);
    setEditing(false);
  };

  const savePwd = async () => {
    await updateUserPassword(pwd.old, pwd.n1, pwd.n2);
    setPwd({ old: "", n1: "", n2: "" });
    setShowPwd(false);
  };

  const toggleTheme = () => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
    setDark(next);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6  mt-5">
      <header className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-semibold text-white">
          {user.firstName?.[0]}{user.lastName?.[0]}
        </div>
        <div>
          <h1 className="text-xl font-semibold">Admin Profile</h1>
          <p className="text-sm text-gray-500">Manage your personal information and account settings.</p>
        </div>
        <span className="ml-auto rounded-full bg-gray-100 px-3 py-1 text-xs">Administrator</span>
      </header>

      {/* Profile */}
      <section className={card}>
        <h2 className="mb-4 font-medium">Personal information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm">First name
            <input className={input} value={firstName} disabled={!editing} onChange={e => setFirstName(e.target.value)} />
          </label>
          <label className="text-sm">Last name
            <input className={input} value={lastName} disabled={!editing} onChange={e => setLastName(e.target.value)} />
          </label>
          <label className="text-sm">Email address
            <input className={input} value={user.email} disabled />
          </label>
          <label className="text-sm">Role
            <input className={input} value="Administrator" disabled />
          </label>
        </div>
        <div className="mt-4 flex gap-2">
          {editing ? (
            <>
              <button className={btn} onClick={saveInfo} disabled={loadingUpdateUserInfo}>
                {loadingUpdateUserInfo ? "Saving..." : "Save"}
              </button>
              <button className="rounded-lg border px-4 py-2 text-sm" onClick={() => {
                setFirstName(user.firstName); setLastName(user.lastName); setEditing(false);
              }}>Cancel</button>
            </>
          ) : (
            <button className={btn} onClick={() => setEditing(true)}>Edit profile</button>
          )}
        </div>
      </section>

      {/* Security */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-medium">Password</h2>
            <p className="text-sm text-gray-500">Change your account password.</p>
          </div>
          <button className="rounded-lg border px-4 py-2 text-sm" onClick={() => setShowPwd(v => !v)}>
            {showPwd ? "Close" : "Change"}
          </button>
        </div>
        {showPwd && (
          <div className="mt-4 space-y-3">
            <input type="password" placeholder="Current password" className={input}
              value={pwd.old} onChange={e => setPwd({ ...pwd, old: e.target.value })} />
            <input type="password" placeholder="New password" className={input}
              value={pwd.n1} onChange={e => setPwd({ ...pwd, n1: e.target.value })} />
            <input type="password" placeholder="Confirm new password" className={input}
              value={pwd.n2} onChange={e => setPwd({ ...pwd, n2: e.target.value })} />
            <button className={btn} onClick={savePwd}
              disabled={loadingUpdatePassword || !pwd.old || !pwd.n1 || pwd.n1 !== pwd.n2}>
              {loadingUpdatePassword ? "Updating..." : "Update password"}
            </button>
          </div>
        )}
      </section>

      {/* Preferences */}
      <section className={`${card} flex items-center justify-between`}>
        <div>
          <h2 className="font-medium">Appearance</h2>
          <p className="text-sm text-gray-500">Choose the interface appearance.</p>
        </div>
        <button className="rounded-lg border px-4 py-2 text-sm" onClick={toggleTheme}>
          {dark ? "Dark" : "Light"}
        </button>
      </section>

      {/* Session */}
      <section className={`${card} flex items-center justify-between`}>
        <div>
          <h2 className="font-medium">Session</h2>
          <p className="text-sm text-gray-500">Sign out of your administrator account.</p>
        </div>
        <button className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white disabled:opacity-50"
          onClick={signOut} disabled={loadingSignOut}>
          {loadingSignOut ? "..." : "Log out"}
        </button>
      </section>
    </div>
  );
}