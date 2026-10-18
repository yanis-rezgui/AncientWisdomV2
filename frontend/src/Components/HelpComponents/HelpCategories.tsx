import { memo } from "react";
import { useHelpCenterContext } from "../../Contexts/HelpCenterContext";
import SectionHeading from "../FigureDetailsComponents/SectionHeading";

const HelpCategories = ({
    activeCategory,
    onSelect,
}: {
    activeCategory: string;
    onSelect: (slug: string) => void;
}) => {
    const { categories, loadingCategories } = useHelpCenterContext();

    if (!loadingCategories && categories.length === 0) return null;

    return (
        <section
            aria-labelledby="help-categories-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <SectionHeading id="help-categories-title" title="Browse by topic" />

            {loadingCategories && categories.length === 0 ? (
                <p className="mt-6 text-gray-700">Loading...</p>
            ) : (
                <ul className="mt-6 grid grid-cols-1 gap-4 min-[620px]:grid-cols-2 min-[920px]:grid-cols-3">
                    {categories.map((category) => {
                        const active = activeCategory === category.slug;

                        return (
                            <li key={category._id}>
                                <button
                                    type="button"
                                    aria-pressed={active}
                                    onClick={() => onSelect(active ? "" : category.slug)}
                                    className={`flex h-full w-full cursor-pointer flex-col gap-2 rounded-lg border p-5
                                    text-left transition-colors duration-300 ${
                                        active
                                            ? "border-[#8C6A43] bg-[#F0E6D8]"
                                            : "border-gray-200 bg-white hover:border-[#8C6A43]/60"
                                    }`}
                                >
                                    <span className="text-[1.1em] font-semibold leading-6 text-[#3E3025]">
                                        {category.name}
                                    </span>
                                    <span className="text-[14px] leading-6 text-gray-700">
                                        {category.description}
                                    </span>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}
        </section>
    );
};

export default memo(HelpCategories);
