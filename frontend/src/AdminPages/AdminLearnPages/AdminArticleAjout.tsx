import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useArticleContext } from "../../Contexts/ArticleContext";
import { useArticleAdminContext } from "../../AdminContexts/ArticleAdminContext";
import { emptyArticleForm, toArticleFormData, validateArticleForm, type ArticleFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import ArticleForm from "../../AdminComponents/AdminLearn/ArticleForm";


const AdminArticleAjout = () => {

    const navigate = useNavigate();
    const { addArticle, loadingAddArticle, errorMsg, clearMessages } = useArticleAdminContext();
    const { getAllArticles } = useArticleContext();

    const [form, setForm] = useState<ArticleFormState>(emptyArticleForm);
    const [image, setImage] = useState<File | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        clearMessages();
        return () => clearMessages();
    }, [clearMessages]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateArticleForm(form, image, true);
        if (error) return showToast(error);

        const success = await addArticle(toArticleFormData(form, image));

        if (success) {
            await getAllArticles(); // la liste paginée vient de ArticleContext
            navigate("/admin/learn/articles", { state: { success: "Article added successfully." } });
        }
    };

    return (
        <AdminLearnFormPage
            title="Add an article"
            subtitle="Fill in the details of the new article."
            backPath="/admin/learn/articles"
            backLabel="Back to articles"
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <ArticleForm
                form={form}
                setForm={setForm}
                image={image}
                setImage={setImage}
                loading={loadingAddArticle}
                submitLabel="Add article"
                loadingLabel="Adding..."
                submitIcon="fa-solid fa-plus"
                onSubmit={handleSubmit}
                onCancel={() => navigate("/admin/learn/articles")}
            />
        </AdminLearnFormPage>
    );
};

export default memo(AdminArticleAjout);
