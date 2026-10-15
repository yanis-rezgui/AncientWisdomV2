import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { GAME_CONFIGS } from "../../AdminComponents/AdminGames/gamesAdminConfig";

const AdminGames = () => {
    const navigate = useNavigate();

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-6 max-[600px]:p-4">
            <div>
                <h1 className="text-[1.8em] font-semibold text-[#3E3025]">
                    Games
                </h1>
                <p className="text-[14px] text-[#7A726A]">
                    Choose a game to manage its challenges.
                </p>
            </div>

            <div className="grid grid-cols-3 gap-5 max-[1000px]:grid-cols-2 max-[600px]:grid-cols-1">
                {GAME_CONFIGS.map((config) => {
                    const GameIcon = config.icon;

                    return (
                        <button
                            key={config.key}
                            type="button"
                            onClick={() => navigate(`/admin/games/${config.key}`)}
                            className="group flex cursor-pointer flex-col items-start gap-4 rounded-2xl border border-[#E7E0D6] bg-white p-5 text-left transition-all hover:-translate-y-0.5 hover:border-[#B89B72] hover:shadow-lg"
                        >
                            <span className="rounded-xl bg-[#B89B72]/15 p-3 text-[#3E3025]">
                                <GameIcon size={26} />
                            </span>

                            <div className="flex flex-col gap-1">
                                <h2 className="text-[1.1em] font-semibold text-[#3E3025]">
                                    {config.label}
                                </h2>
                                <p className="text-[13px] leading-5 text-[#7A726A]">
                                    {config.description}
                                </p>
                            </div>

                            <span className="mt-auto inline-flex items-center gap-1 text-[13px] font-medium text-[#B89B72] transition-transform group-hover:translate-x-1">
                                Manage challenges
                                <ChevronRight size={16} />
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default memo(AdminGames);
