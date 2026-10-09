
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