import { memo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHelpCenterContext } from "../Contexts/HelpCenterContext";
import HelpArticleHero from "../Components/HelpComponents/HelpArticleHero";
import ReadingProgress from "../Components/LearnComponents/ArticleComponents/ReadingProgress";
import HelpArticleContent from "../Components/HelpComponents/HelpArticleContent";

const HelpArticleDetails = () => {
    const { slug } = useParams();
    const navigate = useNavigate();
    const { currentArticle, getArticleBySlug } = useHelpCenterContext();

    // Évite d'afficher "not found" ou l'ancien article avant la fin du chargement
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!slug) return;

        let cancelled = false;
        setDone(false)

        getArticleBySlug(slug).finally(() => {
            if (!cancelled) setDone(true);
        });

        return () => {
            cancelled = true;
        };
        // getArticleBySlug n'est pas mémoïsé dans le context : on ne dépend que du slug
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [slug]);

    const article = currentArticle?.slug === slug ? currentArticle : null;

    return (
        <section className="relative flex min-h-screen w-full flex-col items-center bg-[#E8E2D6]">
            {!done ? (
                <p className="mt-10 text-center text-[18px] font-[600]">Loading...</p>
            ) : !article ? (
                <div className="mt-10 flex flex-col gap-3 rounded-lg bg-gray-50 px-8 py-8 text-center">
                    <p className="text-[1.4em] font-bold">Article Not Found</p>
                    <p className="text-gray-700">
                        This article doesn't exist or is no longer available.
                    </p>
                </div>
            ) : (
                <>
                    <ReadingProgress />
                    <HelpArticleHero article={article} />
                    <HelpArticleContent article={article} />
                </>
            )}

            <button
                onClick={() => navigate("/help")}
                className="bg-[#3E3025] text-white absolute left-2 top-2
                flex flex-row justify-center items-center gap-2 px-4 py-1 rounded-[10px]
                cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
            >

                <i className="fa-solid fa-arrow-left-long"></i>
                Back
            </button>
        </section>
    );
};

export default memo(HelpArticleDetails);