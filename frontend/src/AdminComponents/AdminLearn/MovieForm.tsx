import { memo, type Dispatch, type FormEvent, type SetStateAction } from "react";
import EraSelect from "./EraSelect";
import ImageField from "./ImageField";
import { Field, FormActions } from "./FormParts";
import { cardClass, inputClass, type MovieFormState } from "./learnFormUtils";

interface MovieFormProps {
    form: MovieFormState;
    setForm: Dispatch<SetStateAction<MovieFormState>>;
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

const MovieForm = ({
    form, setForm, image, setImage, currentImageUrl,
    loading, submitLabel, loadingLabel, submitIcon, onSubmit, onCancel
}: MovieFormProps) => (
    <form onSubmit={onSubmit} className="flex flex-col w-full items-center gap-5">

        <div className={cardClass}>
            <h2 className="text-[18px] font-bold text-[#3E3025]">General information</h2>

            <Field label="Title">
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. Gladiator"
                    className={inputClass}
                />
            </Field>

            <Field label="Era">
                <EraSelect
                    value={form.era}
                    onChange={(era) => setForm((prev) => ({ ...prev, era }))}
                />
            </Field>

            <Field label="Description">
                <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="What does this movie show about its era?"
                    className={`${inputClass} resize-y`}
                />
            </Field>
        </div>

        <ImageField image={image} setImage={setImage} currentImageUrl={currentImageUrl} alt="Movie poster" />

        <FormActions
            loading={loading}
            submitLabel={submitLabel}
            loadingLabel={loadingLabel}
            submitIcon={submitIcon}
            onCancel={onCancel}
        />
    </form>
);

export default memo(MovieForm);
