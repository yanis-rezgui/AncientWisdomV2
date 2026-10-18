import { memo, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowUp, Plus, Trash2 } from "lucide-react";
import { useHelpArticleAdminContext } from "../../AdminContexts/HelpArticleAdminContext";
import { useHelpCategoryAdminContext } from "../../AdminContexts/HelpCategoryAdminContext";
import type {
    HelpArticle,
    HelpArticleFormData,
    HelpArticleType,
} from "../../Types/HelpTypes";
import {
    ARTICLE_TYPES,
    Field,
    btnDanger,
    btnPrimary,
    btnSecondary,
    cardClass,
    inputClass,
    slugify,
} from "./helpUI";

type SectionDraft = { heading: string; content: string };

const moveItem = <T,>(list: T[], from: number, to: number) => {
    if (to < 0 || to >= list.length) return list;
    const copy = [...list];
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    return copy;
};

const ArticleForm = ({
    article,
    onClose,
}: {
    article: HelpArticle | null;
    onClose: () => void;
}) => {
    const { addArticle, updateArticle, loadingAddArticle, loadingUpdateArticle } =
        useHelpArticleAdminContext();
    const { categories } = useHelpCategoryAdminContext();

    const isEdit = !!article;
    const saving = loadingAddArticle || loadingUpdateArticle;

    const [title, setTitle] = useState(article?.title ?? "");
    const [slug, setSlug] = useState(article?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(isEdit);
    const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
    const [category, setCategory] = useState(
        article
            ? typeof article.category === "string"
                ? article.category
                : article.category._id
            : ""
    );
    const [articleType, setArticleType] = useState<HelpArticleType>(
        article?.articleType ?? "guide"
    );
    const [tagsText, setTagsText] = useState(article?.tags.join(", ") ?? "");
    const [order, setOrder] = useState(String(article?.order ?? 0));
    const [isFeatured, setIsFeatured] = useState(article?.isFeatured ?? false);
    const [isPublished, setIsPublished] = useState(article?.isPublished ?? false);
    const [sections, setSections] = useState<SectionDraft[]>(
        article?.sections?.length
            ? [...article.sections]
                  .sort((a, b) => a.order - b.order)
                  .map((s) => ({ heading: s.heading ?? "", content: s.content }))
            : [{ heading: "", content: "" }]
    );
    const [error, setError] = useState("");

    const updateSection = (index: number, patch: Partial<SectionDraft>) =>
        setSections((prev) =>
            prev.map((s, i) => (i === index ? { ...s, ...patch } : s))
        );

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const cleanSections = sections
            .filter((s) => s.content.trim())
            .map((s, i) => ({
                heading: s.heading.trim() || undefined,
                content: s.content.trim(),
                order: i,
            }));

        const finalSlug = slugify(slug);

        if (!title.trim()) return setError("The title is required.");
        if (!finalSlug) return setError("The slug is required.");
        if (!excerpt.trim()) return setError("The excerpt is required.");
        if (!category) return setError("Choose a category.");
        if (cleanSections.length === 0)
            return setError("Add at least one section with content.");

        const payload: HelpArticleFormData = {
            title: title.trim(),
            slug: finalSlug,
            excerpt: excerpt.trim(),
            category,
            sections: cleanSections,
            tags: [
                ...new Set(
                    tagsText
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean)
                ),
            ],
            articleType,
            isFeatured,
            isPublished,
            order: Number(order) || 0,
        };

        const ok = isEdit
            ? await updateArticle(article._id, payload)
            : await addArticle(payload);

        if (ok) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-3">
                <button type="button" onClick={onClose} className={btnSecondary}>
                    <ArrowLeft size={15} /> Back to articles
                </button>
            </div>

            <h2 className="text-[1.4em] font-bold text-[#3E3025]">
                {isEdit ? "Edit article" : "New article"}
            </h2>

            {/* Informations générales */}
            <div className={`${cardClass} flex flex-col gap-4 p-5`}>
                <Field label="Title" htmlFor="help-title">
                    <input
                        id="help-title"
                        value={title}
                        onChange={(e) => {
                            setTitle(e.target.value);
                            if (!slugTouched) setSlug(slugify(e.target.value));
                        }}
                        placeholder="How to reset your password"
                        className={inputClass}
                    />
                </Field>

                <Field
                    label="Slug"
                    htmlFor="help-slug"
                    hint="Used in the article URL. Generated from the title until you edit it."
                >
                    <input
                        id="help-slug"
                        value={slug}
                        onChange={(e) => {
                            setSlugTouched(true);
                            setSlug(e.target.value);
                        }}
                        placeholder="how-to-reset-your-password"
                        className={inputClass}
                    />
                </Field>

                <Field label="Excerpt" htmlFor="help-excerpt" hint="One or two sentences shown in lists.">
                    <textarea
                        id="help-excerpt"
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        rows={3}
                        className={inputClass}
                    />
                </Field>

                <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2">
                    <Field label="Category" htmlFor="help-category">
                        <select
                            id="help-category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Select a category</option>
                            {categories.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Type" htmlFor="help-type">
                        <select
                            id="help-type"
                            value={articleType}
                            onChange={(e) =>
                                setArticleType(e.target.value as HelpArticleType)
                            }
                            className={inputClass}
                        >
                            {ARTICLE_TYPES.map((t) => (
                                <option key={t.value} value={t.value}>
                                    {t.label}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-[1fr_120px]">
                    <Field label="Tags" htmlFor="help-tags" hint="Separate tags with commas.">
                        <input
                            id="help-tags"
                            value={tagsText}
                            onChange={(e) => setTagsText(e.target.value)}
                            placeholder="account, password, security"
                            className={inputClass}
                        />
                    </Field>

                    <Field label="Order" htmlFor="help-order">
                        <input
                            id="help-order"
                            type="number"
                            min={0}
                            value={order}
                            onChange={(e) => setOrder(e.target.value)}
                            className={inputClass}
                        />
                    </Field>
                </div>

                <div className="flex flex-wrap gap-6">
                    <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#3E3025]">
                        <input
                            type="checkbox"
                            checked={isFeatured}
                            onChange={(e) => setIsFeatured(e.target.checked)}
                            className="h-4 w-4 accent-[#3E3025]"
                        />
                        Featured article
                    </label>

                    <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#3E3025]">
                        <input
                            type="checkbox"
                            checked={isPublished}
                            onChange={(e) => setIsPublished(e.target.checked)}
                            className="h-4 w-4 accent-[#3E3025]"
                        />
                        Published
                    </label>
                </div>
            </div>

            {/* Sections */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-[1.1em] font-semibold text-[#3E3025]">Sections</h3>
                    <button
                        type="button"
                        onClick={() =>
                            setSections((prev) => [...prev, { heading: "", content: "" }])
                        }
                        className={btnSecondary}
                    >
                        <Plus size={14} /> Add section
                    </button>
                </div>

                {sections.map((section, index) => (
                    <div key={index} className={`${cardClass} flex flex-col gap-3 p-4`}>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-[13px] font-semibold text-[#3E3025]/60">
                                Section {index + 1}
                            </p>

                            <div className="flex gap-1.5">
                                <button
                                    type="button"
                                    aria-label="Move section up"
                                    disabled={index === 0}
                                    onClick={() => setSections((p) => moveItem(p, index, index - 1))}
                                    className={btnSecondary}
                                >
                                    <ArrowUp size={14} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Move section down"
                                    disabled={index === sections.length - 1}
                                    onClick={() => setSections((p) => moveItem(p, index, index + 1))}
                                    className={btnSecondary}
                                >
                                    <ArrowDown size={14} />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Remove section"
                                    disabled={sections.length === 1}
                                    onClick={() =>
                                        setSections((p) => p.filter((_, i) => i !== index))
                                    }
                                    className={btnDanger}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <Field label="Heading (optional)" htmlFor={`help-section-heading-${index}`}>
                            <input
                                id={`help-section-heading-${index}`}
                                value={section.heading}
                                onChange={(e) => updateSection(index, { heading: e.target.value })}
                                className={inputClass}
                            />
                        </Field>

                        <Field label="Content" htmlFor={`help-section-content-${index}`}>
                            <textarea
                                id={`help-section-content-${index}`}
                                value={section.content}
                                onChange={(e) => updateSection(index, { content: e.target.value })}
                                rows={6}
                                className={inputClass}
                            />
                        </Field>
                    </div>
                ))}
            </div>

            <div className="min-h-[20px]" aria-live="polite">
                {error && (
                    <p role="alert" className="text-[14px] font-semibold text-[#8B2E2E]">
                        {error}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onClose} className={btnSecondary}>
                    Cancel
                </button>
                <button type="submit" disabled={saving} className={btnPrimary}>
                    {saving ? "Saving..." : isEdit ? "Save changes" : "Create article"}
                </button>
            </div>
        </form>
    );
};

export default memo(ArticleForm);