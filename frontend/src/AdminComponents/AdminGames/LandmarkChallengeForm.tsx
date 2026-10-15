import { memo, useState, type FormEvent } from "react";

import type { GameDifficulty } from "../../Types/Games";
import type {
    AdminLandmarkChallenge,
    ChallengeStatus,
    LandmarkChallengeInput,
} from "../../Types/GamesAdmin";
import {
    DifficultyStatusFields,
    Field,
    FieldGroup,
    FormActions,
    FormShell,
} from "./GameFormUI";
import { inputClass, joinCsv, parseCsv } from "./gameFormUtils";
import ImageField from "../AdminLearn/ImageField";

interface Props {
    initial?: AdminLandmarkChallenge;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    onSubmit: (input: LandmarkChallengeInput) => void | Promise<void>;
    onCancel: () => void;
    onError: (message: string) => void;
}

const OPTION_COUNT = 4;

const getInitialOptions = (initial?: AdminLandmarkChallenge): string[] =>
    initial?.options?.length === OPTION_COUNT
        ? [...initial.options]
        : Array.from({ length: OPTION_COUNT }, () => "");

const getInitialCorrectIndex = (initial?: AdminLandmarkChallenge): number => {
    if (!initial) return 0;

    const index = initial.options.findIndex(
        (option) => option.toLowerCase() === initial.answer.toLowerCase()
    );

    return index === -1 ? 0 : index;
};

const LandmarkChallengeForm = ({
    initial,
    loading,
    submitLabel,
    loadingLabel,
    onSubmit,
    onCancel,
    onError,
}: Props) => {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [options, setOptions] = useState<string[]>(() =>
        getInitialOptions(initial)
    );
    const [correctIndex, setCorrectIndex] = useState(() =>
        getInitialCorrectIndex(initial)
    );
    const [hint, setHint] = useState(initial?.hint ?? "");
    const [explanation, setExplanation] = useState(initial?.explanation ?? "");
    const [location, setLocation] = useState(initial?.location ?? "");
    const [civilization, setCivilization] = useState(
        initial?.civilization ?? ""
    );
    const [difficulty, setDifficulty] = useState<GameDifficulty>(
        initial?.difficulty ?? "Easy"
    );
    const [status, setStatus] = useState<ChallengeStatus>(
        initial?.status ?? "draft"
    );
    const [tags, setTags] = useState(joinCsv(initial?.tags));
    const [image, setImage] = useState<File | null>(null);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) return;

        if (!title.trim()) return onError("The title is required.");

        const cleanedOptions = options.map((option) => option.trim());

        if (cleanedOptions.some((option) => !option)) {
            return onError("The four options are required.");
        }

        if (
            new Set(cleanedOptions.map((option) => option.toLowerCase())).size !==
            OPTION_COUNT
        ) {
            return onError("The four options must be different.");
        }

        if (!initial && !image) return onError("An image is required.");

        void onSubmit({
            title: title.trim(),
            answer: cleanedOptions[correctIndex],
            options: cleanedOptions,
            hint: hint.trim(),
            explanation: explanation.trim(),
            location: location.trim(),
            civilization: civilization.trim(),
            difficulty,
            tags: parseCsv(tags),
            status,
            image,
        });
    };

    return (
        <FormShell onSubmit={handleSubmit}>
            <Field label="Title" required>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    placeholder="The Great Pyramid of Giza"
                    className={inputClass}
                />
            </Field>

            <ImageField
            image={image}
            currentImageUrl={initial?.image?.url}
            setImage={setImage}

            />


            <FieldGroup
                label="Options"
                required
                hint="Four different options. Select the correct one."
            >
                <div className="flex flex-col gap-2">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <input
                                type="radio"
                                name="correct-option"
                                checked={correctIndex === index}
                                onChange={() => setCorrectIndex(index)}
                                aria-label={`Option ${index + 1} is the correct answer`}
                            />

                            <input
                                value={option}
                                onChange={(e) =>
                                    setOptions((previous) =>
                                        previous.map((item, i) =>
                                            i === index ? e.target.value : item
                                        )
                                    )
                                }
                                placeholder={`Option ${index + 1}`}
                                className={inputClass}
                            />

                            <span
                                className={`w-16 shrink-0 text-[12px] font-semibold ${
                                    correctIndex === index
                                        ? "text-green-700"
                                        : "text-transparent"
                                }`}
                            >
                                Correct
                            </span>
                        </div>
                    ))}
                </div>
            </FieldGroup>

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
                    maxLength={2000}
                    rows={4}
                    className={`${inputClass} resize-y`}
                />
            </Field>

            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                <Field label="Location">
                    <input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        maxLength={200}
                        placeholder="Giza, Egypt"
                        className={inputClass}
                    />
                </Field>

                <Field label="Civilization">
                    <input
                        value={civilization}
                        onChange={(e) => setCivilization(e.target.value)}
                        maxLength={150}
                        placeholder="Ancient Egypt"
                        className={inputClass}
                    />
                </Field>
            </div>

            <Field label="Tags" hint="Separated by commas.">
                <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    className={inputClass}
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

export default memo(LandmarkChallengeForm);
