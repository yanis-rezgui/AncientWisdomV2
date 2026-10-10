import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useArticleContext } from "../../Contexts/ArticleContext";
import { articleToForm, emptyArticleForm, toArticleFormData, validateArticleForm, type ArticleFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useArticleAdminContext, type ArticleAdminWithId } from "../../AdminContexts/ArticleAdminContext";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import ArticleForm from "../../AdminComponents/AdminLearn/ArticleForm";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import DeleteArticlePop from "../../AdminComponents/AdminLearn/DeleteArticlePop";

const AdminArticleUpdate = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const {
        getArticle, currentArticle, setCurrentArticle, loadingArticle,
        getAllArticles, errorMsg: fetchError
    } = useArticleContext();
    const { updateArticle, loadingUpdateArticle, errorMsg, clearMessages } = useArticleAdminContext();

    const [form, setForm] = useState<ArticleFormState>(emptyArticleForm);
    const [image, setImage] = useState<File | null>(null);
    const [articleDelete, setArticleDelete] = useState<ArticleAdminWithId | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        clearMessages();
        if (id) void getArticle(id);

        return () => {
            setCurrentArticle(null);
            clearMessages();
        };
    }, [id, getArticle, setCurrentArticle, clearMessages]);

    // Pré-remplit le formulaire quand l'article est chargé
    useEffect(() => {
        if (currentArticle && currentArticle._id === id) setForm(articleToForm(currentArticle));
    }, [currentArticle, id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const error = validateArticleForm(form, image, false);
        if (error) return showToast(error);

        const success = await updateArticle(id, toArticleFormData(form, image));

        if (success) {
            await getAllArticles();
            navigate("/admin/learn/articles", { state: { success: "Article updated successfully." } });
        }
    };

    return (
        <>
            <AdminLearnFormPage
                title="Update article"
                subtitle={currentArticle?.title ?? "Edit the details of this article."}
                backPath="/admin/learn/articles"
                backLabel="Back to articles"
                loading={loadingArticle || (!currentArticle && !fetchError)}
                error={!currentArticle ? fetchError : ""}
                onDelete={() => currentArticle && setArticleDelete(currentArticle)}
            >
                {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

                <ArticleForm
                    form={form}
                    setForm={setForm}
                    image={image}
                    setImage={setImage}
                    currentImageUrl={currentArticle?.image?.url}
                    loading={loadingUpdateArticle}
                    submitLabel="Save changes"
                    loadingLabel="Saving..."
                    submitIcon="fa-solid fa-floppy-disk"
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/learn/articles")}
                />
            </AdminLearnFormPage>

            {articleDelete && (
                <DeleteArticlePop article={articleDelete} onClose={() => setArticleDelete(null)} />
            )}
        </>
    );
};

export default memo(AdminArticleUpdate);
