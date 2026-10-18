import { memo } from "react";
import { Link } from "react-router-dom";
import type { HelpArticle } from "../../Types/HelpTypes";
import { formatDate, getCategory, typeLabel } from "./helpPublic";

const HelpArticleHero = ({ article }: { article: HelpArticle }) => {
    const category = getCategory(article);
    const date = formatDate(article.updatedAt);

    return (
        <section
            aria-labelledby="help-article-title"
            className="mx-auto mt-10 w-full max-w-[900px] px-4"
        >
            <div className="flex flex-col items-center gap-4 rounded-lg border border-gray-200 bg-white p-6 text-center">
                <div className="flex flex-wrap items-center justify-center gap-2 text-[13px]">
                    <span className="rounded-full bg-[#F0E6D8] px-2.5 py-0.5 font-semibold text-[#3E3025]">
                        {typeLabel(article.articleType)}
                    </span>
                    {category && (
                        <Link
                            to={`/help?category=${category.slug}`}
                            className="font-semibold text-[#8C6A43] underline transition-opacity duration-200 hover:opacity-70"
                        >
                            {category.name}
                        </Link>
                    )}
                </div>

                <h1
                    id="help-article-title"
                    className="text-[1.8em] font-bold leading-tight text-[#3E3025]"
                >
                    {article.title}
                </h1>

                <span className="block h-[3px] w-12 rounded bg-[#8C6A43]" />

                <p className="max-w-[720px] text-[17px] leading-8 text-gray-800">
                    {article.excerpt}
                </p>

                {article.tags?.length > 0 && (
                    <ul className="flex flex-wrap justify-center gap-2">
                        {article.tags.map((tag) => (
                            <li
                                key={tag}
                                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[13px] text-gray-700"
                            >
                                {tag}
                            </li>
                        ))}
                    </ul>
                )}

                {date && <p className="text-[14px] text-gray-600">Last updated {date}</p>}
            </div>
        </section>
    );
};

export default memo(HelpArticleHero);
