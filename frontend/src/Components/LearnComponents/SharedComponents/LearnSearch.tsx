import { memo, useEffect, useState } from "react";
import { Search } from "lucide-react";

interface LearnSearchProps {
    placeholder: string;
    // Value currently applied in the context
    value: string;
    onSearch: (value: string) => void;
}

const LearnSearch = ({ placeholder, value, onSearch }: LearnSearchProps) => {
    const [input, setInput] = useState<string>(value);

    // Debounce: only update the context 400ms after the user stops typing
    useEffect(() => {
        if (input.trim() === value.trim()) return;

        const timer = setTimeout(() => onSearch(input), 400);
        return () => clearTimeout(timer);
    }, [input, value, onSearch]);

    return (
        <div
            className="w-[500px] max-[550px]:w-[300px] flex flex-row items-center gap-2
            bg-white rounded-lg px-3 py-2 shadow-md"
        >
            <Search size={18} className="text-[#3E3025] shrink-0" />
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={placeholder}
                aria-label={placeholder}
                className="w-full bg-transparent outline-none text-[15px] text-gray-900 placeholder:text-gray-500"
            />
        </div>
    );
};

export default memo(LearnSearch);