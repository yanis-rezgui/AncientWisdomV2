import type { HistoricalEra } from "./Types";

export interface TipItem {
    _id?: string;
    title: string;
    why: string;
    how: string;
}

export interface Tips {
    _id: string;
    introduction: string;
    tips: TipItem[];
    conclusion: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateTipsData {
    introduction: string;
    tips: TipItem[];
    conclusion: string;
}


interface ImageType{
    url: string;
    publicId: string;
}

export interface Book{
    title : string;
    author : string;
    description : string;
    era: HistoricalEra;
    image : ImageType;
}

export type FrameType = "Monument" | "Statue" | "Map";

export interface Frame {
    _id: string;
    title: string;
    type: FrameType;
    image: ImageType;
    description: string;
    era: HistoricalEra;
    location: string;
    source: string;
    createdAt: string;
    updatedAt: string;
}

export interface Movie{
    _id : string;
    title :string;
    description : string;
    era : HistoricalEra;
    image: ImageType;
}

export interface Article {
    _id: string;

    title: string;
    description: string;

    image: {
        url: string;
        publicId: string;
    };

    sections: {
        title: string;
        content: string;
    }[];

    tags: string[];

    era: HistoricalEra | string;

    createdAt: Date;
    updatedAt: Date;
}