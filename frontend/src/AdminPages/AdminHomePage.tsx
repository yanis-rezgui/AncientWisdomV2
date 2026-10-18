import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SECTION_KEYS, useHomePageEditor, type HomeSectionKey } from "../AdminComponents/HomePageComponents/useHomePageEditor";
import HomeSectionEditor from "../AdminComponents/HomePageComponents/HomeSectionEditor";
import FaqSectionEditor from "../AdminComponents/HomePageComponents/FaqSectionEditor";




// ============================================================
// Sections configuration
// ============================================================

const SECTIONS: Record<
    HomeSectionKey,
    { title: string; description: string; icon: string }
> = {
    quotesOfTheDay: {
        title: "Quotes of the Day",
        description:
            "Quotes highlighted on the homepage. The order below is the order shown to visitors.",
        icon: "Quote",
    },
    featuredFigures: {
        title: "Featured Figures",
        description:
            "Historical figures presented to visitors when they discover Ancient Wisdom.",
        icon: "Users",
    },
    featuredEras: {
        title: "Featured Eras",
        description:
            "Historical eras to explore, displayed in the order chosen here.",
        icon: "Landmark",
    },
    featuredEvents: {
        title: "Featured Events",
        description:
            "Major historical events put forward on the homepage.",
        icon: "ScrollText",
    },
};

// ============================================================
// Page content
// ============================================================

const HomePageCMSContent = () => {
    const {
    homePage,
    sections,
    options,
    isPublished,
    setIsPublished,

    addItem,
    removeItem,
    moveItem,
    clearSection,

    // FAQ
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
    savingHomePage,
    errorMsg,
    successMsg,
    clearMessages,
} = useHomePageEditor();

    // Auto-hide the success message.
    useEffect(() => {
        if (!successMsg) return;

        const timer = setTimeout(clearMessages, 4000);

        return () => clearTimeout(timer);
    }, [successMsg, clearMessages]);

    // Warn before leaving the tab with unsaved changes.
    useEffect(() => {
        if (!isDirty) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handler);

        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    return (
        <main className="min-h-screen bg-[#F8F5EF] pt-[84px] pb-16 px-5 max-[600px]:px-3">

            <div className="max-w-[1000px] mx-auto flex flex-col gap-6">

                {/* ==================================================
                    TITLE
                ================================================== */}

                <div className="flex flex-col gap-1">
                    <h1 className="text-[1.7em] font-semibold text-[#3E3025]">
                        Home Page CMS
                    </h1>

                    <p className="text-[14px] text-[#7A726A] leading-6">
                         Manage the quotes, figures, eras, events and FAQs displayed
    on the Ancient Wisdom homepage.
                    </p>
                </div>


                {/* ==================================================
                    ACTION BAR
                ================================================== */}

                <div
                    className="
                        sticky
                        top-[68px]
                        z-30
                        flex
                        flex-row
                        items-center
                        justify-between
                        gap-3
                        px-4
                        py-3
                        bg-white
                        border
                        border-[#E7E0D6]
                        rounded-xl
                        shadow-sm
                        max-[600px]:flex-col
                        max-[600px]:items-stretch
                    "
                >

                    {/* Published toggle */}
                    <label className="flex flex-row items-center gap-3 cursor-pointer select-none">

                        <button
                            type="button"
                            role="switch"
                            aria-checked={isPublished}
                            onClick={() => setIsPublished(!isPublished)}
                            className={`
                                relative
                                w-11
                                h-6
                                rounded-full
                                transition-colors
                                duration-200
                                cursor-pointer
                                ${isPublished ? "bg-[#B89B72]" : "bg-[#CFC7BB]"}
                            `}
                        >
                            <span
                                className={`
                                    absolute
                                    top-0.5
                                    left-0.5
                                    w-5
                                    h-5
                                    rounded-full
                                    bg-white
                                    shadow
                                    transition-transform
                                    duration-200
                                    ${isPublished ? "translate-x-5" : "translate-x-0"}
                                `}
                            />
                        </button>

                        <span className="flex flex-col leading-tight">
                            <span className="text-[14px] font-semibold text-[#3E3025]">
                                {isPublished ? "Published" : "Unpublished"}
                            </span>

                            <span className="text-[12px] text-[#9A9289]">
                                {homePage?.updatedAt
                                    ? `Last update: ${new Date(
                                          homePage.updatedAt
                                      ).toLocaleString()}`
                                    : "Not saved yet"}
                            </span>
                        </span>

                    </label>


                    {/* Buttons */}
                    <div className="flex flex-row items-center gap-2 max-[600px]:justify-end">

                        {isDirty && (
                            <span className="text-[12px] text-[#B07A2A] mr-1">
                                Unsaved changes
                            </span>
                        )}

                        <button
                            type="button"
                            onClick={discardChanges}
                            disabled={!isDirty || savingHomePage}
                            className="
                                px-4
                                py-2
                                rounded-md
                                text-[14px]
                                text-[#6B645D]
                                border
                                border-[#E7E0D6]
                                hover:bg-[#F3EFE8]
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                cursor-pointer
                            "
                        >
                            Discard
                        </button>

                        <button
                            type="button"
                            onClick={saveHomePage}
                            disabled={!isDirty || savingHomePage}
                            className="
                                px-4
                                py-2
                                rounded-md
                                text-[14px]
                                font-semibold
                                bg-[#3E3025]
                                text-[#F8F5EF]
                                hover:bg-[#2D231A]
                                disabled:opacity-40
                                disabled:cursor-not-allowed
                                transition-colors
                                cursor-pointer
                            "
                        >
                            {savingHomePage ? "Saving..." : "Save changes"}
                        </button>

                    </div>

                </div>


                {/* ==================================================
                    MESSAGES
                ================================================== */}

                <AnimatePresence>

                    {errorMsg && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="
                                flex
                                flex-row
                                items-center
                                justify-between
                                gap-3
                                px-4
                                py-3
                                text-[14px]
                                text-[#8B2E2E]
                                bg-[#8B2E2E]/10
                                border
                                border-[#8B2E2E]/30
                                rounded-md
                            "
                        >
                            <span>{errorMsg}</span>

                            <button
                                type="button"
                                onClick={clearMessages}
                                aria-label="Dismiss"
                                className="cursor-pointer"
                            >
                                ✕
                            </button>
                        </motion.div>
                    )}

                    {successMsg && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="
                                px-4
                                py-3
                                text-[14px]
                                text-[#3F6B3A]
                                bg-[#3F6B3A]/10
                                border
                                border-[#3F6B3A]/30
                                rounded-md
                            "
                        >
                            {successMsg}
                        </motion.div>
                    )}

                </AnimatePresence>


                {/* ==================================================
                    SECTIONS
                ================================================== */}

                {loadingHomePage && !homePage ? (
                    <p className="text-center text-[14px] text-[#7A726A] py-16">
                        Loading homepage content...
                    </p>
                ) : (
                    <div className="flex flex-col gap-6">
                        {SECTION_KEYS.map((key) => (
                            <HomeSectionEditor
                                key={key}
                                title={SECTIONS[key].title}
                                description={SECTIONS[key].description}
                                icon={SECTIONS[key].icon}
                                selected={sections[key]}
                                available={options[key]}
                                loading={loadingOptions}
                                onAdd={(item) => addItem(key, item)}
                                onRemove={(id) => removeItem(key, id)}
                                onMove={(index, direction) =>
                                    moveItem(key, index, direction)
                                }
                                onClear={() => clearSection(key)}
                            />
                        ))}

                        <FaqSectionEditor
                            faqs={faqs}
                            onAdd={addFAQ}
                            onUpdate={updateFAQ}
                            onRemove={removeFAQ}
                            onMove={moveFAQ}
                        />
                    </div>
                )}

            </div>

        </main>
    );
};

export default HomePageCMSContent;