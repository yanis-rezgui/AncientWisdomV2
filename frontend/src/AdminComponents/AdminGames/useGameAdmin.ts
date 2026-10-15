import type { AdminActionResult } from "../../Types/GamesAdmin";
import { useFigureChallengesAdminContext } from "../../AdminContexts/GamesAdminContext/FigureChallengesAdminContext";
import { useLandmarkChallengesAdminContext } from "../../AdminContexts/GamesAdminContext/LandmarkChallengesAdminContext";
import { useLocationChallengesAdminContext } from "../../AdminContexts/GamesAdminContext/LocationChallengesAdminContext";
import { useMemoryChallengesAdminContext } from "../../AdminContexts/GamesAdminContext/MemoryChallengesAdminContext";
import { useWordChallengesAdminContext } from "../../AdminContexts/GamesAdminContext/WordChallengesAdminContext";
import type { AdminChallenge, GameKey } from "./gamesAdminConfig";

// API identique quel que soit le jeu : les pages admin sont génériques.
export interface GameAdminApi {
    loadingAdd: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    challengeToDelete: AdminChallenge | null;
    openDeletePop: (challenge: AdminChallenge) => void;
    closeDeletePop: () => void;

    add: (input: unknown) => Promise<AdminActionResult<AdminChallenge>>;
    update: (
        id: string,
        input: unknown
    ) => Promise<AdminActionResult<AdminChallenge>>;
    remove: (id: string) => Promise<AdminActionResult>;
}

interface BaseContext {
    loadingAdd: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;
    challengeToDelete: AdminChallenge | null;
    openDeletePop: unknown;
    closeDeletePop: () => void;
}

const adapt = (
    ctx: BaseContext,
    add: unknown,
    update: unknown,
    remove: (id: string) => Promise<AdminActionResult>
): GameAdminApi => ({
    loadingAdd: ctx.loadingAdd,
    loadingUpdate: ctx.loadingUpdate,
    loadingDelete: ctx.loadingDelete,
    challengeToDelete: ctx.challengeToDelete,
    openDeletePop: ctx.openDeletePop as GameAdminApi["openDeletePop"],
    closeDeletePop: ctx.closeDeletePop,
    add: add as GameAdminApi["add"],
    update: update as GameAdminApi["update"],
    remove,
});

// Les 5 providers doivent être montés (voir App.tsx) : les hooks sont tous appelés,
// puis on garde l'API du jeu demandé.
export const useGameAdmin = (game: GameKey): GameAdminApi => {
    const figure = useFigureChallengesAdminContext();
    const landmark = useLandmarkChallengesAdminContext();
    const location = useLocationChallengesAdminContext();
    const memory = useMemoryChallengesAdminContext();
    const word = useWordChallengesAdminContext();

    switch (game) {
        case "figure":
            return adapt(
                figure,
                figure.addFigureChallenge,
                figure.updateFigureChallenge,
                figure.deleteFigureChallenge
            );
        case "landmark":
            return adapt(
                landmark,
                landmark.addLandmarkChallenge,
                landmark.updateLandmarkChallenge,
                landmark.deleteLandmarkChallenge
            );
        case "location":
            return adapt(
                location,
                location.addLocationChallenge,
                location.updateLocationChallenge,
                location.deleteLocationChallenge
            );
        case "memory":
            return adapt(
                memory,
                memory.addMemoryChallenge,
                memory.updateMemoryChallenge,
                memory.deleteMemoryChallenge
            );
        case "word":
            return adapt(
                word,
                word.addWordChallenge,
                word.updateWordChallenge,
                word.deleteWordChallenge
            );
    }
};
