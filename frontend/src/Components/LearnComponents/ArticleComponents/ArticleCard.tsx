import { memo } from "react";
import { Link } from "react-router-dom";

import type { Article } from "../../../Types/LearnTypes";

interface ArticleCardProps {
    article: Article;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
    const eraName =
        typeof article.era === "object" && article.era !== null
            ? article.era.name
            : null;

    return (
        <Link
            to={`/article/${article._id}`}
            className="group flex flex-col rounded-lg bg-gray-50 overflow-hidden
            shadow-lg hover:shadow-2xl hover:-translate-y-1
            transition-all duration-300
            focus-visible:outline-2 focus-visible:outline-[#3E3025]"
        >
            <div className="w-full h-[200px] overflow-hidden bg-gray-200">
                <img
                    src={article.image?.url}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover sepia-[0.25]
                    group-hover:sepia-0 group-hover:scale-105
                    transition-all duration-500"
                />
            </div>

            <div className="flex flex-col gap-2 p-3 flex-1">
                {eraName && (
                    <span className="self-start py-1 px-3 rounded-full bg-gray-600 text-white text-[12px]">
                        {eraName}
                    </span>
                )}

                <h3 className="text-[1.15em] font-semibold text-gray-950 leading-tight line-clamp-2">
                    {article.title}
                </h3>

                <p className="text-[14px] text-gray-800 leading-4.5 line-clamp-3">
                    {article.description}
                </p>

                <div className="flex flex-row items-center justify-between gap-2 mt-auto pt-2">
                    <span className="text-[13px] text-gray-600">
                        {article.sections?.length ?? 0}{" "}
                        {(article.sections?.length ?? 0) === 1 ? "section" : "sections"}
                    </span>

                    <span className="text-[13px] font-semibold text-[#3E3025]">
                        Read article
                    </span>
                </div>
            </div>
        </Link>
    );
};

export default memo(ArticleCard);