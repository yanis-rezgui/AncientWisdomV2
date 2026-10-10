import { memo, type Dispatch, type FormEvent, type SetStateAction } from "react";
import EraSelect from "./EraSelect";
import ImageField from "./ImageField";
import { Field, FormActions } from "./FormParts";
import { cardClass, inputClass, type BookFormState } from "./learnFormUtils";

interface BookFormProps {
    form: BookFormState;
    setForm: Dispatch<SetStateAction<BookFormState>>;
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

const BookForm = ({
    form, setForm, image, setImage, currentImageUrl,
    loading, submitLabel, loadingLabel, submitIcon, onSubmit, onCancel
}: BookFormProps) => (
    <form onSubmit={onSubmit} className="flex flex-col w-full items-center gap-5">

        <div className={cardClass}>
            <h2 className="text-[18px] font-bold text-[#3E3025]">General information</h2>

            <Field label="Title">
                <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g. The Histories"
                    className={inputClass}
                />
            </Field>

            <div className="flex flex-row gap-4 max-[620px]:flex-col">
                <Field label="Author">
                    <input
                        type="text"
                        value={form.author}
                        onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
                        placeholder="e.g. Herodotus"
                        className={inputClass}
                    />
                </Field>

                <Field label="Era">
                    <EraSelect
                        value={form.era}
                        onChange={(era) => setForm((prev) => ({ ...prev, era }))}
                    />
                </Field>
            </div>

            <Field label="Description">
                <textarea
                    rows={5}
                    value={form.description}
                    onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Why is this book worth reading?"
                    className={`${inputClass} resize-y`}
                />
            </Field>
        </div>

        <ImageField image={image} setImage={setImage} currentImageUrl={currentImageUrl} alt="Book cover" />

        <FormActions
            loading={loading}
            submitLabel={submitLabel}
            loadingLabel={loadingLabel}
            submitIcon={submitIcon}
            onCancel={onCancel}
        />
    </form>
);

export default memo(BookForm);
