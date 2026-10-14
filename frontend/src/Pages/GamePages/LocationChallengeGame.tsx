import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPinned } from "lucide-react";
import { useLocationChallengeContext } from "../../Contexts/GamesContexts/LocationChallengeContext";
import { useAuthContext } from "../../Contexts/AuthContext";
import type { Game, GameDifficulty } from "../../Types/Games";
import GameSetup from "../../Components/GamesComponents/Shared/GameSetup";
import GameResults from "../../Components/GamesComponents/Shared/GameResults";
import LocationQuestion from "../../Components/GamesComponents/LocationChallengeComponents/LocationQuestion";

type Stage = "setup" | "playing" | "results";

const LocationChallengeGame = ({ game }: { game: Game }) => {
    const navigate = useNavigate();
    const { token } = useAuthContext();

    const {
        currentSession,
        sessionChallenges,
        lastAnswerResult,
        loadingStartGame,
        loadingHint,
        loadingAnswer,
        loadingSubmitGame,
        startLocationChallengeGame,
        revealLocationHint,
        submitLocationAnswer,
        submitLocationChallengeGame,
        abandonLocationChallengeGame,
        clearCurrentGame,
        clearLastAnswerResult,
    } = useLocationChallengeContext();

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
                    to="/login"
                    className="rounded-xl bg-[#292722] px-6 py-3 text-[#E8E2D6] hover:bg-[#B08D57]"
                >
                    Log in
                </Link>
            </div>
        );
    }

    const challenge = sessionChallenges[index];
    const isLast = index >= sessionChallenges.length - 1;

    // Le résultat ne concerne la question courante que si les ids correspondent
    const currentResult =
        lastAnswerResult &&
        challenge &&
        lastAnswerResult.challengeId === challenge._id
            ? lastAnswerResult
            : null;

    const handleStart = async (options: {
        difficulty: GameDifficulty | "";
        questionCount: number;
    }) => {
        setError(null);

        const result = await startLocationChallengeGame({
            gameId: game._id,
            ...options,
        });

        if (!result) {
            setError("Could not start the game. Please try again.");
            return;
        }

        // Reprise d'une session en cours : on saute les lieux déjà répondus
        const firstUnanswered = result.challenges.findIndex(
            (c) =>
                !result.session.answers.find((a) => a.challenge === c._id)
                    ?.answered
        );

        if (firstUnanswered === -1) {
            await submitLocationChallengeGame(result.session._id);
            setStage("results");
            return;
        }

        setIndex(firstUnanswered);
        setStage("playing");
    };

    const handleHint = async () => {
        if (!currentSession || !challenge) return;
        await revealLocationHint(currentSession._id, challenge._id);
    };

    const handleAnswer = async (
        latitude: number,
        longitude: number,
        timeSpent: number
    ) => {
        if (!currentSession || !challenge) return;
        await submitLocationAnswer(
            currentSession._id,
            challenge._id,
            latitude,
            longitude,
            timeSpent
        );
    };

    const handleNext = async () => {
        clearLastAnswerResult();

        if (!isLast) {
            setIndex((i) => i + 1);
            return;
        }

        if (currentSession) {
            await submitLocationChallengeGame(currentSession._id);
        }
        setStage("results");
    };

    const handleQuit = async () => {
        if (!window.confirm("Quit this game? Your progress will be lost.")) return;
        if (currentSession) await abandonLocationChallengeGame(currentSession._id);
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
                    icon={MapPinned}
                    description="Read the question and click on the map where you think the place is. The closer you are, the more points you earn. A hint halves your points."
                    onStart={handleStart}
                />
            )}

            {stage === "playing" && currentSession && challenge && (
                <LocationQuestion
                    key={challenge._id}
                    challenge={challenge}
                    position={index + 1}
                    total={sessionChallenges.length}
                    score={currentSession.score}
                    maxScore={currentSession.maxScore}
                    result={currentResult}
                    isLast={isLast}
                    loadingHint={loadingHint}
                    loadingAnswer={loadingAnswer}
                    loadingNext={loadingSubmitGame}
                    onHint={handleHint}
                    onAnswer={handleAnswer}
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

export default memo(LocationChallengeGame);