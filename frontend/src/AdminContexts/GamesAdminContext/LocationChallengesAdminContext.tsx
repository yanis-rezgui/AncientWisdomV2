import { createContext, useContext, type ReactNode } from "react";

import type {
    AdminActionResult,
    AdminLocationChallenge,
    LocationChallengeInput,
} from "../../Types/GamesAdmin";
import { useChallengeAdminActions } from "./useChallengeAdminActions";

/* =========================
   CONTEXT TYPE
========================= */

interface LocationChallengesAdminContextType {
    loadingAdd: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    showDeletePop: boolean;
    challengeToDelete: AdminLocationChallenge | null;

    addLocationChallenge: (
        input: LocationChallengeInput
    ) => Promise<AdminActionResult<AdminLocationChallenge>>;

    updateLocationChallenge: (
        id: string,
        input: Partial<LocationChallengeInput>
    ) => Promise<AdminActionResult<AdminLocationChallenge>>;

    deleteLocationChallenge: (id: string) => Promise<AdminActionResult>;

    openDeletePop: (challenge: AdminLocationChallenge) => void;
    closeDeletePop: () => void;
}

const LocationChallengesAdminContext =
    createContext<LocationChallengesAdminContextType | null>(null);

/* =========================
   BODY BUILDER
========================= */

// Pas d'image pour ce jeu : simple corps JSON
const buildLocationBody = (input: Partial<LocationChallengeInput>) => ({
    ...input,
});

/* =========================
   PROVIDER
========================= */

export const LocationChallengesAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const actions = useChallengeAdminActions<
        AdminLocationChallenge,
        LocationChallengeInput
    >({
        path: "location-challenges",
        buildBody: buildLocationBody,
    });

    return (
        <LocationChallengesAdminContext.Provider
            value={{
                loadingAdd: actions.loadingAdd,
                loadingUpdate: actions.loadingUpdate,
                loadingDelete: actions.loadingDelete,
                showDeletePop: actions.showDeletePop,
                challengeToDelete: actions.challengeToDelete,
                addLocationChallenge: actions.addChallenge,
                updateLocationChallenge: actions.updateChallenge,
                deleteLocationChallenge: actions.deleteChallenge,
                openDeletePop: actions.openDeletePop,
                closeDeletePop: actions.closeDeletePop,
            }}
        >
            {children}
        </LocationChallengesAdminContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useLocationChallengesAdminContext = () => {
    const context = useContext(LocationChallengesAdminContext);

    if (!context) {
        throw new Error(
            "Please use useLocationChallengesAdminContext inside LocationChallengesAdminProvider"
        );
    }

    return context;
};
