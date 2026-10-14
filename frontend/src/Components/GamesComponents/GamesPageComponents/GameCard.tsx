
import { Link } from "react-router-dom";
import {
    ArrowUpRight,
    Brain,
    Clock3,
    Compass,
    Lightbulb,
    MapPinned,
    Puzzle,
} from "lucide-react";

import type { Game } from "../../../Types/Games";

interface GameCardProps {
    game: Game;
}

const gameIcons = {
    "guess-the-figure": Lightbulb,
    "name-the-landmark": Compass,
    "word-scramble": Puzzle,
    "history-memory": Brain,
    "where-in-history": MapPinned,
};

const difficultyStyles: Record<string, string> = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-amber-100 text-amber-800",
    Hard: "bg-red-100 text-red-800",
};

const GameCard = ({ game }: GameCardProps) => {
    const Icon = gameIcons[game.gameType] ?? Lightbulb;

    return (
        <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#292722]/10 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-[#B08D57]/50 hover:shadow-xl">
            {/* Image */}
            <Link
                to={`/game/${game._id}`}
                className="relative block aspect-[16/10] overflow-hidden bg-[#E8E2D6]"
                aria-label={`Discover ${game.title}`}
            >
                <img
                    src={game.image?.url}
                    alt={game.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <span className="absolute left-4 top-4 rounded-full bg-[#E8E2D6] p-2.5 text-[#292722]">
                    <Icon size={19} />
                </span>

                <span
                    className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
                        difficultyStyles[game.difficulty] ??
                        "bg-gray-100 text-gray-800"
                    }`}
                >
                    {game.difficulty}
                </span>

                <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#E8E2D6]/80">
                        Ancient Wisdom Games
                    </p>
                </div>
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="text-xl font-semibold text-[#292722]">
                        {game.title}
                    </h2>

                    <ArrowUpRight
                        size={20}
                        className="mt-1 shrink-0 text-[#B08D57] transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                </div>

                <p className="mb-5 flex-1 text-sm leading-6 text-[#292722]/70">
                    {game.description}
                </p>

                <div className="mb-5 flex items-center gap-2 text-sm text-[#292722]/60">
                    <Clock3 size={16} />
                    <span>{game.estimatedDuration} min</span>
                </div>

                <Link
                    to={`/game/${game._id}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#292722] px-4 py-3 text-sm font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white"
                >
                    Explore game
                    <ArrowUpRight size={16} />
                </Link>
            </div>
        </article>
    );
};

export default GameCard;
