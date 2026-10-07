import type { HistoricalEra } from "../../Types/Types";

export type EraSuffix = "BC" | "AC";

export interface EraSectionForm {
    title: string;
    content: string;
}

export interface EraFormState {
    name: string;
    startYear: string;
    startSuffix: EraSuffix;
    endYear: string;
    endSuffix: EraSuffix;
    description: string;
    sections: EraSectionForm[];
}

export const emptyEraForm: EraFormState = {
    name: "",
    startYear: "",
    startSuffix: "BC",
    endYear: "",
    endSuffix: "BC",
    description: "",
    sections: [], 
  
    
};

// 500 BC -> -500 | 300 AC -> 300
const toSignedYear = (value: string, suffix: EraSuffix): number => {
    const n = Math.abs(Number(value));
    return suffix === "BC" ? -n : n;
};

// -500 -> { value: "500", suffix: "BC" }
const fromSignedYear = (year: number): { value: string; suffix: EraSuffix } => {
    return year < 0
        ? { value: String(-year), suffix: "BC" }
        : { value: String(year), suffix: "AC" };
};

export const eraToForm = (era: HistoricalEra): EraFormState => {
    const start = fromSignedYear(era.startYear);
    const end = fromSignedYear(era.endYear);

    return {
        name: era.name,
        startYear: start.value,
        startSuffix: start.suffix,
        endYear: end.value,
        endSuffix: end.suffix,
        description: era.description,
        sections: (era.sections || []).map((s) => ({
            title: s.title,
            content: s.content
        }))
    };
};

const isValidYear = (value: string) => {
    const n = Number(value);
    return value.trim() !== "" && Number.isInteger(n) && n >= 1;
};

// Retourne un message d'erreur, ou null si tout est valide
export const validateEraForm = (form: EraFormState): string | null => {

    if (form.name.trim() === "") return "Era name is required.";

    if (!isValidYear(form.startYear)) return "Start year must be a whole number greater than 0.";
    if (!isValidYear(form.endYear)) return "End year must be a whole number greater than 0.";

    if (
        toSignedYear(form.startYear, form.startSuffix) >=
        toSignedYear(form.endYear, form.endSuffix)
    ) {
        return "Start year must be before end year.";
    }

    if (form.description.trim() === "") return "Description is required.";

    const hasHalfFilledSection = form.sections.some((s) => {
        const hasTitle = s.title.trim() !== "";
        const hasContent = s.content.trim() !== "";
        return hasTitle !== hasContent;
    });

    if (hasHalfFilledSection) {
        return "Each section needs both a title and a content.";
    }

    return null;
};

export const buildEraFormData = (form: EraFormState, image: File | null): FormData => {

    const formData = new FormData();

    formData.append("name", form.name.trim());
    formData.append("startYear", String(toSignedYear(form.startYear, form.startSuffix)));
    formData.append("endYear", String(toSignedYear(form.endYear, form.endSuffix)));
    formData.append("description", form.description.trim());

    // Les sections vides sont ignorées (le backend les filtre aussi)
    const sections = form.sections
        .map((s) => ({ title: s.title.trim(), content: s.content.trim() }))
        .filter((s) => s.title !== "" && s.content !== "");

    formData.append("sections", JSON.stringify(sections));

    // Le nom du champ doit correspondre à upload.single("image") côté route
    if (image) formData.append("image", image);

    return formData;
};