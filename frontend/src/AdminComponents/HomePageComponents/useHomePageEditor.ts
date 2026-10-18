
import { useCallback, useEffect, useMemo, useState } from "react";

import {
    useHomePageContext,
    type HomePageData,
    type HomePageFAQ,
    type HomePageItem,
} from "../../AdminContexts/HomePageContext";

// ============================================================
// Types
// ============================================================

export type HomeSectionKey =
    | "quotesOfTheDay"
    | "featuredFigures"
    | "featuredEras"
    | "featuredEvents";

export type HomeSections = Record<HomeSectionKey, HomePageItem[]>;

export const SECTION_KEYS: HomeSectionKey[] = [
    "quotesOfTheDay",
    "featuredFigures",
    "featuredEras",
    "featuredEvents",
];

const OPTIONS_ENDPOINTS: Record<HomeSectionKey, string[]> = {
    quotesOfTheDay: ["/quotes", "/quote"],
    featuredFigures: ["/figure"],
    featuredEras: ["/era"],
    featuredEvents: ["/event"],
};

const OPTIONS_LIMIT = 200;
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const extractItems = (body: unknown): HomePageItem[] => {
    if (Array.isArray(body)) return body as HomePageItem[];

    if (body && typeof body === "object") {
        const record = body as Record<string, unknown>;

        for (const key of ["data", "quotes", "items", "results"]) {
            if (Array.isArray(record[key])) {
                return record[key] as HomePageItem[];
            }
        }
    }

    return [];
};

const fetchOptions = async (
    key: HomeSectionKey
): Promise<HomePageItem[]> => {
    for (const path of OPTIONS_ENDPOINTS[key]) {
        try {
            const res = await fetch(
                `${API_URL}${path}?page=1&limit=${OPTIONS_LIMIT}`
            );

            const body = await res.json().catch(() => ({}));

            if (res.ok) return extractItems(body);

            console.warn(
                `[HomePage CMS] ${path} -> HTTP ${res.status}`
            );
        } catch (error) {
            console.warn(`[HomePage CMS] ${path} failed:`, error);
        }
    }

    return [];
};

const emptySections = (): HomeSections => ({
    quotesOfTheDay: [],
    featuredFigures: [],
    featuredEras: [],
    featuredEvents: [],
});

const idsOf = (items: HomePageItem[]) =>
    items.map((item) => item._id);

const fromHomePage = (data: HomePageData): HomeSections => ({
    quotesOfTheDay: (data.quotesOfTheDay ?? []).filter(Boolean),
    featuredFigures: (data.featuredFigures ?? []).filter(Boolean),
    featuredEras: (data.featuredEras ?? []).filter(Boolean),
    featuredEvents: (data.featuredEvents ?? []).filter(Boolean),
});

const normalizeFAQs = (
    faqs: HomePageFAQ[] = []
): HomePageFAQ[] =>
    faqs.map((faq, index) => ({
        ...(faq._id ? { _id: faq._id } : {}),
        question: faq.question ?? "",
        answer: faq.answer ?? "",
        order: index,
        isPublished: faq.isPublished ?? true,
    }));

const sameFAQs = (
    first: HomePageFAQ[],
    second: HomePageFAQ[]
): boolean =>
    JSON.stringify(normalizeFAQs(first)) ===
    JSON.stringify(normalizeFAQs(second));

// ============================================================
// Hook
// ============================================================

export const useHomePageEditor = () => {
    const {
        homePage,
        updateHomePage,
        loadingHomePage,
        loadingUpdateHomePage,
        errorMsg,
        successMsg,
        clearMessages,
    } = useHomePageContext();

    const [sections, setSections] =
        useState<HomeSections>(emptySections);

    const [faqs, setFAQs] = useState<HomePageFAQ[]>([]);

    const [isPublished, setIsPublished] = useState(true);

    const [options, setOptions] =
        useState<HomeSections>(emptySections);

    const [loadingOptions, setLoadingOptions] = useState(false);

    // -----------------------------------------------------
    // Server data -> editable draft
    // -----------------------------------------------------

    useEffect(() => {
        if (!homePage) return;

        setSections(fromHomePage(homePage));
        setFAQs(normalizeFAQs(homePage.faqs ?? []));
        setIsPublished(homePage.isPublished);
    }, [homePage]);

    // -----------------------------------------------------
    // Load available items for the four existing sections
    // -----------------------------------------------------

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoadingOptions(true);

            try {
                const results = await Promise.all(
                    SECTION_KEYS.map(
                        async (key) =>
                            [key, await fetchOptions(key)] as const
                    )
                );

                if (cancelled) return;

                const next = emptySections();

                for (const [key, items] of results) {
                    next[key] = items;
                }

                setOptions(next);
            } finally {
                if (!cancelled) {
                    setLoadingOptions(false);
                }
            }
        };

        void load();

        return () => {
            cancelled = true;
        };
    }, []);

    // -----------------------------------------------------
    // Existing section operations
    // -----------------------------------------------------

    const addItem = (key: HomeSectionKey, item: HomePageItem) => {
        clearMessages();

        setSections((prev) =>
            prev[key].some((existing) => existing._id === item._id)
                ? prev
                : { ...prev, [key]: [...prev[key], item] }
        );
    };

    const removeItem = (key: HomeSectionKey, id: string) => {
        clearMessages();

        setSections((prev) => ({
            ...prev,
            [key]: prev[key].filter((item) => item._id !== id),
        }));
    };

    const moveItem = (
        key: HomeSectionKey,
        index: number,
        direction: -1 | 1
    ) => {
        clearMessages();

        setSections((prev) => {
            const list = [...prev[key]];
            const target = index + direction;

            if (target < 0 || target >= list.length) return prev;

            [list[index], list[target]] = [
                list[target],
                list[index],
            ];

            return { ...prev, [key]: list };
        });
    };

    const clearSection = (key: HomeSectionKey) => {
        clearMessages();

        setSections((prev) => ({ ...prev, [key]: [] }));
    };

    // -----------------------------------------------------
    // FAQ operations
    // -----------------------------------------------------

    const addFAQ = () => {
        clearMessages();

        setFAQs((prev) => [
            ...prev,
            {
                question: "",
                answer: "",
                order: prev.length,
                isPublished: true,
            },
        ]);
    };

    const updateFAQ = (
        index: number,
        changes: Partial<HomePageFAQ>
    ) => {
        clearMessages();

        setFAQs((prev) =>
            prev.map((faq, currentIndex) =>
                currentIndex === index
                    ? { ...faq, ...changes }
                    : faq
            )
        );
    };

    const removeFAQ = (index: number) => {
        clearMessages();

        setFAQs((prev) =>
            prev
                .filter((_, currentIndex) => currentIndex !== index)
                .map((faq, order) => ({ ...faq, order }))
        );
    };

    const moveFAQ = (index: number, direction: -1 | 1) => {
        clearMessages();

        setFAQs((prev) => {
            const target = index + direction;

            if (target < 0 || target >= prev.length) return prev;

            const next = [...prev];

            [next[index], next[target]] = [
                next[target],
                next[index],
            ];

            return next.map((faq, order) => ({
                ...faq,
                order,
            }));
        });
    };

    // -----------------------------------------------------
    // Discard changes
    // -----------------------------------------------------

    const discardChanges = useCallback(() => {
        clearMessages();

        if (!homePage) return;

        setSections(fromHomePage(homePage));
        setFAQs(normalizeFAQs(homePage.faqs ?? []));
        setIsPublished(homePage.isPublished);
    }, [homePage, clearMessages]);

    // -----------------------------------------------------
    // Dirty detection
    // -----------------------------------------------------

    const isDirty = useMemo(() => {
        if (!homePage) return false;

        if (homePage.isPublished !== isPublished) return true;

        const savedSections = fromHomePage(homePage);

        const sectionsChanged = SECTION_KEYS.some(
            (key) =>
                idsOf(sections[key]).join(",") !==
                idsOf(savedSections[key]).join(",")
        );

        if (sectionsChanged) return true;

        return !sameFAQs(faqs, homePage.faqs ?? []);
    }, [homePage, sections, faqs, isPublished]);

    // -----------------------------------------------------
    // Save
    // -----------------------------------------------------


const saveHomePage = async (): Promise<boolean> => {
    clearMessages();

    const invalidFAQIndex = faqs.findIndex(
        (faq) =>
            !faq.question.trim() ||
            !faq.answer.trim()
    );

    if (invalidFAQIndex !== -1) {
        console.error(
            `FAQ invalide à l'index ${invalidFAQIndex}:`,
            faqs[invalidFAQIndex]
        );

        return false;
    }

    return updateHomePage({
        quotesOfTheDay: idsOf(sections.quotesOfTheDay),
        featuredFigures: idsOf(sections.featuredFigures),
        featuredEras: idsOf(sections.featuredEras),
        featuredEvents: idsOf(sections.featuredEvents),
        faqs: normalizeFAQs(faqs),
        isPublished,
    });
};


    return {
        homePage,
        sections,
        options,
        isPublished,
        setIsPublished,

        addItem,
        removeItem,
        moveItem,
        clearSection,

        faqs,
        addFAQ,
        updateFAQ,
        removeFAQ,
        moveFAQ,

        isDirty,
        discardChanges,
        saveHomePage,

        loadingHomePage,
        loadingOptions,
        savingHomePage: loadingUpdateHomePage,

        errorMsg,
        successMsg,
        clearMessages,
    };
};
