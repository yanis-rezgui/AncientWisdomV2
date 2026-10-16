import { memo, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Icon from "../../Icons/Icons";
import type { HomePageItem as HomeItem } from "../../AdminContexts/HomePageContext";




// ============================================================
// Helpers: resolve a readable label from any kind of item
// ============================================================

const pickString = (item: HomeItem, keys: string[]): string => {
    for (const key of keys) {
        const value = item[key];

        if (typeof value === "string" && value.trim()) return value.trim();
    }

    return "";
};

const truncate = (text: string, max = 90) =>
    text.length > max ? `${text.slice(0, max)}…` : text;

export const getItemLabel = (item: HomeItem): string =>
    truncate(
        pickString(item, ["name", "title", "text", "content", "quote"]) ||
            item._id
    );

export const getItemSubLabel = (item: HomeItem): string =>
    truncate(
        pickString(item, ["author", "authorName", "period", "date", "year"]),
        60
    );

// ============================================================
// Props
// ============================================================

interface HomeSectionEditorProps {
    title: string;
    description: string;
    icon: string;
    selected: HomeItem[];
    available: HomeItem[];
    loading: boolean;
    onAdd: (item: HomeItem) => void;
    onRemove: (id: string) => void;
    onMove: (index: number, direction: -1 | 1) => void;
    onClear: () => void;
}

const HomeSectionEditor = ({
    title,
    description,
    icon,
    selected,
    available,
    loading,
    onAdd,
    onRemove,
    onMove,
    onClear,
}: HomeSectionEditorProps) => {
    const [search, setSearch] = useState("");
    const [showPicker, setShowPicker] = useState(false);

    // Items not selected yet, filtered by the search field.
    const candidates = useMemo(() => {
        const selectedIds = new Set(selected.map((i) => i._id));
        const term = search.trim().toLowerCase();

        return available.filter((item) => {
            if (selectedIds.has(item._id)) return false;
            if (!term) return true;

            return (
                getItemLabel(item).toLowerCase().includes(term) ||
                getItemSubLabel(item).toLowerCase().includes(term)
            );
        });
    }, [available, selected, search]);

    return (
        <section className="bg-white border border-[#E7E0D6] rounded-xl overflow-hidden">

            {/* Header */}
            <div
                className="
                    flex
                    flex-row
                    items-start
                    justify-between
                    gap-3
                    p-4
                    bg-[#F8F6F1]
                    border-b
                    border-[#E7E0D6]
                    max-[600px]:flex-col
                "
            >
                <div className="flex flex-row items-start gap-3">

                    <div className="mt-0.5 text-[#B89B72]">
                        <Icon name={icon} size={22} />
                    </div>

                    <div className="flex flex-col gap-0.5">
                        <h2 className="text-[16px] font-semibold text-[#3E3025]">
                            {title}
                            <span
                                className="
                                    ml-2
                                    px-2
                                    py-0.5
                                    rounded-full
                                    bg-[#B89B72]/15
                                    text-[#7A5F3A]
                                    text-[12px]
                                    font-semibold
                                "
                            >
                                {selected.length}
                            </span>
                        </h2>

                        <p className="text-[12px] text-[#7A726A] leading-5">
                            {description}
                        </p>
                    </div>

                </div>

                <div className="flex flex-row items-center gap-2">

                    <button
                        type="button"
                        onClick={() => setShowPicker((prev) => !prev)}
                        className="
                            px-3
                            py-1.5
                            rounded-md
                            text-[13px]
                            font-semibold
                            bg-[#3E3025]
                            text-[#F8F5EF]
                            hover:bg-[#2D231A]
                            transition-colors
                            cursor-pointer
                        "
                    >
                        {showPicker ? "Close" : "+ Add"}
                    </button>

                    {selected.length > 0 && (
                        <button
                            type="button"
                            onClick={onClear}
                            className="
                                px-3
                                py-1.5
                                rounded-md
                                text-[13px]
                                text-[#8B2E2E]
                                border
                                border-[#8B2E2E]/30
                                hover:bg-[#8B2E2E]/5
                                transition-colors
                                cursor-pointer
                            "
                        >
                            Clear
                        </button>
                    )}

                </div>
            </div>


            {/* Picker */}
            <AnimatePresence initial={false}>
                {showPicker && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden border-b border-[#E7E0D6] bg-[#FBFAF7]"
                    >
                        <div className="p-4 flex flex-col gap-3">

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`Search in ${title.toLowerCase()}...`}
                                className="
                                    w-full
                                    px-3
                                    py-2
                                    text-[14px]
                                    text-[#3E3025]
                                    bg-white
                                    border
                                    border-[#E7E0D6]
                                    rounded-md
                                    outline-none
                                    focus:border-[#B89B72]
                                "
                            />

                            <div className="max-h-[260px] overflow-y-auto flex flex-col gap-1">

                                {loading && (
                                    <p className="text-[13px] text-[#7A726A] py-3 text-center">
                                        Loading...
                                    </p>
                                )}

                                {!loading && candidates.length === 0 && (
                                    <p className="text-[13px] text-[#7A726A] py-3 text-center">
                                        {available.length === 0
                                            ? "Nothing available yet."
                                            : "No more items to add."}
                                    </p>
                                )}

                                {candidates.map((item) => (
                                    <button
                                        key={item._id}
                                        type="button"
                                        onClick={() => onAdd(item)}
                                        className="
                                            flex
                                            flex-row
                                            items-center
                                            justify-between
                                            gap-3
                                            px-3
                                            py-2
                                            text-left
                                            rounded-md
                                            bg-white
                                            border
                                            border-[#E7E0D6]
                                            hover:border-[#B89B72]
                                            hover:bg-[#B89B72]/5
                                            transition-colors
                                            cursor-pointer
                                        "
                                    >
                                        <span className="flex flex-col min-w-0">
                                            <span className="text-[14px] text-[#3E3025]">
                                                {getItemLabel(item)}
                                            </span>

                                            {getItemSubLabel(item) && (
                                                <span className="text-[12px] text-[#9A9289]">
                                                    {getItemSubLabel(item)}
                                                </span>
                                            )}
                                        </span>

                                        <span className="text-[#B89B72] text-[18px] leading-none">
                                            +
                                        </span>
                                    </button>
                                ))}

                            </div>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>


            {/* Selected items */}
            <div className="p-4 flex flex-col gap-2">

                {selected.length === 0 && (
                    <p className="text-[13px] text-[#9A9289] text-center py-4">
                        Nothing selected. Use “Add” to choose what appears on the homepage.
                    </p>
                )}

                {selected.map((item, index) => (
                    <div
                        key={item._id}
                        className="
                            flex
                            flex-row
                            items-center
                            gap-3
                            px-3
                            py-2.5
                            rounded-md
                            border
                            border-[#E7E0D6]
                            bg-white
                        "
                    >

                        <span
                            className="
                                shrink-0
                                w-6
                                h-6
                                flex
                                items-center
                                justify-center
                                rounded-full
                                bg-[#3E3025]
                                text-[#F8F5EF]
                                text-[11px]
                                font-semibold
                            "
                        >
                            {index + 1}
                        </span>

                        <div className="flex flex-col flex-1 min-w-0">
                            <span className="text-[14px] text-[#3E3025] break-words">
                                {getItemLabel(item)}
                            </span>

                            {getItemSubLabel(item) && (
                                <span className="text-[12px] text-[#9A9289]">
                                    {getItemSubLabel(item)}
                                </span>
                            )}
                        </div>

                        <div className="flex flex-row items-center gap-1 shrink-0">

                            <button
                                type="button"
                                aria-label="Move up"
                                disabled={index === 0}
                                onClick={() => onMove(index, -1)}
                                className="
                                    w-7
                                    h-7
                                    rounded
                                    text-[#6B645D]
                                    hover:bg-[#F3EFE8]
                                    disabled:opacity-30
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                            >
                                ↑
                            </button>

                            <button
                                type="button"
                                aria-label="Move down"
                                disabled={index === selected.length - 1}
                                onClick={() => onMove(index, 1)}
                                className="
                                    w-7
                                    h-7
                                    rounded
                                    text-[#6B645D]
                                    hover:bg-[#F3EFE8]
                                    disabled:opacity-30
                                    disabled:cursor-not-allowed
                                    cursor-pointer
                                "
                            >
                                ↓
                            </button>

                            <button
                                type="button"
                                aria-label="Remove"
                                onClick={() => onRemove(item._id)}
                                className="
                                    w-7
                                    h-7
                                    rounded
                                    text-[#8B2E2E]
                                    hover:bg-[#8B2E2E]/10
                                    cursor-pointer
                                "
                            >
                                ✕
                            </button>

                        </div>

                    </div>
                ))}

            </div>

        </section>
    );
};

export default memo(HomeSectionEditor);