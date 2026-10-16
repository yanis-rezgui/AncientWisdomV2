import { useCallback, useEffect, useMemo, useState } from "react";

import {
    useHomePageContext,
    type HomePageData,
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

// Public list endpoints used to fill the pickers.
// Several paths are tried in order until one answers (first match wins).
const OPTIONS_ENDPOINTS: Record<HomeSectionKey, string[]> = {
    quotesOfTheDay: ["/quotes", "/quote"],
    featuredFigures: ["/figure"],
    featuredEras: ["/era"],
    featuredEvents: ["/event"],
};

// Accepts { data: [...] }, { quotes: [...] } or a bare array.
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

const fetchOptions = async (key: HomeSectionKey): Promise<HomePageItem[]> => {
    for (const path of OPTIONS_ENDPOINTS[key]) {
        try {
            const res = await fetch(
                `${API_URL}${path}?page=1&limit=${OPTIONS_LIMIT}`
            );

            const body = await res.json().catch(() => ({}));

            if (res.ok) return extractItems(body);

            console.warn(`[HomePage CMS] ${path} -> HTTP ${res.status}`);
        } catch (error) {
            console.warn(`[HomePage CMS] ${path} failed:`, error);
        }
    }

    return [];
};

const OPTIONS_LIMIT = 200;
const API_URL = `${import.meta.env.VITE_API_URL}/api/v1`;

const emptySections = (): HomeSections => ({
    quotesOfTheDay: [],
    featuredFigures: [],
    featuredEras: [],
    featuredEvents: [],
});

const idsOf = (items: HomePageItem[]) => items.map((item) => item._id);

const fromHomePage = (data: HomePageData): HomeSections => ({
    quotesOfTheDay: (data.quotesOfTheDay ?? []).filter(Boolean),
    featuredFigures: (data.featuredFigures ?? []).filter(Boolean),
    featuredEras: (data.featuredEras ?? []).filter(Boolean),
    featuredEvents: (data.featuredEvents ?? []).filter(Boolean),
});

// ============================================================
// Hook: editable draft on top of HomePageContext
// ============================================================

export const useHomePageEditor = () => {
    const {
        homePage,
        getHomePage,
        updateHomePage,
        loadingHomePage,
        loadingUpdateHomePage,
        errorMsg,
        successMsg,
        clearMessages,
    } = useHomePageContext();

    const [sections, setSections] = useState<HomeSections>(emptySections());
    const [isPublished, setIsPublished] = useState(true);

    const [options, setOptions] = useState<HomeSections>(emptySections());
    const [loadingOptions, setLoadingOptions] = useState(false);

    // -----------------------------------------------------
    // Initial load
    // -----------------------------------------------------

    useEffect(() => {
        getHomePage();
    }, [getHomePage]);

    // Server data -> editable draft (after load and after save)
    useEffect(() => {
        if (!homePage) return;

        setSections(fromHomePage(homePage));
        setIsPublished(homePage.isPublished);
    }, [homePage]);

    // -----------------------------------------------------
    // Items available in the pickers
    // -----------------------------------------------------

    useEffect(() => {
        const load = async () => {
            setLoadingOptions(true);

            try {
                const results = await Promise.all(
                    SECTION_KEYS.map(
                        async (key) => [key, await fetchOptions(key)] as const
                    )
                );

                const next = emptySections();

                for (const [key, items] of results) next[key] = items;

                setOptions(next);
            } finally {
                setLoadingOptions(false);
            }
        };

        load();
    }, []);

    // -----------------------------------------------------
    // Local editing
    // -----------------------------------------------------

    const addItem = (key: HomeSectionKey, item: HomePageItem) => {
        clearMessages();

        setSections((prev) =>
            prev[key].some((i) => i._id === item._id)
                ? prev
                : { ...prev, [key]: [...prev[key], item] }
        );
    };

    const removeItem = (key: HomeSectionKey, id: string) => {
        clearMessages();

        setSections((prev) => ({
            ...prev,
            [key]: prev[key].filter((i) => i._id !== id),
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

            [list[index], list[target]] = [list[target], list[index]];

            return { ...prev, [key]: list };
        });
    };

    const clearSection = (key: HomeSectionKey) => {
        clearMessages();
        setSections((prev) => ({ ...prev, [key]: [] }));
    };

    const discardChanges = useCallback(() => {
        clearMessages();

        if (homePage) {
            setSections(fromHomePage(homePage));
            setIsPublished(homePage.isPublished);
        }
    }, [homePage, clearMessages]);

    // -----------------------------------------------------
    // Dirty detection (order matters)
    // -----------------------------------------------------

    const isDirty = useMemo(() => {
        if (!homePage) return false;

        if (homePage.isPublished !== isPublished) return true;

        const saved = fromHomePage(homePage);

        return SECTION_KEYS.some(
            (key) =>
                idsOf(sections[key]).join(",") !== idsOf(saved[key]).join(",")
        );
    }, [homePage, sections, isPublished]);

    // -----------------------------------------------------
    // Save
    // -----------------------------------------------------

    const saveHomePage = async () =>
        updateHomePage({
            quotesOfTheDay: idsOf(sections.quotesOfTheDay),
            featuredFigures: idsOf(sections.featuredFigures),
            featuredEras: idsOf(sections.featuredEras),
            featuredEvents: idsOf(sections.featuredEvents),
            isPublished,
        });

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