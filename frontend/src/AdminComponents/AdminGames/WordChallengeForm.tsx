import { memo, useState, type FormEvent } from "react";

import type { GameDifficulty } from "../../Types/Games";
import type {
    AdminWordChallenge,
    ChallengeStatus,
    WordCategory,
    WordChallengeInput,
} from "../../Types/GamesAdmin";
import {
    DifficultyStatusFields,
    Field,
    FormActions,
    FormShell,
} from "./GameFormUI";
import { inputClass } from "./gameFormUtils";

interface Props {
    initial?: AdminWordChallenge;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    onSubmit: (input: WordChallengeInput) => void | Promise<void>;
    onCancel: () => void;
    onError: (message: string) => void;
}

const CATEGORIES: { value: WordCategory; label: string }[] = [
    { value: "figure", label: "Figure" },
    { value: "event", label: "Event" },
    { value: "place", label: "Place" },
    { value: "civilization", label: "Civilization" },
    { value: "era", label: "Era" },
    { value: "artifact", label: "Artifact" },
    { value: "other", label: "Other" },
];

const WordChallengeForm = ({
    initial,
    loading,
    submitLabel,
    loadingLabel,
    onSubmit,
    onCancel,
    onError,
}: Props) => {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [answer, setAnswer] = useState(initial?.answer ?? "");
    const [scrambledLetters, setScrambledLetters] = useState(
        initial?.scrambledLetters ?? ""
    );
    const [regenerate, setRegenerate] = useState(false);
    const [hint, setHint] = useState(initial?.hint ?? "");
    const [explanation, setExplanation] = useState(initial?.explanation ?? "");
    const [category, setCategory] = useState<WordCategory>(
        initial?.category ?? "other"
    );
    const [difficulty, setDifficulty] = useState<GameDifficulty>(
        initial?.difficulty ?? "Easy"
    );
    const [points, setPoints] = useState(String(initial?.points ?? 10));
    const [status, setStatus] = useState<ChallengeStatus>(
        initial?.status ?? "draft"
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) return;

        if (!title.trim()) return onError("The title is required.");
        if (!answer.trim()) return onError("The answer is required.");

        const pointsValue = Number(points);

        if (
            points.trim() === "" ||
            !Number.isInteger(pointsValue) ||
            pointsValue < 1
        ) {
            return onError("The points must be an integer of at least 1.");
        }

        // Les lettres ne sont envoyées que si l'admin les a modifiées :
        // sinon le serveur garde les anciennes, ou régénère si la réponse change.
        const scrambled = scrambledLetters.trim();
        const scrambleEdited = scrambled !== (initial?.scrambledLetters ?? "");

        void onSubmit({
            title: title.trim(),
            answer: answer.trim(),
            scrambledLetters: scrambleEdited && scrambled ? scrambled : undefined,
            regenerateScramble: regenerate || undefined,
            hint: hint.trim(),
            explanation: explanation.trim(),
            category,
            difficulty,
            points: pointsValue,
            status,
        });
    };

    return (
        <FormShell onSubmit={handleSubmit}>
            <Field label="Title" required hint="Internal name, never shown to players.">
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    placeholder="Roman emperor"
                    className={inputClass}
                />
            </Field>

            <Field label="Answer" required hint="The word the player must find.">
                <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    maxLength={100}
                    placeholder="Augustus"
                    className={inputClass}
                />
            </Field>

            <Field
                label="Scrambled letters"
                hint={
                    initial
                        ? "Must contain exactly the letters of the answer. If the answer changes and you leave this untouched, new letters are generated."
                        : "Leave empty to generate them automatically."
                }
            >
                <input
                    value={scrambledLetters}
                    onChange={(e) => setScrambledLetters(e.target.value)}
                    maxLength={100}
                    placeholder="SUTAGUSU"
                    className={inputClass}
                />
            </Field>

            {initial && (
                <label className="flex items-center gap-2 text-[13px] text-[#3E3025]">
                    <input
                        type="checkbox"
                        checked={regenerate}
                        onChange={(e) => setRegenerate(e.target.checked)}
                    />
                    Generate a new scramble when saving
                </label>
            )}

            <Field label="Hint" hint="Halves the points when used.">
                <input
                    value={hint}
                    onChange={(e) => setHint(e.target.value)}
                    maxLength={500}
                    className={inputClass}
                />
            </Field>

            <Field label="Explanation" hint="Shown after the player answers.">
                <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    maxLength={1000}
                    rows={3}
                    className={`${inputClass} resize-y`}
                />
            </Field>

            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                <Field label="Category">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as WordCategory)}
                        className={inputClass}
                    >
                        {CATEGORIES.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </Field>

                <Field label="Points">
                    <input
                        type="number"
                        min={1}
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className={inputClass}
                    />
                </Field>
            </div>

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

export default memo(WordChallengeForm);
