import type { HistoricalEra } from "../../Types/Types";
import type { Article, Frame, FrameType, TipItem, UpdateTipsData } from "../../Types/LearnTypes";
import type { BookWithId } from "../../Contexts/BookContext";
import type { MovieWithId } from "../../Contexts/MovieContext";
import type { ArticleFormData } from "../../AdminContexts/ArticleAdminContext";

// ============================================================
// Shared UI classes (same look as EraForm)
// ============================================================

export const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg", "image/avif"];

export const inputClass = `w-full p-2 rounded-[5px] border border-gray-300 bg-white
text-[14px] text-gray-900 outline-none transition-colors duration-200
focus:border-[#3E3025]`;

export const cardClass = `flex flex-col w-full bg-[#F8F5EF] rounded-lg shadow-lg p-5 gap-4
max-[620px]:p-3`;

export const labelClass = "text-[14px] font-[600] text-[#3E3025]";

export const btnBase = `text-[13px] font-[600] p-2 px-4 rounded-lg cursor-pointer
transition-opacity duration-200 hover:opacity-80 active:opacity-60
disabled:opacity-50 disabled:cursor-not-allowed`;

// ============================================================
// Helpers
// ============================================================

const eraIdOf = (era?: HistoricalEra | string | null): string => {
    if (!era) return "";
    return typeof era === "string" ? era : era._id;
};

// Retourne un message d'erreur, ou null si tout est valide
const checkRequired = (
    fields: [string, string][],
    image: File | null,
    requireImage: boolean
): string | null => {
    for (const [label, value] of fields) {
        if (value.trim() === "") return `${label} is required.`;
    }
    if (requireImage && !image) return "An image is required.";
    return null;
};

const buildFormData = (fields: Record<string, string>, image: File | null): FormData => {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => formData.append(key, value.trim()));
    // Le nom du champ doit correspondre à upload.single("image") côté route
    if (image) formData.append("image", image);
    return formData;
};

// ============================================================
// BOOK
// ============================================================

export interface BookFormState {
    title: string;
    author: string;
    era: string;
    description: string;
}

export const emptyBookForm: BookFormState = { title: "", author: "", era: "", description: "" };

export const bookToForm = (book: BookWithId): BookFormState => ({
    title: book.title,
    author: book.author,
    era: eraIdOf(book.era),
    description: book.description,
});

export const validateBookForm = (f: BookFormState, image: File | null, requireImage: boolean) =>
    checkRequired(
        [["Title", f.title], ["Author", f.author], ["Era", f.era], ["Description", f.description]],
        image,
        requireImage
    );

export const buildBookFormData = (f: BookFormState, image: File | null) =>
    buildFormData({ ...f }, image);

// ============================================================
// MOVIE
// ============================================================

export interface MovieFormState {
    title: string;
    era: string;
    description: string;
}

export const emptyMovieForm: MovieFormState = { title: "", era: "", description: "" };

export const movieToForm = (movie: MovieWithId): MovieFormState => ({
    title: movie.title,
    era: eraIdOf(movie.era),
    description: movie.description,
});

export const validateMovieForm = (f: MovieFormState, image: File | null, requireImage: boolean) =>
    checkRequired(
        [["Title", f.title], ["Era", f.era], ["Description", f.description]],
        image,
        requireImage
    );

export const buildMovieFormData = (f: MovieFormState, image: File | null) =>
    buildFormData({ ...f }, image);

// ============================================================
// FRAME
// ============================================================

export const FRAME_TYPES: FrameType[] = ["Monument", "Statue", "Map"];

export interface FrameFormState {
    title: string;
    type: FrameType;
    era: string;
    location: string;
    source: string;
    description: string;
}

export const emptyFrameForm: FrameFormState = {
    title: "",
    type: "Monument",
    era: "",
    location: "",
    source: "",
    description: "",
};

export const frameToForm = (frame: Frame): FrameFormState => ({
    title: frame.title,
    type: frame.type,
    era: eraIdOf(frame.era),
    location: frame.location,
    source: frame.source,
    description: frame.description,
});

export const validateFrameForm = (f: FrameFormState, image: File | null, requireImage: boolean) =>
    checkRequired(
        [
            ["Title", f.title],
            ["Era", f.era],
            ["Location", f.location],
            ["Description", f.description],
        ],
        image,
        requireImage
    );

export const buildFrameFormData = (f: FrameFormState, image: File | null) =>
    buildFormData({ ...f }, image);

// ============================================================
// ARTICLE
// ============================================================

export interface ArticleSectionForm {
    title: string;
    content: string;
}

export interface ArticleFormState {
    title: string;
    era: string;
    description: string;
    sections: ArticleSectionForm[];
    tags: string[];
}

export const emptyArticleForm: ArticleFormState = {
    title: "",
    era: "",
    description: "",
    sections: [],
    tags: [],
};

export const articleToForm = (article: Article): ArticleFormState => ({
    title: article.title,
    era: eraIdOf(article.era),
    description: article.description,
    sections: (article.sections || []).map((s) => ({ title: s.title, content: s.content })),
    tags: [...(article.tags || [])],
});

export const validateArticleForm = (
    f: ArticleFormState,
    image: File | null,
    requireImage: boolean
): string | null => {
    const error = checkRequired(
        [["Title", f.title], ["Era", f.era], ["Description", f.description]],
        image,
        requireImage
    );
    if (error) return error;

    const hasHalfFilledSection = f.sections.some(
        (s) => (s.title.trim() !== "") !== (s.content.trim() !== "")
    );
    if (hasHalfFilledSection) return "Each section needs both a title and a content.";

    return null;
};

export const toArticleFormData = (f: ArticleFormState, image: File | null): ArticleFormData => ({
    title: f.title.trim(),
    description: f.description.trim(),
    era: f.era,
    // Les sections vides sont ignorées
    sections: f.sections
        .map((s) => ({ title: s.title.trim(), content: s.content.trim() }))
        .filter((s) => s.title !== "" && s.content !== ""),
    tags: f.tags,
    image,
});

// ============================================================
// TIPS
// ============================================================

export const emptyTip = (): TipItem => ({ title: "", why: "", how: "" });

export const validateTipsForm = (f: UpdateTipsData): string | null => {
    if (f.introduction.trim() === "") return "Introduction is required.";
    if (f.tips.length === 0) return "Add at least one tip.";

    const incomplete = f.tips.findIndex(
        (t) => t.title.trim() === "" || t.why.trim() === "" || t.how.trim() === ""
    );
    if (incomplete !== -1) return `Tip ${incomplete + 1} needs a title, a "why" and a "how".`;

    if (f.conclusion.trim() === "") return "Conclusion is required.";

    return null;
};

export const cleanTipsForm = (f: UpdateTipsData): UpdateTipsData => ({
    introduction: f.introduction.trim(),
    conclusion: f.conclusion.trim(),
    tips: f.tips.map((t) => ({
        ...(t._id ? { _id: t._id } : {}),
        title: t.title.trim(),
        why: t.why.trim(),
        how: t.how.trim(),
    })),
});
