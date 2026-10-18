import { memo, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useHelpCenterContext } from "../Contexts/HelpCenterContext";
import HelpHero from "../Components/HelpComponents/HelpHero";
import HelpCategories from "../Components/HelpComponents/HelpCategories";
import HelpArticlesList from "../Components/HelpComponents/HelpArticlesList";
import type { HelpArticleType } from "../Types/HelpTypes";

const PAGE_SIZE = 8;

const HelpCenter = () => {
    const { getCategories, getArticles } = useHelpCenterContext();
    const [params, setParams] = useSearchParams();

    // Les filtres vivent dans l'URL : lien partageable, retour arrière fonctionnel
    const search = params.get("search") ?? "";
    const category = params.get("category") ?? "";
    const type = (params.get("type") ?? "") as HelpArticleType | "";
    const page = Number(params.get("page")) || 1;

    const update = useCallback(
        (patch: Record<string, string>) => {
            const next = new URLSearchParams(params);

            for (const [key, value] of Object.entries(patch)) {
                if (value) next.set(key, value);
                else next.delete(key);
            }

            // Tout changement de filtre repart de la page 1
            if (!("page" in patch)) next.delete("page");

            setParams(next);
        },
        [params, setParams]
    );

    useEffect(() => {
        void getCategories();
    }, [getCategories]);

    useEffect(() => {
        void getArticles({
            page,
            limit: PAGE_SIZE,
            search: search || undefined,
            category: category || undefined,
            type: type || undefined,
        });
    }, [getArticles, page, search, category, type]);

    const hasFilters = !!(search || category || type);

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center bg-[#E8E2D6]">
            <HelpHero search={search} onSearch={(value) => update({ search: value })} />

            <HelpCategories
                activeCategory={category}
                onSelect={(slug) => update({ category: slug })}
            />

            <HelpArticlesList
                type={type}
                hasFilters={hasFilters}
                onTypeChange={(value) => update({ type: value })}
                onPageChange={(value) => {
                    update({ page: value > 1 ? String(value) : "" });
                    window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onClear={() => setParams({})}
            />
        </section>
    );
};

export default memo(HelpCenter);
