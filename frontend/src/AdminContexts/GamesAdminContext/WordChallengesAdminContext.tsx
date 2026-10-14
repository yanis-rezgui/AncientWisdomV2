import { createContext, useContext, type ReactNode } from "react";

import type {
    AdminActionResult,
    AdminWordChallenge,
    WordChallengeInput,
} from "../../Types/GamesAdmin";
import { useChallengeAdminActions } from "./useChallengeAdminActions";

/* =========================
   CONTEXT TYPE
========================= */

interface WordChallengesAdminContextType {
    loadingAdd: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    showDeletePop: boolean;
    challengeToDelete: AdminWordChallenge | null;

    addWordChallenge: (
        input: WordChallengeInput
    ) => Promise<AdminActionResult<AdminWordChallenge>>;

    updateWordChallenge: (
        id: string,
        input: Partial<WordChallengeInput>
    ) => Promise<AdminActionResult<AdminWordChallenge>>;

    deleteWordChallenge: (id: string) => Promise<AdminActionResult>;

    openDeletePop: (challenge: AdminWordChallenge) => void;
    closeDeletePop: () => void;
}

const WordChallengesAdminContext =
    createContext<WordChallengesAdminContextType | null>(null);

/* =========================
   BODY BUILDER
========================= */

// Pas d'image pour ce jeu : simple corps JSON
const buildWordBody = (input: Partial<WordChallengeInput>) => ({ ...input });

/* =========================
   PROVIDER
========================= */

export const WordChallengesAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const actions = useChallengeAdminActions<
        AdminWordChallenge,
        WordChallengeInput
    >({
        path: "word-challenges",
        buildBody: buildWordBody,
    });

    return (
        <WordChallengesAdminContext.Provider
            value={{
                loadingAdd: actions.loadingAdd,
                loadingUpdate: actions.loadingUpdate,
                loadingDelete: actions.loadingDelete,
                showDeletePop: actions.showDeletePop,
                challengeToDelete: actions.challengeToDelete,
                addWordChallenge: actions.addChallenge,
                updateWordChallenge: actions.updateChallenge,
                deleteWordChallenge: actions.deleteChallenge,
                openDeletePop: actions.openDeletePop,
                closeDeletePop: actions.closeDeletePop,
            }}
        >
            {children}
        </WordChallengesAdminContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useWordChallengesAdminContext = () => {
    const context = useContext(WordChallengesAdminContext);

    if (!context) {
        throw new Error(
            "Please use useWordChallengesAdminContext inside WordChallengesAdminProvider"
        );
    }

    return context;
};
