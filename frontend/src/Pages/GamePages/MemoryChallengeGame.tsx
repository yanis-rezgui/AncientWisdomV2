import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";
import { useMemoryChallengeContext } from "../../Contexts/GamesContexts/MemoryChallengeContext";
import { useAuthContext } from "../../Contexts/AuthContext";
import type { Game, GameDifficulty } from "../../Types/Games";
import GameSetup from "../../Components/GamesComponents/Shared/GameSetup";
import GameResults from "../../Components/GamesComponents/Shared/GameResults";
import MemoryBoard from "../../Components/GamesComponents/MemoryChallengeComponents/MemoryBoard";

type Stage = "setup" | "playing" | "results";

// Nombre de plateaux proposés (un plateau = une grille complète de cartes)
const BOARD_COUNTS = [1, 3, 5];

const MemoryChallengeGame = ({ game }: { game: Game }) => {
    const navigate = useNavigate();
    const { token } = useAuthContext();

    const {
        currentSession,
        sessionChallenges,
        loadingStartGame,
        loadingSubmitGame,
        startMemoryChallengeGame,
        flipMemoryCard,
        submitMemoryChallengeGame,
        abandonMemoryChallengeGame,
        clearCurrentGame,
        clearLastFlipResult,
    } = useMemoryChallengeContext();

    const [stage, setStage] = useState<Stage>("setup");
    const [index, setIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Repart d'un état propre à chaque entrée sur la page
    useEffect(() => {
        clearCurrentGame();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!token) {
        return (
            <div className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-3xl bg-white p-8 text-center shadow-lg">
                <h1 className="text-2xl font-bold text-[#292722]">
                    Sign in to play
                </h1>
                <p className="text-sm text-[#292722]/70">
                    Your score and progress are saved to your account.
                </p>
                <Link
                    to="/user"
                    className="rounded-xl bg-[#292722] px-6 py-3 text-[#E8E2D6] hover:bg-[#B08D57]"
                >
                    Log in
                </Link>
            </div>
        );
    }

    const challenge = sessionChallenges[index];
    const isLast = index >= sessionChallenges.length - 1;

    const handleStart = async (options: {
        difficulty: GameDifficulty | "";
        questionCount: number;
    }) => {
        setError(null);

        const result = await startMemoryChallengeGame({
            gameId: game._id,
            ...options,
        });

        if (!result) {
            setError("Could not start the game. Please try again.");
            return;
        }

        // Reprise d'une session en cours : on saute les plateaux déjà terminés
        const firstUnfinished = result.challenges.findIndex(
            (c) =>
                !result.session.answers.find((a) => a.challenge === c._id)
                    ?.completed
        );

        if (firstUnfinished === -1) {
            await submitMemoryChallengeGame(result.session._id);
            setStage("results");
            return;
        }

        setIndex(firstUnfinished);
        setStage("playing");
    };

    const handleFlip = async (position: number) => {
        if (!currentSession || !challenge) return null;

        return flipMemoryCard(currentSession._id, challenge._id, position);
    };

    const handleNext = async () => {
        clearLastFlipResult();

        if (!isLast) {
            setIndex((i) => i + 1);
            return;
        }

        if (currentSession) {
            await submitMemoryChallengeGame(currentSession._id);
        }
        setStage("results");
    };

    const handleQuit = async () => {
        if (!window.confirm("Quit this game? Your progress will be lost.")) return;
        if (currentSession) await abandonMemoryChallengeGame(currentSession._id);
        clearCurrentGame();
        navigate(`/game/${game._id}`);
    };

    const handlePlayAgain = () => {
        clearCurrentGame();
        setIndex(0);
        setStage("setup");
    };

    return (
        <>
            {stage === "setup" && (
                <GameSetup
                    game={game}
                    loading={loadingStartGame}
                    error={error}
                    icon={Brain}
                    counts={BOARD_COUNTS}
                    countLabel="Number of boards"
                    description="Flip two cards at a time and match every historical pair. Fewer mistakes means more points."
                    onStart={handleStart}
                />
            )}

            {stage === "playing" && currentSession && challenge && (
                <MemoryBoard
                    key={challenge._id}
                    challenge={challenge}
                    position={index + 1}
                    total={sessionChallenges.length}
                    score={currentSession.score}
                    maxScore={currentSession.maxScore}
                    isLast={isLast}
                    loadingNext={loadingSubmitGame}
                    onFlip={handleFlip}
                    onNext={handleNext}
                    onQuit={handleQuit}
                />
            )}

            {stage === "results" && currentSession && (
                <GameResults
                    session={currentSession}
                    challenges={sessionChallenges}
                    onPlayAgain={handlePlayAgain}
                />
            )}
        </>
    );
};

export default memo(MemoryChallengeGame);