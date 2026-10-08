import type { HistoricalEvent } from "../../Types/Types";
import type { EventFormData } from "../../AdminContexts/EventsAdminContext";

export interface EventSectionForm {
    title: string;
    content: string;
}

export interface EventFormState {
    name: string;
    startDate: string;
    endDate: string;
    location: string;
    era: string; // _id de l'ère
    description: string;
    sections: EventSectionForm[];
    tags: string[];
}

export const emptyEventForm: EventFormState = {
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    era: "",
    description: "",
    sections: [],
    tags: []
};

export const eventToForm = (event: HistoricalEvent): EventFormState => ({
    name: event.name,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    // L'ère est populée par l'API, on ne garde que son _id
    era: event.era?._id ?? "",
    description: event.description ?? "",
    sections: (event.sections || []).map((s) => ({
        title: s.title,
        content: s.content
    })),
    tags: [...(event.tags || [])]
});

// Retourne un message d'erreur, ou null si tout est valide
export const validateEventForm = (form: EventFormState): string | null => {

    if (form.name.trim() === "") return "Event name is required.";
    if (form.startDate.trim() === "") return "Start date is required.";
    if (form.endDate.trim() === "") return "End date is required.";
    if (form.location.trim() === "") return "Location is required.";
    if (form.era === "") return "Please choose an era.";

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

export const buildEventPayload = (form: EventFormState): EventFormData => ({
    name: form.name.trim(),
    startDate: form.startDate.trim(),
    endDate: form.endDate.trim(),
    location: form.location.trim(),
    era: form.era,
    description: form.description.trim(),

    // Les sections vides sont ignorées
    sections: form.sections
        .map((s) => ({ title: s.title.trim(), content: s.content.trim() }))
        .filter((s) => s.title !== "" && s.content !== ""),

    tags: form.tags
});