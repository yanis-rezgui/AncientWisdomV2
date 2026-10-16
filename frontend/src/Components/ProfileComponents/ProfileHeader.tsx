import type { ProfileOverviewStats, ProfileStatsUser } from "../../Types/ProfileStatsTypes";
import { btnPrimary, Card, formatMonthYear, StatTile } from "./ProfileUI";

const ProfileHeader = ({ profile, stats, onEdit }: {
    profile: ProfileStatsUser; stats: ProfileOverviewStats; onEdit: () => void;
}) => {
    const initials = `${profile.firstName?.[0] ?? ""}${profile.lastName?.[0] ?? ""}`.toUpperCase();
    const isAdmin = profile.role === "ADMIN";

    return (
        <Card>
            <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-[#3E3025] text-[1.6em] font-[600] text-white">
                    {initials}
                </div>

                <div className="min-w-0 flex-1 text-center sm:text-left">
                    <h2 className="text-[1.4em] font-[700] text-[#3E3025]">
                        {profile.firstName} {profile.lastName}
                    </h2>
                    <p className="text-[14px] text-[#3E3025]/70">
                        {isAdmin ? "Administrator" : "Member of Ancient Wisdom"}
                    </p>
                    <p className="mt-1 truncate text-[13px] text-[#3E3025]/60">{profile.email}</p>
                    <p className="text-[13px] text-[#3E3025]/60">Joined {formatMonthYear(profile.memberSince)}</p>
                </div>

                <button type="button" onClick={onEdit} className={btnPrimary}>
                    Edit profile
                </button>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
                <StatTile value={stats.quizzesCompleted} label="Quizzes completed" />
                <StatTile value={stats.gamesPlayed} label="Games played" />
                <StatTile value={stats.favorites} label="Saved items" />
            </div>
        </Card>
    );
};

export default ProfileHeader;