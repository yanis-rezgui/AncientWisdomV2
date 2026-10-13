import { memo, useEffect, useState } from "react";
import { useUsersAdminContext } from "../../AdminContexts/UsersAdminContext";
import { ROLE_OPTIONS, inputClass } from "./userFormUtils";

const UsersFilter = () => {
    const { search, setSearch, role, setRole } = useUsersAdminContext();

    // Saisie locale + debounce pour ne pas appeler l'API à chaque frappe
    const [input, setInput] = useState(search);

    useEffect(() => {
        const timer = setTimeout(() => setSearch(input), 400);
        return () => clearTimeout(timer);
    }, [input]);

    const hasFilters = input !== "" || role !== "";

    return (
        <div
            className="w-[900px] flex flex-row items-center gap-3 mt-5
            max-[950px]:w-[600px] max-[650px]:w-full max-[650px]:flex-col max-[650px]:px-4"
        >
            <div className="relative flex-1 w-full">
                <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-[#3E3025]/60 text-[14px]"></i>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Search by name or email..."
                    className={`${inputClass} pl-9 `}
                />
            </div>

            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className={`${inputClass} w-full max-[650px]:w-full cursor-pointer`}
            >
                <option value="">All roles</option>
                {ROLE_OPTIONS.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>

            {hasFilters && (
                <button
                    type="button"
                    onClick={() => {
                        setInput("");
                        setSearch("");
                        setRole("");
                    }}
                    className="text-[#3E3025] underline text-[14px] whitespace-nowrap cursor-pointer
                    transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    Reset
                </button>
            )}
        </div>
    );
};

export default memo(UsersFilter);
