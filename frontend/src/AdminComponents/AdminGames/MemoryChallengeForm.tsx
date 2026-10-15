import { memo, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { GameDifficulty } from "../../Types/Games";
import type {
    AdminMemoryCard,
    AdminMemoryChallenge,
    ChallengeImage,
    ChallengeStatus,
    MemoryCardInput,
    MemoryChallengeInput,
    MemoryPairType,
} from "../../Types/GamesAdmin";
import {
    DifficultyStatusFields,
    Field,
    FieldGroup,
    FormActions,
    FormShell,
    ImageUpload,
} from "./GameFormUI";
import { inputClass, secondaryButtonClass } from "./gameFormUtils";

interface Props {
    initial?: AdminMemoryChallenge;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    onSubmit: (input: MemoryChallengeInput) => void | Promise<void>;
    onCancel: () => void;
    onError: (message: string) => void;
}

/* =========================
   DRAFT TYPES
========================= */

interface CardDraft {
    contentType: "text" | "image";
    text: string;
    // Nouvelle image choisie
    file: File | null;
    // Image déjà enregistrée (modification)
    image?: ChallengeImage;
}

interface PairDraft {
    a: CardDraft;
    b: CardDraft;
}

const MIN_PAIRS = 2;
const MAX_PAIRS = 15;

const PAIR_TYPES: { value: MemoryPairType; label: string }[] = [
    { value: "figure-portrait", label: "Figure & portrait" },
    { value: "landmark-name", label: "Landmark & name" },
    { value: "event-date", label: "Event & date" },
    { value: "civilization-artifact", label: "Civilization & artifact" },
    { value: "custom", label: "Custom" },
];

const emptyCard = (): CardDraft => ({
    contentType: "text",
    text: "",
    file: null,
});

const emptyPair = (): PairDraft => ({ a: emptyCard(), b: emptyCard() });

const toDraft = (card: AdminMemoryCard): CardDraft =>
    card.contentType === "image"
        ? {
              contentType: "image",
              text: card.text ?? "",
              file: null,
              image: card.image,
          }
        : { contentType: "text", text: card.text ?? "", file: null };

// Regroupe les cartes enregistrées par pairId pour retrouver les paires
const toPairs = (cards: AdminMemoryCard[]): PairDraft[] => {
    const groups = new Map<string, AdminMemoryCard[]>();

    cards.forEach((card) =>
        groups.set(card.pairId, [...(groups.get(card.pairId) ?? []), card])
    );

    const pairs = [...groups.values()]
        .filter((group) => group.length === 2)
        .map(([a, b]) => ({ a: toDraft(a), b: toDraft(b) }));

    return pairs.length >= MIN_PAIRS ? pairs : [emptyPair(), emptyPair()];
};

/* =========================
   CARD EDITOR
========================= */

const CardEditor = ({
    label,
    card,
    onChange,
}: {
    label: string;
    card: CardDraft;
    onChange: (card: CardDraft) => void;
}) => (
    <div className="flex flex-col gap-2 rounded-xl border border-[#E7E0D6] bg-[#F8F5EF] p-3">
        <div className="flex items-center justify-between gap-2">
            <span className="text-[12px] font-semibold uppercase tracking-wide text-[#7A726A]">
                {label}
            </span>

            <select
                value={card.contentType}
                onChange={(e) =>
                    onChange({
                        ...card,
                        contentType: e.target.value as CardDraft["contentType"],
                    })
                }
                aria-label={`${label} content type`}
                className="rounded-lg border border-[#E7E0D6] bg-white px-2 py-1 text-[13px] text-[#3E3025] outline-none focus:border-[#B89B72]"
            >
                <option value="text">Text</option>
                <option value="image">Image</option>
            </select>
        </div>

        {card.contentType === "text" ? (
            <input
                value={card.text}
                onChange={(e) => onChange({ ...card, text: e.target.value })}
                maxLength={300}
                placeholder="Card text"
                className={inputClass}
            />
        ) : (
            <>
                <ImageUpload
                    label="Image"
                    file={card.file}
                    currentUrl={card.image?.url}
                    onChange={(file) => onChange({ ...card, file })}
                />

                <input
                    value={card.text}
                    onChange={(e) => onChange({ ...card, text: e.target.value })}
                    maxLength={300}
                    placeholder="Label (optional)"
                    className={inputClass}
                />
            </>
        )}
    </div>
);

/* =========================
   FORM
========================= */

const MemoryChallengeForm = ({
    initial,
    loading,
    submitLabel,
    loadingLabel,
    onSubmit,
    onCancel,
    onError,
}: Props) => {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [pairType, setPairType] = useState<MemoryPairType>(
        initial?.pairType ?? "custom"
    );
    const [pairs, setPairs] = useState<PairDraft[]>(() =>
        initial ? toPairs(initial.cards) : [emptyPair(), emptyPair()]
    );
    const [explanation, setExplanation] = useState(initial?.explanation ?? "");
    const [difficulty, setDifficulty] = useState<GameDifficulty>(
        initial?.difficulty ?? "Easy"
    );
    const [status, setStatus] = useState<ChallengeStatus>(
        initial?.status ?? "draft"
    );

    const updateCard = (
        pairIndex: number,
        side: keyof PairDraft,
        card: CardDraft
    ) =>
        setPairs((previous) =>
            previous.map((pair, i) =>
                i === pairIndex ? { ...pair, [side]: card } : pair
            )
        );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) return;

        if (!title.trim()) return onError("The title is required.");

        if (pairs.length < MIN_PAIRS) {
            return onError(`At least ${MIN_PAIRS} pairs are required.`);
        }

        const cards: MemoryCardInput[] = [];

        for (let i = 0; i < pairs.length; i++) {
            const pairId = `pair-${i + 1}`;

            for (const [side, card] of [
                ["A", pairs[i].a],
                ["B", pairs[i].b],
            ] as const) {
                const label = `Pair ${i + 1}, card ${side}`;

                if (card.contentType === "text") {
                    if (!card.text.trim()) return onError(`${label} needs a text.`);

                    cards.push({
                        pairId,
                        contentType: "text",
                        text: card.text.trim(),
                    });
                    continue;
                }

                if (!card.file && !card.image) {
                    return onError(`${label} needs an image.`);
                }

                cards.push({
                    pairId,
                    contentType: "image",
                    text: card.text.trim() || undefined,
                    file: card.file ?? undefined,
                    image: card.file ? undefined : card.image,
                });
            }
        }

        void onSubmit({
            title: title.trim(),
            pairType,
            cards,
            explanation: explanation.trim(),
            difficulty,
            status,
        });
    };

    return (
        <FormShell onSubmit={handleSubmit}>
            <Field label="Title" required>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    placeholder="Roman emperors and their portraits"
                    className={inputClass}
                />
            </Field>

            <Field label="Pair type">
                <select
                    value={pairType}
                    onChange={(e) => setPairType(e.target.value as MemoryPairType)}
                    className={inputClass}
                >
                    {PAIR_TYPES.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </Field>

            <FieldGroup
                label={`Pairs (${pairs.length})`}
                required
                hint={`Each pair is two matching cards. Between ${MIN_PAIRS} and ${MAX_PAIRS} pairs.`}
            >
                <div className="flex flex-col gap-4">
                    {pairs.map((pair, index) => (
                        <div
                            key={index}
                            className="flex flex-col gap-3 rounded-2xl border border-[#E7E0D6] p-4"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-[14px] font-semibold text-[#3E3025]">
                                    Pair {index + 1}
                                </span>

                                <button
                                    type="button"
                                    aria-label={`Remove pair ${index + 1}`}
                                    disabled={pairs.length <= MIN_PAIRS}
                                    onClick={() =>
                                        setPairs((previous) =>
                                            previous.filter((_, i) => i !== index)
                                        )
                                    }
                                    className="rounded-lg p-2 text-[#8B2E2E] transition-colors hover:bg-[#8B2E2E]/10 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-3 max-[700px]:grid-cols-1">
                                <CardEditor
                                    label="Card A"
                                    card={pair.a}
                                    onChange={(card) => updateCard(index, "a", card)}
                                />
                                <CardEditor
                                    label="Card B"
                                    card={pair.b}
                                    onChange={(card) => updateCard(index, "b", card)}
                                />
                            </div>
                        </div>
                    ))}

                    <button
                        type="button"
                        disabled={pairs.length >= MAX_PAIRS}
                        onClick={() =>
                            setPairs((previous) => [...previous, emptyPair()])
                        }
                        className={`${secondaryButtonClass} self-start`}
                    >
                        <Plus size={14} />
                        Add pair
                    </button>
                </div>
            </FieldGroup>

            <Field label="Explanation" hint="Shown after the board is completed.">
                <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    maxLength={2000}
                    rows={3}
                    className={`${inputClass} resize-y`}
                />
            </Field>

            <DifficultyStatusFields
                difficulty={difficulty}
                status={status}
                onDifficultyChange={setDifficulty}
                onStatusChange={setStatus}
            />

            <FormActions
                loading={loading}
                submitLabel={submitLabel}
                loadingLabel={loadingLabel}
                onCancel={onCancel}
            />
        </FormShell>
    );
};

export default memo(MemoryChallengeForm);
