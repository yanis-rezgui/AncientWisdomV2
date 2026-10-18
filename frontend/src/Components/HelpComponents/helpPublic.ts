import type { HelpArticle, HelpArticleType } from "../../Types/HelpTypes";

export const TYPE_OPTIONS: { value: HelpArticleType | ""; label: string }[] = [
    { value: "", label: "All" },
    { value: "guide", label: "Guides" },
    { value: "faq", label: "FAQ" },
    { value: "troubleshooting", label: "Troubleshooting" },
];

export const typeLabel = (type: HelpArticleType) =>
    ({ guide: "Guide", faq: "FAQ", troubleshooting: "Troubleshooting" })[type] ?? type;

export const formatDate = (iso?: string | null) =>
    iso
        ? new Date(iso).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
          })
        : "";

// La catégorie est peuplée par l'API, mais peut être un simple ID
export const getCategory = (article: HelpArticle) =>
    typeof article.category === "string" ? null : article.category;
