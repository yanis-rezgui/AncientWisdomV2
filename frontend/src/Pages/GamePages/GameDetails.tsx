import { memo, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useGamesContext } from "../../Contexts/GamesContexts/GamesContext";
import GameDetailsHero from "../../Components/GamesComponents/GameDetailsComponents/GameDetailsHero";
import GameInstructions from "../../Components/GamesComponents/GameDetailsComponents/GameInstructions";

const GameDetails = () => {
    const { id } = useParams<{ id: string }>();
    const { currentGame, getGame, loadingGame } = useGamesContext();

    useEffect(() => {
        if (id) getGame(id);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const ready = currentGame && currentGame._id === id;

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center bg-[#E8E2D6]">
            {loadingGame || (!ready && !loadingGame && !currentGame) ? (
                <div className="mt-24 h-72 w-full max-w-6xl animate-pulse rounded-3xl bg-[#d9d2c3]" />
            ) : !ready ? (
                <div className="mt-24 flex flex-col items-center gap-4 px-5 text-center">
                    <h1 className="text-2xl font-bold text-[#292722]">
                        Game not found
                    </h1>
                    <Link
                        to="/games"
                        className="rounded-xl bg-[#292722] px-6 py-3 text-[#E8E2D6] hover:bg-[#B08D57]"
                    >
                        Back to games
                    </Link>
                </div>
            ) : (
                <>
                    <GameDetailsHero game={currentGame} />
                    <GameInstructions instructions={currentGame.instructions} />
                </>
            )}
        </section>
    );
};

export default memo(GameDetails);