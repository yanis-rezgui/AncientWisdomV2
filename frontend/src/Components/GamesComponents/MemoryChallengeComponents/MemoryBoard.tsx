import { memo, useCallback, useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2, LogOut } from "lucide-react";
import type { MemoryPairType } from "../../../Types/Games";
import type {
    MemoryFlipResult,
    SafeMemoryCard,
    SafeMemoryChallenge,
} from "../../../Contexts/GamesContexts/MemoryChallengeContext";

/* =========================
   CONSTANTS
========================= */

// Durée d'affichage de deux cartes qui ne correspondent pas, avant de les retourner.
const MISMATCH_DELAY = 900;

const pairTypeHints: Record<MemoryPairType, string> = {
    "figure-portrait": "Match each historical figure with their portrait.",
    "landmark-name": "Match each landmark with its name.",
    "event-date": "Match each event with its date.",
    "civilization-artifact": "Match each civilization with its artifact.",
    custom: "Find all the matching pairs.",
};

const getColumns = (cardCount: number) => {
    if (cardCount <= 6) return 3;
    if (cardCount <= 12) return 4;
    if (cardCount <= 20) return 5;
    return 6;
};

/* =========================
   TILE (une carte)
========================= */

type TileStatus = "idle" | "matched" | "mismatch";

interface TileProps {
    position: number;
    card?: SafeMemoryCard;
    faceUp: boolean;
    status: TileStatus;
    disabled: boolean;
    onClick: (position: number) => void;
}

const tileRing: Record<TileStatus, string> = {
    idle: "border-[#292722]/20",
    matched: "border-green-500 bg-green-50",
    mismatch: "border-red-500 bg-red-50",
};

const MemoryTile = memo(
    ({ position, card, faceUp, status, disabled, onClick }: TileProps) => (
        <button
            type="button"
            disabled={disabled}
            onClick={() => onClick(position)}
            aria-label={faceUp ? card?.text || "Revealed card" : "Hidden card"}
            className="relative aspect-square w-full disabled:cursor-default"
            style={{ perspective: "800px" }}
        >
            <div
                className="absolute inset-0 transition-transform duration-500"
                style={{
                    transformStyle: "preserve-3d",
                    transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)",
                }}
            >
                {/* Dos de la carte */}
                <div
                    className="absolute inset-0 flex items-center justify-center rounded-xl bg-[#292722] text-2xl font-bold text-[#B08D57] shadow transition-colors hover:bg-[#3a372f]"
                    style={{ backfaceVisibility: "hidden" }}
                >
                    ?
                </div>

                {/* Face de la carte */}
                <div
                    className={`absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl border-2 bg-white p-1 text-center text-xs font-semibold text-[#292722] max-[600px]:text-[10px] ${tileRing[status]}`}
                    style={{
                        backfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                    }}
                >
                    {card?.contentType === "image" && card.image ? (
                        <img
                            src={card.image.url}
                            alt={card.text || ""}
                            className="h-full w-full object-cover"
                        />
                    ) : (
                        <span className="break-words leading-tight">
                            {card?.text}
                        </span>
                    )}
                </div>
            </div>
        </button>
    )
);

MemoryTile.displayName = "MemoryTile";

/* =========================
   BOARD
========================= */

interface Props {
    challenge: SafeMemoryChallenge;
    position: number;
    total: number;
    score: number;
    maxScore: number;
    isLast: boolean;
    loadingNext: boolean;
    onFlip: (position: number) => Promise<MemoryFlipResult | null>;
    onNext: () => void;
    onQuit: () => void;
}

const MemoryBoard = ({
    challenge,
    position,
    total,
    score,
    maxScore,
    isLast,
    loadingNext,
    onFlip,
    onNext,
    onQuit,
}: Props) => {
    // Le composant est remonté à chaque plateau (key={challenge._id}) :
    // l'état local part donc de l'état serveur (utile à la reprise de session).
    const [cards, setCards] = useState<Record<number, SafeMemoryCard>>(() => {
        const initial: Record<number, SafeMemoryCard> = {};

        challenge.board.matched.forEach((item) => {
            initial[item.position] = item.card;
        });

        if (challenge.board.flipped) {
            initial[challenge.board.flipped.position] = challenge.board.flipped.card;
        }

        return initial;
    });

    const [matched, setMatched] = useState<number[]>(() =>
        challenge.board.matched.map((item) => item.position)
    );
    const [flipped, setFlipped] = useState<number | null>(
        () => challenge.board.flipped?.position ?? null
    );
    const [mismatch, setMismatch] = useState<number[]>([]);
    const [moves, setMoves] = useState(challenge.board.moves);
    const [mismatches, setMismatches] = useState(challenge.board.mismatches);
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [finished, setFinished] = useState<MemoryFlipResult | null>(null);

    const timeoutRef = useRef<number | null>(null);

    useEffect(
        () => () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        },
        []
    );

    const pairCount = challenge.cardCount / 2;
    const progress = Math.round(((position - 1) / total) * 100);

    const handleFlip = useCallback(
        async (cardPosition: number) => {
            if (busy || finished) return;
            if (matched.includes(cardPosition)) return;
            if (flipped === cardPosition) return;

            setBusy(true);
            setError(null);

            const result = await onFlip(cardPosition);

            if (!result) {
                setError("Could not flip this card. Please try again.");
                setBusy(false);
                return;
            }

            setCards((previous) => {
                const next = { ...previous };
                result.flipped.forEach((item) => {
                    next[item.position] = item.card;
                });
                return next;
            });

            // Première carte : on attend la seconde
            if (result.phase === "first") {
                setFlipped(cardPosition);
                setBusy(false);
                return;
            }

            // Seconde carte : la paire est validée par le serveur
            setFlipped(null);
            setMoves(result.moves);
            setMismatches(result.mismatches);

            if (result.isMatch) {
                setMatched(result.matchedPositions);
                if (result.completed) setFinished(result);
                setBusy(false);
                return;
            }

            // Pas de correspondance : on laisse voir les deux cartes un instant
            setMismatch(result.flipped.map((item) => item.position));

            timeoutRef.current = window.setTimeout(() => {
                setMismatch([]);
                setBusy(false);
            }, MISMATCH_DELAY);
        },
        [busy, finished, matched, flipped, onFlip]
    );

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-[#292722]">
                    Board {position} / {total}
                </p>

                <div className="flex items-center gap-3">
                    <span className="rounded-full bg-[#B08D57] px-3 py-1 text-sm font-semibold text-white">
                        {score} / {maxScore} pts
                    </span>
                    <button
                        type="button"
                        onClick={onQuit}
                        className="inline-flex items-center gap-1 rounded-lg border border-[#292722]/20 px-3 py-1 text-sm text-[#292722] hover:border-red-400 hover:text-red-600"
                    >
                        <LogOut size={14} />
                        Quit
                    </button>
                </div>
            </div>

            {/* Progress */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#292722]/10">
                <div
                    className="h-full rounded-full bg-[#B08D57] transition-all"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Card */}
            <div className="flex flex-col items-center gap-5 rounded-3xl border border-[#292722]/10 bg-white p-6 text-center shadow-lg max-[600px]:p-4">
                <div>
                    <h2 className="text-xl font-bold text-[#292722]">
                        {challenge.title}
                    </h2>
                    <p className="mt-1 text-sm text-[#292722]/60">
                        {pairTypeHints[challenge.pairType]}
                    </p>
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-3 text-sm">
                    <span className="rounded-full bg-[#292722]/5 px-3 py-1 font-semibold text-[#292722]">
                        Pairs {matched.length / 2} / {pairCount}
                    </span>
                    <span className="rounded-full bg-[#292722]/5 px-3 py-1 font-semibold text-[#292722]">
                        Moves {moves}
                    </span>
                    <span className="rounded-full bg-red-50 px-3 py-1 font-semibold text-red-700">
                        Mistakes {mismatches}
                    </span>
                </div>

                {/* Grid */}
                <div
                    className="grid w-full gap-2 max-[600px]:gap-1.5"
                    style={{
                        gridTemplateColumns: `repeat(${getColumns(
                            challenge.cardCount
                        )}, minmax(0, 1fr))`,
                    }}
                >
                    {Array.from({ length: challenge.cardCount }, (_, index) => {
                        const isMatched = matched.includes(index);
                        const isMismatch = mismatch.includes(index);
                        const faceUp =
                            isMatched || isMismatch || flipped === index;

                        return (
                            <MemoryTile
                                key={index}
                                position={index}
                                card={cards[index]}
                                faceUp={faceUp}
                                status={
                                    isMatched
                                        ? "matched"
                                        : isMismatch
                                          ? "mismatch"
                                          : "idle"
                                }
                                disabled={busy || Boolean(finished) || faceUp}
                                onClick={handleFlip}
                            />
                        );
                    })}
                </div>

                {busy && !mismatch.length && (
                    <Loader2 size={18} className="animate-spin text-[#B08D57]" />
                )}

                {error && (
                    <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-700">
                        {error}
                    </p>
                )}

                {/* Résultat du plateau */}
                {finished && (
                    <div className="flex w-full flex-col gap-2 rounded-2xl bg-green-50 p-4 text-left text-green-900">
                        <div className="flex items-center gap-2 font-semibold">
                            <CheckCircle2 size={20} />
                            Board complete! +{finished.pointsEarned ?? 0} pts
                        </div>

                        <p className="text-sm">
                            Finished in <strong>{finished.moves}</strong> moves with{" "}
                            <strong>{finished.mismatches}</strong> mistake
                            {finished.mismatches === 1 ? "" : "s"}.
                        </p>

                        {finished.explanation && (
                            <p className="text-sm opacity-90">
                                {finished.explanation}
                            </p>
                        )}

                        <button
                            type="button"
                            disabled={loadingNext}
                            onClick={onNext}
                            className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#292722] px-6 py-3 font-medium text-[#E8E2D6] transition-colors hover:bg-[#B08D57] hover:text-white disabled:opacity-60"
                        >
                            {loadingNext && (
                                <Loader2 size={18} className="animate-spin" />
                            )}
                            {isLast ? "See results" : "Next board"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(MemoryBoard);