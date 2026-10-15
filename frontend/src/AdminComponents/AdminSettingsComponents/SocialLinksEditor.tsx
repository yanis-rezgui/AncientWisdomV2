import type { SocialPlatform } from "../../Types/Types";


export interface SocialLinkDraft {
    key: string; // clé locale pour React (pas envoyée au serveur)
    platform: SocialPlatform;
    url: string;
    isActive: boolean;
}

export const PLATFORM_OPTIONS: { value: SocialPlatform; label: string }[] = [
    { value: "facebook", label: "Facebook" },
    { value: "instagram", label: "Instagram" },
    { value: "youtube", label: "YouTube" },
    { value: "tiktok", label: "TikTok" },
    { value: "x", label: "X (Twitter)" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "github", label: "GitHub" },
    { value: "discord", label: "Discord" },
    { value: "other", label: "Other" },
];

interface SocialLinksEditorProps {
    links: SocialLinkDraft[];
    errors: Record<string, string>;
    onChange: (links: SocialLinkDraft[]) => void;
}

const inputClass =
    "w-full rounded-lg border bg-[#F8F5EF] px-3 py-2.5 text-sm text-[#3E3025] outline-none transition focus:border-[#3E3025] focus:ring-1 focus:ring-[#3E3025]";

const SocialLinksEditor = ({
    links,
    errors,
    onChange,
}: SocialLinksEditorProps) => {
    const updateLink = (
        key: string,
        patch: Partial<Omit<SocialLinkDraft, "key">>
    ) => {
        onChange(
            links.map((link) =>
                link.key === key ? { ...link, ...patch } : link
            )
        );
    };

    const removeLink = (key: string) => {
        onChange(links.filter((link) => link.key !== key));
    };

    const addLink = () => {
        onChange([
            ...links,
            {
                key: crypto.randomUUID(),
                platform: "facebook",
                url: "",
                isActive: true,
            },
        ]);
    };

    return (
        <div className="space-y-4">
            {links.length === 0 && (
                <p className="rounded-lg border border-dashed border-[#3E3025]/25 px-4 py-6 text-center text-sm text-[#3E3025]/60">
                    No social links yet. Add your first one below.
                </p>
            )}

            {links.map((link) => {
                const error = errors[`link-${link.key}`];

                return (
                    <div
                        key={link.key}
                        className={`rounded-xl border p-4 transition ${
                            link.isActive
                                ? "border-[#3E3025]/15 bg-white/70"
                                : "border-[#3E3025]/10 bg-[#3E3025]/5"
                        }`}
                    >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start">
                            <select
                                value={link.platform}
                                onChange={(e) =>
                                    updateLink(link.key, {
                                        platform: e.target
                                            .value as SocialPlatform,
                                    })
                                }
                                className={`${inputClass} border-[#3E3025]/20 md:w-48`}
                            >
                                {PLATFORM_OPTIONS.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            <div className="flex-1">
                                <input
                                    type="url"
                                    value={link.url}
                                    onChange={(e) =>
                                        updateLink(link.key, {
                                            url: e.target.value,
                                        })
                                    }
                                    placeholder="https://..."
                                    className={`${inputClass} ${
                                        error
                                            ? "border-red-500"
                                            : "border-[#3E3025]/20"
                                    }`}
                                />
                                {error && (
                                    <p className="mt-1 text-xs text-red-600">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-3 flex items-center justify-between">
                            <label className="flex cursor-pointer items-center gap-2 text-sm text-[#3E3025]">
                                <input
                                    type="checkbox"
                                    checked={link.isActive}
                                    onChange={(e) =>
                                        updateLink(link.key, {
                                            isActive: e.target.checked,
                                        })
                                    }
                                    className="h-4 w-4 accent-[#3E3025]"
                                />
                                {link.isActive
                                    ? "Visible on the site"
                                    : "Hidden"}
                            </label>

                            <button
                                type="button"
                                onClick={() => removeLink(link.key)}
                                className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 transition hover:bg-red-50"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                );
            })}

            <button
                type="button"
                onClick={addLink}
                className="w-full rounded-lg border border-dashed border-[#3E3025]/40 px-4 py-3 text-sm font-medium text-[#3E3025] transition hover:bg-[#3E3025]/5 sm:w-auto"
            >
                + Add a social link
            </button>
        </div>
    );
};

export default SocialLinksEditor;