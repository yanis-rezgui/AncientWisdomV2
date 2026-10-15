import { memo } from "react";

import type {
    AdminFigureChallenge,
    AdminLandmarkChallenge,
    AdminLocationChallenge,
    AdminMemoryChallenge,
    AdminWordChallenge,
} from "../../Types/GamesAdmin";
import type { AdminChallenge, GameKey } from "./gamesAdminConfig";
import FigureChallengeForm from "./FigureChallengeForm";
import LandmarkChallengeForm from "./LandmarkChallengeForm";
import LocationChallengeForm from "./LocationChallengeForm";
import MemoryChallengeForm from "./MemoryChallengeForm";
import WordChallengeForm from "./WordChallengeForm";

interface Props {
    game: GameKey;
    // Présent en mode modification
    initial?: AdminChallenge;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    // Chaque formulaire envoie son propre type d'input
    onSubmit: (input: unknown) => void | Promise<void>;
    onCancel: () => void;
    onError: (message: string) => void;
}

const ChallengeForm = ({ game, initial, ...rest }: Props) => {
    switch (game) {
        case "figure":
            return (
                <FigureChallengeForm
                    {...rest}
                    initial={initial as AdminFigureChallenge | undefined}
                />
            );
        case "landmark":
            return (
                <LandmarkChallengeForm
                    {...rest}
                    initial={initial as AdminLandmarkChallenge | undefined}
                />
            );
        case "location":
            return (
                <LocationChallengeForm
                    {...rest}
                    initial={initial as AdminLocationChallenge | undefined}
                />
            );
        case "memory":
            return (
                <MemoryChallengeForm
                    {...rest}
                    initial={initial as AdminMemoryChallenge | undefined}
                />
            );
        case "word":
            return (
                <WordChallengeForm
                    {...rest}
                    initial={initial as AdminWordChallenge | undefined}
                />
            );
    }
};

export default memo(ChallengeForm);
