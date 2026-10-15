import { memo, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFigureChallengeContext } from "../../Contexts/GamesContexts/FigureChallengeContext";
import { useAuthContext } from "../../Contexts/AuthContext";
import type { Game, GameDifficulty } from "../../Types/Games";
import FigureQuestion from "../../Components/GamesComponents/FigureChallengeComponents/FigureQuestion";
import FigureFeedback from "../../Components/GamesComponents/FigureChallengeComponents/FigureFeedback";
import GameResults from "../../Components/GamesComponents/Shared/GameResults";
import GameSetup from "../../Components/GamesComponents/Shared/GameSetup";

type Stage = "setup" | "playing" | "feedback" | "results";

const FigureChallengeGame = ({ game }: { game: Game }) => {
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
        startFigureChallengeGame,
        revealFigureHint,
        submitFigureAnswer,
        submitFigureChallengeGame,
        abandonFigureChallengeGame,
        clearCurrentGame,
        clearLastAnswerResult,
    } = useFigureChallengeContext();

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
        const result = await startFigureChallengeGame({
            gameId: game._id,
            ...options,
        });

        if (!result) {
            setError("Could not start the game. Please try again.");
            return;
        }

        // Reprise d'une session en cours : on saute les figures déjà répondues
        const firstUnanswered = result.challenges.findIndex(
            (c) =>
                !result.session.answers.find((a) => a.challenge === c._id)
                    ?.userAnswer
        );

        if (firstUnanswered === -1) {
            await submitFigureChallengeGame(result.session._id);
            setStage("results");
            return;
        }

        setIndex(firstUnanswered);
        setStage("playing");
    };

    const handleHint = async () => {
        if (!currentSession || !challenge) return;
        await revealFigureHint(currentSession._id, challenge._id);
    };

    const handleAnswer = async (answer: string, timeSpent: number) => {
        if (!currentSession || !challenge) return;
        const result = await submitFigureAnswer(
            currentSession._id,
            challenge._id,
            answer,
            timeSpent
        );
        if (result) setStage("feedback");
    };

    const handleNext = async () => {
        clearLastAnswerResult();

        if (!isLast) {
            setIndex((i) => i + 1);
            setStage("playing");
            return;
        }

        if (currentSession) {
            await submitFigureChallengeGame(currentSession._id);
        }
        setStage("results");
    };

    const handleQuit = async () => {
        if (!window.confirm("Quit this game? Your progress will be lost.")) return;
        if (currentSession) await abandonFigureChallengeGame(currentSession._id);
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
                    onStart={handleStart}
                />
            )}

            {stage === "playing" && currentSession && challenge && (
                <FigureQuestion
                    key={challenge._id}
                    challenge={challenge}
                    position={index + 1}
                    total={sessionChallenges.length}
                    score={currentSession.score}
                    maxScore={currentSession.maxScore}
                    loadingHint={loadingHint}
                    loadingAnswer={loadingAnswer}
                    onHint={handleHint}
                    onAnswer={handleAnswer}
                    onQuit={handleQuit}
                />
            )}

            {stage === "feedback" && lastAnswerResult && challenge && (
                <FigureFeedback
                    result={lastAnswerResult}
                    challenge={challenge}
                    isLast={isLast}
                    loading={loadingSubmitGame}
                    onNext={handleNext}
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

export default memo(FigureChallengeGame);