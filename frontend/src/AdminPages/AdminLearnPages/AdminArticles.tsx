import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArticleContext } from "../../Contexts/ArticleContext";
import type { ArticleAdminWithId } from "../../AdminContexts/ArticleAdminContext";
import AdminLearnCard from "../../AdminComponents/AdminLearn/AdminLearnCard";
import AdminLearnList from "../../AdminComponents/AdminLearn/AdminLearnList";
import DeleteArticlePop from "../../AdminComponents/AdminLearn/DeleteArticlePop";


const AdminArticles = () => {

    const navigate = useNavigate();

    const {
        articles, loadingAllArticles, errorMsg, page, setPage,
        totalPages, totalArticles, search, setSearch
    } = useArticleContext();

    // ArticleAdminContext ne porte pas l'état du popup : il vit ici
    const [articleDelete, setArticleDelete] = useState<ArticleAdminWithId | null>(null);

    return (
        <>
            <AdminLearnList
                title="Articles"
                subtitle="Manage the articles of the Learn section."
                total={totalArticles}
                search={search}
                onSearch={(value) => { setPage(1); setSearch(value); }}
                addLabel="Add article"
                addPath="/admin/learn/addArticle"
                loading={loadingAllArticles}
                errorMsg={errorMsg}
                isEmpty={articles.length === 0}
                emptyLabel="No articles found. Add your first article."
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            >
                {articles.map((article) => {
                    const eraName = typeof article.era === "string" ? undefined : article.era?.name;

                    return (
                        <AdminLearnCard
                            key={article._id}
                            image={article.image?.url}
                            title={article.title}
                            subtitle={article.tags?.length ? article.tags.map((t) => `#${t}`).join(" ") : undefined}
                            description={article.description}
                            badge={eraName}
                            footer={`${article.sections?.length ?? 0} sections`}
                            onUpdate={() => navigate(`/admin/learn/article/${article._id}`)}
                            onDelete={() => setArticleDelete(article)}
                        />
                    );
                })}
            </AdminLearnList>

            {articleDelete && (
                <DeleteArticlePop article={articleDelete} onClose={() => setArticleDelete(null)} />
            )}
        </>
    );
};

export default memo(AdminArticles);
