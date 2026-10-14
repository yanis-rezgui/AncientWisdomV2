import { createContext, useContext, type ReactNode } from "react";

import type {
    AdminActionResult,
    AdminLandmarkChallenge,
    LandmarkChallengeInput,
} from "../../Types/GamesAdmin";
import {
    appendField,
    useChallengeAdminActions,
} from "./useChallengeAdminActions";

/* =========================
   CONTEXT TYPE
========================= */

interface LandmarkChallengesAdminContextType {
    loadingAdd: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    showDeletePop: boolean;
    challengeToDelete: AdminLandmarkChallenge | null;

    addLandmarkChallenge: (
        input: LandmarkChallengeInput
    ) => Promise<AdminActionResult<AdminLandmarkChallenge>>;

    updateLandmarkChallenge: (
        id: string,
        input: Partial<LandmarkChallengeInput>
    ) => Promise<AdminActionResult<AdminLandmarkChallenge>>;

    deleteLandmarkChallenge: (id: string) => Promise<AdminActionResult>;

    openDeletePop: (challenge: AdminLandmarkChallenge) => void;
    closeDeletePop: () => void;
}

const LandmarkChallengesAdminContext =
    createContext<LandmarkChallengesAdminContextType | null>(null);

/* =========================
   BODY BUILDER
========================= */

// multipart/form-data : champs en texte / JSON (options, tags) + fichier "image"
const buildLandmarkBody = (input: Partial<LandmarkChallengeInput>) => {
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

export const LandmarkChallengesAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const actions = useChallengeAdminActions<
        AdminLandmarkChallenge,
        LandmarkChallengeInput
    >({
        path: "landmark-challenges",
        buildBody: buildLandmarkBody,
    });

    return (
        <LandmarkChallengesAdminContext.Provider
            value={{
                loadingAdd: actions.loadingAdd,
                loadingUpdate: actions.loadingUpdate,
                loadingDelete: actions.loadingDelete,
                showDeletePop: actions.showDeletePop,
                challengeToDelete: actions.challengeToDelete,
                addLandmarkChallenge: actions.addChallenge,
                updateLandmarkChallenge: actions.updateChallenge,
                deleteLandmarkChallenge: actions.deleteChallenge,
                openDeletePop: actions.openDeletePop,
                closeDeletePop: actions.closeDeletePop,
            }}
        >
            {children}
        </LandmarkChallengesAdminContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useLandmarkChallengesAdminContext = () => {
    const context = useContext(LandmarkChallengesAdminContext);

    if (!context) {
        throw new Error(
            "Please use useLandmarkChallengesAdminContext inside LandmarkChallengesAdminProvider"
        );
    }

    return context;
};
