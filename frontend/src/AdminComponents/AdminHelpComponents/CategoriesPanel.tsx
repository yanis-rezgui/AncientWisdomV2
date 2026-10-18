import { memo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useHelpCategoryAdminContext } from "../../AdminContexts/HelpCategoryAdminContext";
import type { HelpCategory } from "../../Types/HelpTypes";
import {
    ConfirmDialog,
    Field,
    StatusBadge,
    btnDanger,
    btnPrimary,
    btnSecondary,
    cardClass,
    inputClass,
    slugify,
} from "./helpUI";

// ============================================================
// Formulaire (création / édition)
// ============================================================

const CategoryForm = ({
    category,
    onClose,
}: {
    category: HelpCategory | null;
    onClose: () => void;
}) => {
    const {
        addCategory,
        updateCategory,
        loadingAddCategory,
        loadingUpdateCategory,
    } = useHelpCategoryAdminContext();

    const isEdit = !!category;
    const saving = loadingAddCategory || loadingUpdateCategory;

    const [name, setName] = useState(category?.name ?? "");
    const [slug, setSlug] = useState(category?.slug ?? "");
    const [slugTouched, setSlugTouched] = useState(isEdit);
    const [description, setDescription] = useState(category?.description ?? "");
    const [icon, setIcon] = useState(category?.icon ?? "");
    const [order, setOrder] = useState(String(category?.order ?? 0));
    const [isPublished, setIsPublished] = useState(category?.isPublished ?? true);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const finalSlug = slugify(slug);

        if (!name.trim()) return setError("The name is required.");
        if (!finalSlug) return setError("The slug is required.");
        if (!description.trim()) return setError("The description is required.");

        const payload = {
            name: name.trim(),
            slug: finalSlug,
            description: description.trim(),
            icon: icon.trim() || undefined,
            order: Number(order) || 0,
            isPublished,
        };

        const ok = isEdit
            ? await updateCategory(category._id, payload)
            : await addCategory(payload);

        if (ok) onClose();
    };

    return (
        <form onSubmit={handleSubmit} className={`${cardClass} flex flex-col gap-4 p-5`}>
            <h3 className="text-[1.1em] font-semibold text-[#3E3025]">
                {isEdit ? "Edit category" : "New category"}
            </h3>

            <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-2">
                <Field label="Name" htmlFor="cat-name">
                    <input
                        id="cat-name"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            if (!slugTouched) setSlug(slugify(e.target.value));
                        }}
                        placeholder="Account & security"
                        className={inputClass}
                    />
                </Field>

                <Field label="Slug" htmlFor="cat-slug">
                    <input
                        id="cat-slug"
                        value={slug}
                        onChange={(e) => {
                            setSlugTouched(true);
                            setSlug(e.target.value);
                        }}
                        placeholder="account-security"
                        className={inputClass}
                    />
                </Field>
            </div>

            <Field label="Description" htmlFor="cat-description">
                <textarea
                    id="cat-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={inputClass}
                />
            </Field>

            <div className="grid grid-cols-1 gap-4 min-[560px]:grid-cols-[1fr_120px]">
                <Field
                    label="Icon"
                    htmlFor="cat-icon"
                    hint="Icon name used by the site (for example HelpCircle)."
                >
                    <input
                        id="cat-icon"
                        value={icon}
                        onChange={(e) => setIcon(e.target.value)}
                        className={inputClass}
                    />
                </Field>

                <Field label="Order" htmlFor="cat-order">
                    <input
                        id="cat-order"
                        type="number"
                        min={0}
                        value={order}
                        onChange={(e) => setOrder(e.target.value)}
                        className={inputClass}
                    />
                </Field>
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#3E3025]">
                <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 accent-[#3E3025]"
                />
                Published
            </label>

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
                    {saving ? "Saving..." : isEdit ? "Save changes" : "Create category"}
                </button>
            </div>
        </form>
    );
};

// ============================================================
// Panneau
// ============================================================

const CategoriesPanel = () => {
    const {
        categories,
        updateCategory,
        deleteCategory,
        loadingCategories,
        loadingUpdateCategory,
        loadingDeleteCategory,
    } = useHelpCategoryAdminContext();

    // undefined = fermé · null = nouvelle catégorie · objet = édition
    const [editing, setEditing] = useState<HelpCategory | null | undefined>(undefined);
    const [toDelete, setToDelete] = useState<HelpCategory | null>(null);

    const confirmDelete = async () => {
        if (!toDelete) return;
        const ok = await deleteCategory(toDelete._id);
        if (ok) setToDelete(null);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-3">
                <p className="text-[14px] font-semibold text-[#3E3025]">
                    Total categories : {categories.length}
                </p>
                {editing === undefined && (
                    <button type="button" onClick={() => setEditing(null)} className={btnPrimary}>
                        <Plus size={16} /> New category
                    </button>
                )}
            </div>

            {editing !== undefined && (
                <CategoryForm
                    key={editing?._id ?? "new"}
                    category={editing}
                    onClose={() => setEditing(undefined)}
                />
            )}

            {loadingCategories && categories.length === 0 ? (
                <p className="py-10 text-center font-semibold text-[#3E3025]">Loading...</p>
            ) : categories.length === 0 ? (
                <div className={`${cardClass} p-8 text-center`}>
                    <p className="text-[#3E3025]">No categories yet.</p>
                    <p className="mt-1 text-[13px] text-[#3E3025]/60">
                        Create a category before writing your first article.
                    </p>
                </div>
            ) : (
                <ul className="flex flex-col gap-3">
                    {categories.map((category) => (
                        <li key={category._id} className={`${cardClass} p-4`}>
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-[1.05em] font-semibold text-[#3E3025]">
                                        {category.name}
                                    </h3>
                                    <p className="mt-0.5 text-[12px] text-[#3E3025]/55">
                                        /{category.slug} · Order {category.order}
                                        {category.icon ? ` · ${category.icon}` : ""}
                                    </p>
                                </div>
                                <StatusBadge published={category.isPublished} />
                            </div>

                            <p className="mt-2 text-[14px] leading-6 text-[#3E3025]/75">
                                {category.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2 border-t border-[#3E3025]/10 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setEditing(category)}
                                    className={btnSecondary}
                                >
                                    <Pencil size={14} /> Edit
                                </button>

                                <button
                                    type="button"
                                    disabled={loadingUpdateCategory}
                                    onClick={() =>
                                        void updateCategory(category._id, {
                                            isPublished: !category.isPublished,
                                        })
                                    }
                                    className={btnSecondary}
                                >
                                    {category.isPublished ? "Unpublish" : "Publish"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setToDelete(category)}
                                    className={`${btnDanger} ml-auto`}
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            {toDelete && (
                <ConfirmDialog
                    title="Delete this category?"
                    message={`“${toDelete.name}” will be permanently deleted. Articles that use it may need a new category.`}
                    loading={loadingDeleteCategory}
                    onConfirm={() => void confirmDelete()}
                    onCancel={() => setToDelete(null)}
                />
            )}
        </div>
    );
};

export default memo(CategoriesPanel);