import { memo, useState, type FormEvent } from "react";

import type { GameDifficulty } from "../../Types/Games";
import type {
    AdminLocationChallenge,
    ChallengeCoordinates,
    ChallengeStatus,
    LocationChallengeInput,
} from "../../Types/GamesAdmin";
import CoordinatePicker from "./CoordinatePicker";
import {
    DifficultyStatusFields,
    Field,
    FieldGroup,
    FormActions,
    FormShell,
} from "./GameFormUI";
import { inputClass } from "./gameFormUtils";

interface Props {
    initial?: AdminLocationChallenge;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    onSubmit: (input: LocationChallengeInput) => void | Promise<void>;
    onCancel: () => void;
    onError: (message: string) => void;
}

const toNumber = (value: string): number | null => {
    if (value.trim() === "") return null;

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
};

const LocationChallengeForm = ({
    initial,
    loading,
    submitLabel,
    loadingLabel,
    onSubmit,
    onCancel,
    onError,
}: Props) => {
    const [title, setTitle] = useState(initial?.title ?? "");
    const [question, setQuestion] = useState(initial?.question ?? "");
    const [answer, setAnswer] = useState(initial?.answer ?? "");
    const [latitude, setLatitude] = useState(
        initial ? String(initial.coordinates.latitude) : ""
    );
    const [longitude, setLongitude] = useState(
        initial ? String(initial.coordinates.longitude) : ""
    );
    const [mapZoom, setMapZoom] = useState(String(initial?.mapZoom ?? 4));
    const [hint, setHint] = useState(initial?.hint ?? "");
    const [explanation, setExplanation] = useState(initial?.explanation ?? "");
    const [difficulty, setDifficulty] = useState<GameDifficulty>(
        initial?.difficulty ?? "Easy"
    );
    const [points, setPoints] = useState(String(initial?.points ?? 100));
    const [status, setStatus] = useState<ChallengeStatus>(
        initial?.status ?? "draft"
    );

    const lat = toNumber(latitude);
    const lng = toNumber(longitude);
    const position: ChallengeCoordinates | null =
        lat !== null && lng !== null && Math.abs(lat) <= 90 && Math.abs(lng) <= 180
            ? { latitude: lat, longitude: lng }
            : null;

    const handlePick = (coordinates: ChallengeCoordinates) => {
        setLatitude(coordinates.latitude.toFixed(5));
        setLongitude(coordinates.longitude.toFixed(5));
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (loading) return;

        if (!title.trim()) return onError("The title is required.");
        if (!question.trim()) return onError("The question is required.");
        if (!answer.trim()) return onError("The answer is required.");

        if (!position) {
            return onError(
                "Pick a location on the map (latitude between -90 and 90, longitude between -180 and 180)."
            );
        }

        const zoom = toNumber(mapZoom);

        if (zoom === null || !Number.isInteger(zoom) || zoom < 1 || zoom > 18) {
            return onError("The map zoom must be an integer between 1 and 18.");
        }

        const pointsValue = toNumber(points);

        if (
            pointsValue === null ||
            !Number.isInteger(pointsValue) ||
            pointsValue < 1
        ) {
            return onError("The points must be an integer of at least 1.");
        }

        void onSubmit({
            title: title.trim(),
            question: question.trim(),
            answer: answer.trim(),
            coordinates: position,
            mapZoom: zoom,
            hint: hint.trim(),
            explanation: explanation.trim(),
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
                    placeholder="The Colosseum"
                    className={inputClass}
                />
            </Field>

            <Field label="Question" required>
                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    maxLength={500}
                    placeholder="Where is the Colosseum located?"
                    className={inputClass}
                />
            </Field>

            <Field
                label="Answer"
                required
                hint="Name of the place, revealed after the player answers."
            >
                <input
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    maxLength={200}
                    placeholder="Rome, Italy"
                    className={inputClass}
                />
            </Field>

            <FieldGroup
                label="Correct location"
                required
                hint="Click on the map or type the coordinates."
            >
                <CoordinatePicker position={position} onPick={handlePick} />

                <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                    <Field label="Latitude">
                        <input
                            type="number"
                            step="any"
                            min={-90}
                            max={90}
                            value={latitude}
                            onChange={(e) => setLatitude(e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Longitude">
                        <input
                            type="number"
                            step="any"
                            min={-180}
                            max={180}
                            value={longitude}
                            onChange={(e) => setLongitude(e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                </div>
            </FieldGroup>

            <div className="grid grid-cols-2 gap-4 max-[600px]:grid-cols-1">
                <Field label="Map zoom" hint="Between 1 and 18.">
                    <input
                        type="number"
                        min={1}
                        max={18}
                        value={mapZoom}
                        onChange={(e) => setMapZoom(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Points" hint="Maximum points for this challenge.">
                    <input
                        type="number"
                        min={1}
                        value={points}
                        onChange={(e) => setPoints(e.target.value)}
                        className={inputClass}
                    />
                </Field>
            </div>

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

export default memo(LocationChallengeForm);
