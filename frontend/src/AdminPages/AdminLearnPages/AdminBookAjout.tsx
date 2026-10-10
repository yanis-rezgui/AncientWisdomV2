import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { buildBookFormData, emptyBookForm, validateBookForm, type BookFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useBooksAdminContext } from "../../AdminContexts/BookAdminContext";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import BookForm from "../../AdminComponents/AdminLearn/BookForm";


const AdminBookAjout = () => {

    const navigate = useNavigate();
    const { addBook, loadingAddBook, errorMsg, setErrorMsg } = useBooksAdminContext();

    const [form, setForm] = useState<BookFormState>(emptyBookForm);
    const [image, setImage] = useState<File | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        setErrorMsg("");
        return () => setErrorMsg("");
    }, [setErrorMsg]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateBookForm(form, image, true);
        if (error) return showToast(error);

        const success = await addBook(buildBookFormData(form, image));

        if (success) navigate("/admin/learn/books", { state: { success: "Book added successfully." } });
    };

    return (
        <AdminLearnFormPage
            title="Add a book"
            subtitle="Fill in the details of the new book."
            backPath="/admin/learn/books"
            backLabel="Back to books"
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <BookForm
                form={form}
                setForm={setForm}
                image={image}
                setImage={setImage}
                loading={loadingAddBook}
                submitLabel="Add book"
                loadingLabel="Adding..."
                submitIcon="fa-solid fa-plus"
                onSubmit={handleSubmit}
                onCancel={() => navigate("/admin/learn/books")}
            />
        </AdminLearnFormPage>
    );
};

export default memo(AdminBookAjout);
