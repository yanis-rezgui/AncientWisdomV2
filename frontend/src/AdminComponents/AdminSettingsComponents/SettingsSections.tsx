import type { ReactNode } from "react";

interface SettingsSectionProps {
    title: string;
    description?: string;
    children: ReactNode;
}

const SettingsSection = ({
    title,
    description,
    children,
}: SettingsSectionProps) => {
    return (
        <section className="rounded-2xl border border-[#3E3025]/15 bg-white/60 p-5 shadow-sm sm:p-7">
            <header className="mb-5 border-b border-[#3E3025]/10 pb-4">
                <h2 className="font-serif text-xl font-semibold text-[#3E3025]">
                    {title}
                </h2>
                {description && (
                    <p className="mt-1 text-sm text-[#3E3025]/65">
                        {description}
                    </p>
                )}
            </header>

            <div className="space-y-5">{children}</div>
        </section>
    );
};

export default SettingsSection;