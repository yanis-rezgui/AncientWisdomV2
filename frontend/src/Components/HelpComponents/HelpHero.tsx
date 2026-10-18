import { memo, useEffect, useState } from "react";
import { Search } from "lucide-react";

const HelpHero = ({
    search,
    onSearch,
}: {
    search: string;
    onSearch: (value: string) => void;
}) => {
    const [text, setText] = useState(search);

    // Garde le champ synchronisé avec l'URL (retour arrière, "Clear filters"…)
    useEffect(() => {
        setText(search);
    }, [search]);

    return (
        <section
            aria-labelledby="help-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 text-center">
                <h1
                    id="help-title"
                    className="text-[1.8em] font-bold leading-tight text-[#3E3025]"
                >
                    Help Center
                </h1>

                <span className="block h-[3px] w-12 rounded bg-[#8C6A43]" />

                <p className="max-w-[560px] text-[17px] leading-8 text-gray-800">
                    Find guides, answers to common questions and fixes for the
                    problems you may run into on Ancient Wisdom.
                </p>

                <form
                    role="search"
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSearch(text.trim());
                    }}
                    className="mt-2 flex w-full max-w-[520px] gap-2"
                >
                    <input
                        type="search"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Search the help center"
                        aria-label="Search the help center"
                        className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[15px]
                        text-gray-900 placeholder:text-gray-400 transition-colors duration-200
                        focus:border-[#8C6A43] focus:outline-none focus:ring-2 focus:ring-[#8C6A43]/30"
                    />
                    <button
                        type="submit"
                        className="flex shrink-0 cursor-pointer items-center gap-2 rounded-md bg-[#3E3025] px-4 py-2
                        text-[15px] font-semibold text-white transition-opacity duration-200
                        hover:opacity-80 active:opacity-60"
                    >
                        <Search size={16} aria-hidden="true" />
                        Search
                    </button>
                </form>
            </div>
        </section>
    );
};

export default memo(HelpHero);
