import { memo, type Dispatch, type FormEvent, type SetStateAction } from "react";
import type { FrameType } from "../../Types/LearnTypes";
import EraSelect from "./EraSelect";
import ImageField from "./ImageField";
import { Field, FormActions } from "./FormParts";
import { FRAME_TYPES, cardClass, inputClass, type FrameFormState } from "./learnFormUtils";

interface FrameFormProps {
    form: FrameFormState;
    setForm: Dispatch<SetStateAction<FrameFormState>>;
    image: File | null;
    setImage: (file: File | null) => void;
    currentImageUrl?: string;
    loading: boolean;
    submitLabel: string;
    loadingLabel: string;
    submitIcon: string;
    onSubmit: (e: FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
}

const FrameForm = ({
    form, setForm, image, setImage, currentImageUrl,
    loading, submitLabel, loadingLabel, submitIcon, onSubmit, onCancel
}: FrameFormProps) => (
    <form onSubmit={onSubmit} className="flex flex-col w-full items-center gap-5">

        <div className={cardClass}>
            <h2 className="text-[18px] font-bold text-[#3E3025]">General information</h2>

            <Field label="Title">
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. The Parthenon"
                    className={inputClass}
                />
            </Field>

            <div className="flex flex-row gap-4 max-[620px]:flex-col">
                <Field label="Type">
                    <select
                        value={form.type}
                        onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value as FrameType }))}
                        className={`${inputClass} cursor-pointer`}
                    >
                        {FRAME_TYPES.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </Field>

                <Field label="Era">
                    <EraSelect
                        value={form.era}
                        onChange={(era) => setForm((prev) => ({ ...prev, era }))}
                    />
                </Field>
            </div>

            <div className="flex flex-row gap-4 max-[620px]:flex-col">
                <Field label="Location">
                    <input
                        type="text"
                        value={form.location}
                        onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
                        placeholder="e.g. Athens, Greece"
                        className={inputClass}
                    />
                </Field>

                <Field label="Source">
                    <input
                        type="text"
                        value={form.source}
                        onChange={(e) => setForm((prev) => ({ ...prev, source: e.target.value }))}
                        placeholder="e.g. Wikimedia Commons"
                        className={inputClass}
                    />
                </Field>
            </div>

            <Field label="Description">
                <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="What does this frame show?"
                    className={`${inputClass} resize-y`}
                />
            </Field>
        </div>

        <ImageField image={image} setImage={setImage} currentImageUrl={currentImageUrl} alt="Frame preview" />

        <FormActions
            loading={loading}
            submitLabel={submitLabel}
            loadingLabel={loadingLabel}
            submitIcon={submitIcon}
            onCancel={onCancel}
        />
    </form>
);

export default memo(FrameForm);
