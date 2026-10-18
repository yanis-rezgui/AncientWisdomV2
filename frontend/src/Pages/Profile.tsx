import { memo, useRef, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { useProfileStatsContext } from "../Contexts/ProfileStatsContext"; // adapte le chemin
import SignIn from "../Components/AuthComponents/SignIn";
import SignUp from "../Components/AuthComponents/SignUp";
import AuthPanel from "../Components/AuthComponents/AuthPanel";
import Toast from "../AdminComponents/AdminErasComponents/Toast";
import ProfileHeader from "../Components/ProfileComponents/ProfileHeader";
import LearningActivity from "../Components/ProfileComponents/LearningActivity";
import MyCollection from "../Components/ProfileComponents/MyCollection";
import AccountSettings from "../Components/ProfileComponents/AccountSettings";
import { btnPrimary } from "../Components/ProfileComponents/ProfileUI";

const Profile = () => {
    const { showSignIn, user } = useAuthContext();
    const { profileStats, loadingProfileStats, errorMsg, getMyProfileStats } = useProfileStatsContext();

    const [editing, setEditing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const settingsRef = useRef<HTMLDivElement>(null);

    // Évite d'afficher les stats d'un autre compte juste après une reconnexion
    const stats = profileStats && profileStats.profile._id === user?._id ? profileStats : null;

    const startEditing = () => {
        setEditing(true);
        settingsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    return (
        <section className="flex flex-col items-center min-h-screen w-full bg-[#E8E2D6] pb-20">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {!user ? (
                <div className="mt-10 w-full max-w-5xl px-4">
                    <div className="grid overflow-hidden rounded-lg border border-gray-200 bg-white md:grid-cols-2">
                        <AuthPanel isSignIn={showSignIn} />

                        <div className="flex items-center p-6 sm:p-10">
                            <div className="mx-auto w-full max-w-md">
                                {showSignIn ? <SignIn /> : <SignUp />}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <h1 className="mt-10 text-[2em] font-bold text-[#3E3025]">Ancient Wisdom</h1>
                    <p className="mt-3 text-[18px] text-[#3E3025]">Your profile.</p>

                    <div className="mt-8 flex w-full max-w-4xl flex-col gap-8 px-4">
                        {stats ? (
                            <>
                                <ProfileHeader profile={stats.profile} stats={stats.stats} onEdit={startEditing} />
                                <LearningActivity learning={stats.learning} />
                                <MyCollection favoritesByType={stats.favoritesByType} />
                            </>
                        ) : loadingProfileStats ? (
                            <p className="mt-6 text-center font-bold text-[#3E3025]">Loading ...</p>
                        ) : (
                            <div className="mt-6 flex flex-col items-center gap-3">
                                <p className="text-center text-[14px] font-[600] text-red-900">
                                    {errorMsg || "Profile statistics are unavailable."}
                                </p>
                                <button type="button" className={btnPrimary} onClick={getMyProfileStats}>
                                    Retry
                                </button>
                            </div>
                        )}

                        <div ref={settingsRef} className="scroll-mt-6">
                            <AccountSettings
                                editing={editing}
                                setEditing={setEditing}
                                notify={(message, type) => setToast({ message, type })}
                            />
                        </div>
                    </div>
                </>
            )}
        </section>
    );
};

export default memo(Profile);