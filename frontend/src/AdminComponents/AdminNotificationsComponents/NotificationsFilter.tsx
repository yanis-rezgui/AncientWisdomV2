import { memo } from "react";
import { useNotificationsContext } from "../../Contexts/NotificationsContext";


const FILTERS: { value: boolean | undefined; label: string }[] = [
    { value: undefined, label: "All" },
    { value: false, label: "Unread" },
    { value: true, label: "Read" },
];

const NotificationsFilter = () => {
    const { read, setRead, notificationsStats } = useNotificationsContext();

    return (
        <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => {
                const isActive = read === f.value;

                return (
                    <button
                        key={String(f.value)}
                        type="button"
                        onClick={() => setRead(f.value)}
                        className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm transition-all duration-200
                            ${
                                isActive
                                    ? "border-transparent bg-[#3E3025] text-[#F8F5EF]"
                                    : "border-[#3E3025]/20 bg-transparent text-[#3E3025]/70 hover:bg-[#3E3025]/5"
                            }`}
                    >
                        {f.label}

                        {f.value === false && notificationsStats.unread > 0 && (
                            <span
                                className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium leading-none
                                ${
                                    isActive
                                        ? "bg-white/20 text-[#F8F5EF]"
                                        : "bg-red-100 text-red-700"
                                }`}
                            >
                                {notificationsStats.unread}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default memo(NotificationsFilter);