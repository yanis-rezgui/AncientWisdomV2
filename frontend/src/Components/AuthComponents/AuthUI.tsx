import { memo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export const labelClass = "text-[15px] font-semibold text-[#3E3025]";

export const inputClass =
    "w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-[15px] text-gray-900 " +
    "placeholder:text-gray-400 transition-colors duration-200 " +
    "focus:border-[#8C6A43] focus:outline-none focus:ring-2 focus:ring-[#8C6A43]/30";

export const submitClass =
    "w-full cursor-pointer rounded-md bg-[#3E3025] px-4 py-2.5 font-semibold text-white " +
    "transition-opacity duration-200 hover:opacity-80 active:opacity-60 " +
    "disabled:cursor-not-allowed disabled:opacity-60";

export const linkButtonClass =
    "cursor-pointer font-semibold text-[#3E3025] underline transition-opacity duration-200 " +
    "hover:opacity-70 active:opacity-60";

type FieldProps = {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    autoComplete?: string;
    type?: string;
};

export const AuthCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div>
        <h2 className="text-[1.5em] font-bold text-[#3E3025]">{title}</h2>
        <span className="mt-2 block h-[3px] w-12 rounded bg-[#8C6A43]" />
        {children}
    </div>
);

export const TextField = memo(
    ({ id, name, label, placeholder, autoComplete, type = "text" }: FieldProps) => (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className={labelClass}>
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                placeholder={placeholder}
                autoComplete={autoComplete}
                required
                className={inputClass}
            />
        </div>
    )
);

export const PasswordField = memo(
    ({ id, name, label, placeholder, autoComplete }: FieldProps) => {
        const [show, setShow] = useState(false);

        return (
            <div className="flex flex-col gap-1.5">
                <label htmlFor={id} className={labelClass}>
                    {label}
                </label>
                <div className="relative">
                    <input
                        id={id}
                        name={name}
                        type={show ? "text" : "password"}
                        placeholder={placeholder}
                        autoComplete={autoComplete}
                        required
                        className={`${inputClass} pr-10`}
                    />
                    <button
                        type="button"
                        onClick={() => setShow((prev) => !prev)}
                        aria-label={show ? "Hide password" : "Show password"}
                        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer rounded p-1
                        text-gray-500 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-[#8C6A43]"
                    >
                        {show ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                </div>
            </div>
        );
    }
);

export const FormMessage = ({ msg }: { msg?: string | null }) => (
    <div className="min-h-[20px]" aria-live="polite">
        {msg && (
            <p role="alert" className="text-center text-[14px] font-semibold text-red-800">
                {msg}
            </p>
        )}
    </div>
);