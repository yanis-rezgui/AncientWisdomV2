import { createContext, useContext, type ReactNode } from "react";

import type {
    AdminActionResult,
    AdminMemoryChallenge,
    MemoryChallengeInput,
} from "../../Types/GamesAdmin";
import {
    appendField,
    useChallengeAdminActions,
} from "./useChallengeAdminActions";

/* =========================
   CONTEXT TYPE
========================= */

interface MemoryChallengesAdminContextType {
    loadingAdd: boolean;
    loadingUpdate: boolean;
    loadingDelete: boolean;

    showDeletePop: boolean;
    challengeToDelete: AdminMemoryChallenge | null;

    addMemoryChallenge: (
        input: MemoryChallengeInput
    ) => Promise<AdminActionResult<AdminMemoryChallenge>>;

    updateMemoryChallenge: (
        id: string,
        input: Partial<MemoryChallengeInput>
    ) => Promise<AdminActionResult<AdminMemoryChallenge>>;

    deleteMemoryChallenge: (id: string) => Promise<AdminActionResult>;

    openDeletePop: (challenge: AdminMemoryChallenge) => void;
    closeDeletePop: () => void;
}

const MemoryChallengesAdminContext =
    createContext<MemoryChallengesAdminContextType | null>(null);

/* =========================
   BODY BUILDER
========================= */

// multipart/form-data :
// - chaque nouvelle image est ajoutée au champ "cardImages" (dans l'ordre des cartes)
// - la carte correspondante reçoit imageIndex = position du fichier dans cardImages
// - une image existante conservée est envoyée sous forme { image: { publicId } }
const buildMemoryBody = (input: Partial<MemoryChallengeInput>) => {
    const { cards, ...fields } = input;
    const form = new FormData();

    Object.entries(fields).forEach(([key, value]) =>
        appendField(form, key, value)
    );

    if (cards) {
        let fileCount = 0;

        const payload = cards.map((card) => {
            if (card.contentType === "text") {
                return {
                    pairId: card.pairId,
                    contentType: "text",
                    text: card.text,
                };
            }

            if (card.file) {
                form.append("cardImages", card.file);

                return {
                    pairId: card.pairId,
                    contentType: "image",
                    text: card.text,
                    imageIndex: fileCount++,
                };
            }

            return {
                pairId: card.pairId,
                contentType: "image",
                text: card.text,
                image: card.image ? { publicId: card.image.publicId } : undefined,
            };
        });

        form.append("cards", JSON.stringify(payload));
    }

    return form;
};

/* =========================
   PROVIDER
========================= */

export const MemoryChallengesAdminProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const actions = useChallengeAdminActions<
        AdminMemoryChallenge,
        MemoryChallengeInput
    >({
        path: "memory-challenges",
        buildBody: buildMemoryBody,
    });

    return (
        <MemoryChallengesAdminContext.Provider
            value={{
                loadingAdd: actions.loadingAdd,
                loadingUpdate: actions.loadingUpdate,
                loadingDelete: actions.loadingDelete,
                showDeletePop: actions.showDeletePop,
                challengeToDelete: actions.challengeToDelete,
                addMemoryChallenge: actions.addChallenge,
                updateMemoryChallenge: actions.updateChallenge,
                deleteMemoryChallenge: actions.deleteChallenge,
                openDeletePop: actions.openDeletePop,
                closeDeletePop: actions.closeDeletePop,
            }}
        >
            {children}
        </MemoryChallengesAdminContext.Provider>
    );
};

/* =========================
   CUSTOM HOOK
========================= */

export const useMemoryChallengesAdminContext = () => {
    const context = useContext(MemoryChallengesAdminContext);

    if (!context) {
        throw new Error(
            "Please use useMemoryChallengesAdminContext inside MemoryChallengesAdminProvider"
        );
    }

    return context;
};
