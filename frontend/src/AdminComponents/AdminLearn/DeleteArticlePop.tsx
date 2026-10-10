import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useArticleAdminContext, type ArticleAdminWithId } from "../../AdminContexts/ArticleAdminContext";
import { useArticleContext } from "../../Contexts/ArticleContext";
import DeleteLearnPop from "./DeleteLearnPop";

// ArticleAdminContext ne gère pas l'état du popup : il est porté par la page
const DeleteArticlePop = ({ article, onClose }: { article: ArticleAdminWithId; onClose: () => void }) => {

    const navigate = useNavigate();

    const { deleteArticle, loadingDeleteArticle, errorMsg, clearMessages } = useArticleAdminContext();
    const { getAllArticles } = useArticleContext();

    const closePop = () => {
        clearMessages();
        onClose();
    };

    const handleDelete = async () => {
        const success = await deleteArticle(article._id);

        if (success) {
            await getAllArticles(); // rafraîchit la liste paginée
            onClose();
            navigate("/admin/learn/articles", { state: { success: "Article deleted successfully." } });
        }
    };

    return (
        <DeleteLearnPop
            entity="article"
            name={article.title}
            detail={`with its image and its ${article.sections?.length ?? 0} section(s)`}
            loading={loadingDeleteArticle}
            errorMsg={errorMsg}
            onClose={closePop}
            onConfirm={handleDelete}
        />
    );
};

export default memo(DeleteArticlePop);
