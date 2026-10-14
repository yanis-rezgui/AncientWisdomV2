import { memo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Clock3, Gauge, Play, Lock } from "lucide-react";
import type { Game } from "../../../Types/Games";
import {
    difficultyStyles,
    gameIcons,
    gameLabels,
    playableGames,
} from "../gameUi";

const GameDetailsHero = ({ game }: { game: Game }) => {
    const Icon = gameIcons[game.gameType];
    const playable = playableGames.includes(game.gameType);

    return (
        <section className="w-full max-w-6xl px-5 pt-8">
            <Link
                to="/games"
                className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#292722]/70 transition-colors hover:text-[#B08D57]"
            >
                <ArrowLeft size={16} />
                All games
            </Link>

            <div className="grid items-center gap-8 lg:grid-cols-2">
                <div className="relative aspect-[16/11] overflow-hidden rounded-3xl bg-[#d9d2c3] shadow-xl">
                    <img
                        src={game.image?.url}
                        alt={game.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-[#E8E2D6] p-3 text-[#292722]">
                        <Icon size={22} />
                    </span>
                </div>

                <div className="flex flex-col gap-4">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#B08D57]">
                        {gameLabels[game.gameType]}
                    </p>

                    <h1 className="text-4xl font-bold text-[#292722] max-[600px]:text-3xl">
                        {game.title}
                    </h1>

                    <p className="leading-7 text-[#292722]/75">
                        {game.description}
                    </p>

                    <div className="flex flex-wrap gap-3">
                        <span
                            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
                                difficultyStyles[game.difficulty] ??
                                "bg-gray-100 text-gray-800"
                            }`}
                        >
                            <Gauge size={16} />
                            {game.difficulty}
                        </span>

                        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#292722]">
                            <Clock3 size={16} />
                            {game.estimatedDuration} min
                        </span>
                    </div>

                    {playable ? (
                        <Link
                            to={`/game/${game._id}/play`}
                            className="mt-2 inline-flex w-fit items-center gap-2 rounded-xl bg-[#292722] px-8 py-4 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white max-[600px]:w-full max-[600px]:justify-center"
                        >
                            <Play size={18} />
                            Play now
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="mt-2 inline-flex w-fit cursor-not-allowed items-center gap-2 rounded-xl bg-[#292722]/30 px-8 py-4 font-medium text-[#292722]/60 max-[600px]:w-full max-[600px]:justify-center"
                        >
                            <Lock size={18} />
                            Coming soon
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
};

export default memo(GameDetailsHero);