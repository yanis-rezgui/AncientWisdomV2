import { useCallback, useEffect, useMemo, useState } from "react";
import type { SocialLinkDraft } from "../AdminComponents/AdminSettingsComponents/SocialLinksEditor";
import type { SettingsInput } from "../Types/Types";
import { useSettingsContext } from "../Contexts/SettingsContext";
import type { ToastState } from "../AdminComponents/AdminLearn/useLearnToast";
import SettingsSection from "../AdminComponents/AdminSettingsComponents/SettingsSections";
import SocialLinksEditor from "../AdminComponents/AdminSettingsComponents/SocialLinksEditor";
import SettingsToast from "../AdminComponents/AdminSettingsComponents/SettingsToast";



const NAME_MAX = 100;
const SLOGAN_MAX = 200;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormState {
    name: string;
    slogan: string;
    email: string;
    socialLinks: SocialLinkDraft[];
}

const emptyForm: FormState = {
    name: "",
    slogan: "",
    email: "",
    socialLinks: [],
};

const isValidUrl = (value: string) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

// Transforme le formulaire en payload propre (aussi utilisé pour détecter les changements)
const toPayload = (form: FormState): Required<SettingsInput> => ({
    name: form.name.trim(),
    slogan: form.slogan.trim(),
    email: form.email.trim().toLowerCase(),
    socialLinks: form.socialLinks.map(({ platform, url, isActive }) => ({
        platform,
        url: url.trim(),
        isActive,
    })),
});

const validate = (form: FormState) => {
    const errors: Record<string, string> = {};

    if (!form.name.trim()) errors.name = "The site name is required.";
    else if (form.name.trim().length > NAME_MAX)
        errors.name = `Maximum ${NAME_MAX} characters.`;

    if (!form.slogan.trim()) errors.slogan = "The slogan is required.";
    else if (form.slogan.trim().length > SLOGAN_MAX)
        errors.slogan = `Maximum ${SLOGAN_MAX} characters.`;

    if (!form.email.trim()) errors.email = "The email is required.";
    else if (!EMAIL_REGEX.test(form.email.trim()))
        errors.email = "Please enter a valid email address.";

    form.socialLinks.forEach((link) => {
        if (!link.url.trim())
            errors[`link-${link.key}`] = "The URL is required.";
        else if (!isValidUrl(link.url.trim()))
            errors[`link-${link.key}`] =
                "Enter a valid URL starting with http:// or https://";
    });

    return errors;
};

const inputClass = (hasError: boolean) =>
    `w-full rounded-lg border bg-[#F8F5EF] px-3 py-2.5 text-sm text-[#3E3025] outline-none transition focus:border-[#3E3025] focus:ring-1 focus:ring-[#3E3025] ${
        hasError ? "border-red-500" : "border-[#3E3025]/20"
    }`;

const AdminSettings = () => {
    const { settings, loading, updating, error, refreshSettings, updateSettings } =
        useSettingsContext();

    const [form, setForm] = useState<FormState>(emptyForm);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [toast, setToast] = useState<ToastState | null>(null);

    const closeToast = useCallback(() => setToast(null), []);

    // Synchronise le formulaire avec les paramètres chargés / sauvegardés
    const syncFormWithSettings = useCallback(() => {
        if (!settings) return;

        setForm({
            name: settings.name,
            slogan: settings.slogan,
            email: settings.email,
            socialLinks: settings.socialLinks.map((link) => ({
                key: link._id ?? crypto.randomUUID(),
                platform: link.platform,
                url: link.url,
                isActive: link.isActive,
            })),
        });
        setErrors({});
    }, [settings]);

    useEffect(() => {
        syncFormWithSettings();
    }, [syncFormWithSettings]);

    // Détection des modifications non sauvegardées
    const isDirty = useMemo(() => {
        if (!settings) return false;

        const original = toPayload({
            name: settings.name,
            slogan: settings.slogan,
            email: settings.email,
            socialLinks: settings.socialLinks.map((link) => ({
                key: "",
                platform: link.platform,
                url: link.url,
                isActive: link.isActive,
            })),
        });

        return JSON.stringify(original) !== JSON.stringify(toPayload(form));
    }, [form, settings]);

    // Avertit avant de quitter la page avec des modifications non sauvegardées
    useEffect(() => {
        if (!isDirty) return;

        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
        };

        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const setField = <K extends "name" | "slogan" | "email">(
        field: K,
        value: string
    ) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const next = { ...prev };
                delete next[field];
                return next;
            });
        }
    };

    const handleLinksChange = (socialLinks: SocialLinkDraft[]) => {
        setForm((prev) => ({ ...prev, socialLinks }));
        setErrors((prev) => {
            const next = { ...prev };
            Object.keys(next)
                .filter((k) => k.startsWith("link-"))
                .forEach((k) => delete next[k]);
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validate(form);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
            setToast({
                type: "error",
                message: "Please fix the highlighted fields.",
            });
            return;
        }

        const result = await updateSettings(toPayload(form));

        setToast({
            type: result.success ? "success" : "error",
            message: result.message,
        });
    };

    /* ============ États de chargement / erreur ============ */

    if (loading && !settings) {
        return (
            <div className="mx-auto max-w-3xl animate-pulse space-y-6 p-4 sm:p-8">
                <div className="h-8 w-48 rounded bg-[#3E3025]/10" />
                <div className="h-64 rounded-2xl bg-[#3E3025]/10" />
                <div className="h-40 rounded-2xl bg-[#3E3025]/10" />
            </div>
        );
    }

    if (error && !settings) {
        return (
            <div className="mx-auto max-w-3xl p-4 sm:p-8">
                <div className="rounded-2xl border border-red-300 bg-red-50 p-6 text-center">
                    <p className="text-red-800">{error}</p>
                    <button
                        type="button"
                        onClick={() => void refreshSettings()}
                        className="mt-4 rounded-lg bg-[#3E3025] px-5 py-2 text-sm font-medium text-[#F8F5EF] transition hover:opacity-90"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    /* ============ Page ============ */

    return (
        <div className="min-h-screen bg-[#F8F5EF]">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="mx-auto max-w-3xl space-y-6 px-4 pb-32 pt-6 sm:px-8 sm:pt-10"
            >
                <header>
                    <h1 className="font-serif text-3xl font-bold text-[#3E3025]">
                        General Settings
                    </h1>
                    <p className="mt-1 text-sm text-[#3E3025]/65">
                        Manage the identity, contact details and social
                        networks of Ancient Wisdom.
                    </p>
                </header>

                {/* Identité */}
                <SettingsSection
                    title="Site identity"
                    description="The name and slogan displayed across the website."
                >
                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label
                                htmlFor="name"
                                className="text-sm font-medium text-[#3E3025]"
                            >
                                Site name
                            </label>
                            <span className="text-xs text-[#3E3025]/55">
                                {form.name.length}/{NAME_MAX}
                            </span>
                        </div>
                        <input
                            id="name"
                            type="text"
                            value={form.name}
                            maxLength={NAME_MAX}
                            onChange={(e) => setField("name", e.target.value)}
                            className={inputClass(!!errors.name)}
                        />
                        {errors.name && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="mb-1.5 flex items-center justify-between">
                            <label
                                htmlFor="slogan"
                                className="text-sm font-medium text-[#3E3025]"
                            >
                                Slogan
                            </label>
                            <span className="text-xs text-[#3E3025]/55">
                                {form.slogan.length}/{SLOGAN_MAX}
                            </span>
                        </div>
                        <textarea
                            id="slogan"
                            rows={3}
                            value={form.slogan}
                            maxLength={SLOGAN_MAX}
                            onChange={(e) =>
                                setField("slogan", e.target.value)
                            }
                            className={`${inputClass(!!errors.slogan)} resize-none`}
                        />
                        {errors.slogan && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.slogan}
                            </p>
                        )}
                    </div>
                </SettingsSection>

                {/* Contact */}
                <SettingsSection
                    title="Contact"
                    description="The public email address of the website."
                >
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-sm font-medium text-[#3E3025]"
                        >
                            Contact email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setField("email", e.target.value)}
                            placeholder="contact@example.com"
                            className={inputClass(!!errors.email)}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-600">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </SettingsSection>

                {/* Réseaux sociaux */}
                <SettingsSection
                    title="Social networks"
                    description="Only active links are shown on the website."
                >
                    <SocialLinksEditor
                        links={form.socialLinks}
                        errors={errors}
                        onChange={handleLinksChange}
                    />
                </SettingsSection>

                {/* Barre d'actions collante */}
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[#3E3025]/15 bg-[#F8F5EF]/95 backdrop-blur">
                    <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
                        <p className="hidden text-sm text-[#3E3025]/65 sm:block">
                            {isDirty
                                ? "You have unsaved changes."
                                : "All changes are saved."}
                        </p>

                        <div className="flex w-full gap-3 sm:w-auto">
                            <button
                                type="button"
                                onClick={syncFormWithSettings}
                                disabled={!isDirty || updating}
                                className="flex-1 rounded-lg border border-[#3E3025]/30 px-5 py-2.5 text-sm font-medium text-[#3E3025] transition hover:bg-[#3E3025]/5 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                            >
                                Discard
                            </button>

                            <button
                                type="submit"
                                disabled={!isDirty || updating}
                                className="flex-1 rounded-lg bg-[#3E3025] px-6 py-2.5 text-sm font-medium text-[#F8F5EF] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                            >
                                {updating ? "Saving..." : "Save changes"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            <SettingsToast toast={toast} onClose={closeToast} />
        </div>
    );
};

export default AdminSettings;