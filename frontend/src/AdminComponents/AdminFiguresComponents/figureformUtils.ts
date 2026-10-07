import type { HistoricalFigure } from "../../Types/Types";

export interface FigureSectionForm {
    title: string;
    content: string;
}

export interface FigureFormState {
    name: string;
    birthDate: string;
    deathDate: string;
    birthPlace: string;
    deathPlace: string;
    eras: string[];
    tags: string[]; // <-- Changé de string à string[]
    biography: FigureSectionForm[];
}

export const emptyFigureForm: FigureFormState = {
    name: "",
    birthDate: "",
    deathDate: "",
    birthPlace: "",
    deathPlace: "",
    eras: [],
    tags: [], // <-- Initialisé à []
    biography: []
};


/* ============================================================
   CONVERT FIGURE -> FORM
============================================================ */

export const figureToForm = (
    figure: HistoricalFigure
): FigureFormState => {

    return {
        name: figure.name ?? "",
        birthDate: figure.birthDate ?? "",
        deathDate: figure.deathDate ?? "",
        birthPlace: figure.birthPlace ?? "",
        deathPlace: figure.deathPlace ?? "",

        eras:
            figure.eras?.map((era) =>
                typeof era === "string"
                    ? era
                    : era._id
            ) ?? [],

        // Conversion sécurisée en tableau string[]
        tags: Array.isArray(figure.tags)
            ? figure.tags
            : typeof figure.tags === "string"
                ? (figure.tags as string).split(",").map((t) => t.trim()).filter(Boolean)
                : [],

        biography:
            figure.biography?.map((section) => ({
                title: section.title ?? "",
                content: section.content ?? ""
            })) ?? []
    };
};


/* ============================================================
   VALIDATION
============================================================ */

export const validateFigureForm = (
    form: FigureFormState
): string | null => {

    if (form.name.trim() === "") {
        return "Figure name is required.";
    }

    if (form.birthDate.trim() === "") {
        return "Birth date is required.";
    }

    if (form.deathDate.trim() === "") {
        return "Death date is required.";
    }

    if (form.birthPlace.trim() === "") {
        return "Birth place is required.";
    }

    if (form.deathPlace.trim() === "") {
        return "Death place is required.";
    }

    if (form.eras.length === 0) {
        return "At least one historical era must be selected.";
    }

    const hasHalfFilledSection = form.biography.some((section) => {
        const hasTitle = section.title.trim() !== "";
        const hasContent = section.content.trim() !== "";
        return hasTitle !== hasContent;
    });

    if (hasHalfFilledSection) {
        return "Each biography section needs both a title and content.";
    }

    return null;
};


/* ============================================================
   BUILD FORM DATA
============================================================ */

export const buildFigureFormData = (
    form: FigureFormState,
    image: File | null
): FormData => {

    const formData = new FormData();

    /* ========================================================
       BASIC INFORMATION
    ======================================================== */

    formData.append("name", form.name.trim());
    formData.append("birthDate", form.birthDate.trim());
    formData.append("deathDate", form.deathDate.trim());
    formData.append("birthPlace", form.birthPlace.trim());
    formData.append("deathPlace", form.deathPlace.trim());

    /* ========================================================
       ERAS
    ======================================================== */

    formData.append("eras", JSON.stringify(form.eras));

    /* ========================================================
       TAGS
    ======================================================== */

    // form.tags est déjà un tableau string[]
    const tags = (Array.isArray(form.tags) ? form.tags : [])
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "");

    formData.append("tags", JSON.stringify(tags));

    /* ========================================================
       BIOGRAPHY
    ======================================================== */

    const biography = form.biography
        .map((section) => ({
            title: section.title.trim(),
            content: section.content.trim()
        }))
        .filter(
            (section) =>
                section.title !== "" &&
                section.content !== ""
        );

    formData.append("biography", JSON.stringify(biography));

    /* ========================================================
       IMAGE
    ======================================================== */

    if (image) {
        formData.append("image", image);
    }

    return formData;
};