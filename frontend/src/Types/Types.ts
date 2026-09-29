

export interface Image {
    url: string;
    publicId: string;
}

export interface BiographySection {
    title: string;
    content: string;
}

/* =========================
   HISTORICAL ERA
========================= */

export interface HistoricalEra {
    _id: string;
    name: string;
    startYear: number;
    endYear: number;
    description: string;
    image: Image;
    createdAt: string;
    updatedAt: string;
}


/* =========================
   HISTORICAL FIGURE
========================= */

export interface HistoricalFigure {
    _id: string;
    name: string;
    birthDate: string;
    birthPlace: string;
    deathDate: string;
    deathPlace: string;

    // Populated by the API
    eras: HistoricalEra[];

    biography: BiographySection[];

    image: Image;

    tags: string[];

    createdAt: string;
    updatedAt: string;
}


/* =========================
   EVENT
========================= */

export interface EventSection {
    title: string;
    content: string;
}

export interface HistoricalEvent {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    location: string;

    // Populated by the API
    era: HistoricalEra;

    description?: string;

    sections: EventSection[];

    tags: string[];

    createdAt: string;
    updatedAt: string;
}


/* =========================
   QUOTE
========================= */

export interface Quote {
    _id: string;
    text: string;

    // Populated by the API
    author: HistoricalFigure;

    // Populated by the API
    era: HistoricalEra;

    source: string;
    tags: string[];

    createdAt: string;
    updatedAt: string;
}


/* =========================
   PAGINATION
========================= */

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}


export interface EventFilterType{
    search : string;
    era: string;
}

export interface FigureFilterType{
    search : string;
    era : string;
}

export interface QuoteFilterType{
    search : string,
    era : string,
    author : string
}