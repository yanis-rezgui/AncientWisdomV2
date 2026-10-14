import { createContext, useContext, type ReactNode } from "react";

import type {
    AdminActionResult,
    AdminFigureChallenge,
    FigureChallengeInput,
} from "../../Types/GamesAdmin";
import {
    appendField,
    useChallengeAdminActions,
} from "./useChallengeAdminActions";

/* =========================
   CONTEXT TYPE
========================= */

interface FigureChallengesAdminContextType {
    loadingAdd: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    showDeletePop: boolean;
    challengeToDelete: AdminFigureChallenge | null;

    addFigureChallenge: (
        input: FigureChallengeInput
    ) => Promise<AdminActionResult<AdminFigureChallenge>>;

    updateFigureChallenge: (
        id: string,
        input: Partial<FigureChallengeInput>
    ) => Promise<AdminActionResult<AdminFigureChallenge>>;

    deleteFigureChallenge: (id: string) => Promise<AdminActionResult>;

    openDeletePop: (challenge: AdminFigureChallenge) => void;
    closeDeletePop: () => void;
}

const FigureChallengesAdminContext =
    createContext<FigureChallengesAdminContextType | null>(null);

/* =========================
   BODY BUILDER
========================= */

// multipart/form-data : champs en texte / JSON + fichier "image"
const buildFigureBody = (input: Partial<FigureChallengeInput>) => {
    const { image, ...fields } = input;
    const form = new FormData();

    Object.entries(fields).forEach(([key, value]) =>
        appendField(form, key, value)
    );

    if (image) form.append("image", image);

    return form;
};

/* =========================
   PROVIDER
========================= */

export const FigureChallengesAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const actions = useChallengeAdminActions<
        AdminFigureChallenge,
        FigureChallengeInput
    >({
        path: "figure-challenges",
        buildBody: buildFigureBody,
    });

    return (
        <FigureChallengesAdminContext.Provider
            value={{
                loadingAdd: actions.loadingAdd,
                loadingUpdate: actions.loadingUpdate,
                loadingDelete: actions.loadingDelete,
                showDeletePop: actions.showDeletePop,
                challengeToDelete: actions.challengeToDelete,
                addFigureChallenge: actions.addChallenge,
                updateFigureChallenge: actions.updateChallenge,
                deleteFigureChallenge: actions.deleteChallenge,
                openDeletePop: actions.openDeletePop,
                closeDeletePop: actions.closeDeletePop,
            }}
        >
            {children}
        </FigureChallengesAdminContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useFigureChallengesAdminContext = () => {
    const context = useContext(FigureChallengesAdminContext);

    if (!context) {
        throw new Error(
            "Please use useFigureChallengesAdminContext inside FigureChallengesAdminProvider"
        );
    }

    return context;
};
