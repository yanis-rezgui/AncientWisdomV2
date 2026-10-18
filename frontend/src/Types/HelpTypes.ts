
export type HelpArticleType = "guide" | "faq" | "troubleshooting";

export interface HelpCategory {
    _id: string;
    name: string;
    slug: string;
    description: string;
    icon: string;
    order: number;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export type HelpCategoryFormData = Pick<
    HelpCategory,
    "name" | "slug" | "description"
> & {
    icon?: string;
    order?: number;
    isPublished?: boolean;
};

export interface HelpArticleSection {
    heading?: string;
    content: string;
    order: number;
}

export interface HelpArticle {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;

    // Populated by Mongoose for API responses,
    // or an ID when the category is not populated.
    category: string | Pick<
        HelpCategory,
        "_id" | "name" | "slug" | "description" | "icon"
    >;

    sections: HelpArticleSection[];
    tags: string[];
    articleType: HelpArticleType;
    isFeatured: boolean;
    isPublished: boolean;
    publishedAt: string | null;
    order: number;
    createdAt: string;
    updatedAt: string;
}

export type HelpArticleFormData = {
    title: string;
    slug: string;
    excerpt: string;
    category: string;
    sections: HelpArticleSection[];
    tags: string[];
    articleType: HelpArticleType;
    isFeatured: boolean;
    isPublished?: boolean;
    order: number;
};

export interface HelpPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface HelpArticleFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    type?: HelpArticleType;
    featured?: boolean;
}

export interface HelpAdminArticleFilters extends HelpArticleFilters {
    published?: boolean;
}

export interface HelpApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
    count?: number;
    pagination?: HelpPagination;
}
