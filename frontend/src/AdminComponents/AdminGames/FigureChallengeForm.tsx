import { memo, useState, type FormEvent } from "react";
import { Plus, Trash2 } from "lucide-react";

import type { GameDifficulty } from "../../Types/Games";
import type {
    AdminFigureChallenge,
    ChallengeStatus,
    FigureChallengeInput,
} from "../../Types/GamesAdmin";
import {
    DifficultyStatusFields,
    Field,
    FieldGroup,
    FormActions,
    FormShell,
  
} from "./GameFormUI";
import {
    inputClass,
    joinCsv,
    parseCsv,
    secondaryButtonClass,
} from "./gameFormUtils";
import ImageField from "../AdminLearn/ImageField";

interface Props {
    initial?: AdminFigureChallenge;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    onSubmit: (input: FigureChallengeInput) => void | Promise<void>;
    onCancel: () => void;
    onError: (message: string) => void;
}

interface ClueDraft {
    text: string;
    points: string;
}

const FigureChallengeForm = ({
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
    const [acceptedAnswers, setAcceptedAnswers] = useState(
        joinCsv(initial?.acceptedAnswers)
    );
    const [clues, setClues] = useState<ClueDraft[]>(() =>
        initial?.clues?.length
            ? initial.clues.map((clue) => ({
                  text: clue.text,
                  points: String(clue.points),
              }))
            : [
                  { text: "", points: "" },
                  { text: "", points: "" },
              ]
    );
    const [explanation, setExplanation] = useState(initial?.explanation ?? "");
    const [historicalContext, setHistoricalContext] = useState(
        initial?.historicalContext ?? ""
    );
    const [difficulty, setDifficulty] = useState<GameDifficulty>(
        initial?.difficulty ?? "Easy"
    );
    const [status, setStatus] = useState<ChallengeStatus>(
        initial?.status ?? "draft"
    );
    const [tags, setTags] = useState(joinCsv(initial?.tags));
    const [image, setImage] = useState<File | null>(null);
    const [removeImage, setRemoveImage] = useState(false);

    const updateClue = (index: number, patch: Partial<ClueDraft>) =>
        setClues((previous) =>
            previous.map((clue, i) =>
                i === index ? { ...clue, ...patch } : clue
            )
        );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) return;

        if (title.trim().length < 2) {
            return onError("The title must contain at least 2 characters.");
        }

        if (!answer.trim()) return onError("The answer is required.");

        if (clues.length < 2) return onError("At least two clues are required.");

        const parsedClues = [];

        for (let i = 0; i < clues.length; i++) {
            const text = clues[i].text.trim();
            const points = Number(clues[i].points);

            if (!text) return onError(`Clue ${i + 1} needs a text.`);

            if (clues[i].points.trim() === "" || !Number.isFinite(points) || points < 0) {
                return onError(`Clue ${i + 1} needs a valid number of points.`);
            }

            parsedClues.push({ text, points });
        }

        void onSubmit({
            title: title.trim(),
            answer: answer.trim(),
            acceptedAnswers: parseCsv(acceptedAnswers),
            clues: parsedClues,
            explanation: explanation.trim(),
            historicalContext: historicalContext.trim(),
            difficulty,
            tags: parseCsv(tags),
            status,
            image,
            removeImage: removeImage || undefined,
        });
    };

    return (
        <FormShell onSubmit={handleSubmit}>
            <Field label="Title" required>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    placeholder="Cleopatra VII"
                    className={inputClass}
                />
            </Field>

            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                <Field label="Answer" required>
                    <input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        maxLength={150}
                        placeholder="Cleopatra"
                        className={inputClass}
                    />
                </Field>

                <Field
                    label="Accepted answers"
                    hint="Other spellings accepted, separated by commas."
                >
                    <input
                        value={acceptedAnswers}
                        onChange={(e) => setAcceptedAnswers(e.target.value)}
                        placeholder="Cleopatra VII, Cléopâtre"
                        className={inputClass}
                    />
                </Field>
            </div>

            <FieldGroup label="Clues" required hint="At least two clues.">
                <div className="flex flex-col gap-3">
                    {clues.map((clue, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-3 rounded-xl border border-[#E7E0D6] bg-[#F8F5EF] p-3 max-[600px]:flex-col"
                        >
                            <span className="mt-2 w-14 shrink-0 text-[12px] font-semibold text-[#7A726A]">
                                Clue {index + 1}
                            </span>
                            <div className="flex flex-col gap-1 w-full">
                            <textarea
                                value={clue.text}
                                onChange={(e) =>
                                    updateClue(index, { text: e.target.value })
                                }
                                maxLength={500}
                                rows={2}
                                placeholder="I was the last active ruler of the Ptolemaic Kingdom."
                                className={`${inputClass} flex-1 resize-y`}
                            />

                            <input
                                type="number"
                                min={0}
                                value={clue.points}
                                onChange={(e) =>
                                    updateClue(index, { points: e.target.value })
                                }
                                placeholder="Points"
                                className={`${inputClass} w-28 max-[600px]:w-full`}
                            />
                            </div>
                            <button
                                type="button"
                                aria-label={`Remove clue ${index + 1}`}
                                disabled={clues.length <= 2}
                                onClick={() =>
                                    setClues((previous) =>
                                        previous.filter((_, i) => i !== index)
                                    )
                                }
                                className="mt-1.5 rounded-lg p-2 text-[#8B2E2E] transition-colors hover:bg-[#8B2E2E]/10 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() =>
                            setClues((previous) => [
                                ...previous,
                                { text: "", points: "" },
                            ])
                        }
                        className={`${secondaryButtonClass} self-start`}
                    >
                        <Plus size={14} />
                        Add clue
                    </button>
                </div>
            </FieldGroup>

            <Field label="Explanation" hint="Shown after the player answers.">
                <textarea
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    maxLength={2000}
                    rows={4}
                    className={`${inputClass} resize-y`}
                />
            </Field>

            <Field label="Historical context">
                <textarea
                    value={historicalContext}
                    onChange={(e) => setHistoricalContext(e.target.value)}
                    maxLength={500}
                    rows={2}
                    className={`${inputClass} resize-y`}
                />
            </Field>

            <ImageField
             
            image={image}
                currentImageUrl={initial?.image?.url}
                setImage={setImage}
            />
           

            <Field label="Tags" hint="Separated by commas.">
                <input
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="egypt, ptolemaic, queen"
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

export default memo(FigureChallengeForm);
