import { memo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useGamesContext } from "../../Contexts/GamesContexts/GamesContext";
import FigureChallengeGame from "./FigureChallengeGame";
import LandmarkChallengeGame from "./LandmarkChallengeGame";
import WordChallengeGame from "./WordChallengeGame";
import MemoryChallengeGame from "./MemoryChallengeGame";
import LocationChallengeGame from "./LocationChallengeGame";

const GamePlay = () => {
    const { id } = useParams<{ id: string }>();
    const { currentGame, getGame, loadingGame } = useGamesContext();

    useEffect(() => {
        if (id) getGame(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const ready = currentGame && currentGame._id === id;

    const renderGame = () => {
        if (!ready) return null;

        switch (currentGame.gameType) {
            case "guess-the-figure":
                return <FigureChallengeGame game={currentGame} />;
            case "name-the-landmark":
                return <LandmarkChallengeGame game={currentGame} />;
            case "word-scramble":
                return <WordChallengeGame game={currentGame}/>
            case "history-memory":
                return <MemoryChallengeGame game={currentGame}/>
            case "where-in-history":
                return <LocationChallengeGame game={currentGame} />;
            default:
                return (
                    <p className="text-center text-[#292722]">
                        This game is coming soon.
                    </p>
                );
        }
    };

    return (
        <section className="flex min-h-screen w-full flex-col items-center bg-[#E8E2D6] px-5 pb-16 pt-8">
            <div className="mb-6 w-full max-w-5xl">
                <Link
                    to={ready ? `/game/${id}` : "/games"}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#292722]/70 hover:text-[#B08D57]"
                >
                    <ArrowLeft size={16} />
                    Back
                </Link>
            </div>

            {loadingGame && !ready ? (
                <div className="h-96 w-full max-w-3xl animate-pulse rounded-3xl bg-[#d9d2c3]" />
            ) : ready ? (
                renderGame()
            ) : (
                <p className="text-[#292722]">Game not found.</p>
            )}
        </section>
    );
};

export default memo(GamePlay);