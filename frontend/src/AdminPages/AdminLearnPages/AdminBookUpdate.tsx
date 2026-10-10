import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBooksAdminContext } from "../../AdminContexts/BookAdminContext";
import { bookToForm, buildBookFormData, emptyBookForm, validateBookForm, type BookFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useBookContext } from "../../Contexts/BookContext";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import BookForm from "../../AdminComponents/AdminLearn/BookForm";
import DeleteBookPop from "../../AdminComponents/AdminLearn/DeleteBookPop";

const AdminBookUpdate = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { getBook, currentBook, setCurrentBook, loadingBook, errorMsg: fetchError } = useBookContext();
    const {
        updateBook, loadingUpdateBook, errorMsg, setErrorMsg,
        setBookDelete, setShowDeletePop
    } = useBooksAdminContext();

    const [form, setForm] = useState<BookFormState>(emptyBookForm);
    const [image, setImage] = useState<File | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        setErrorMsg("");
        if (id) void getBook(id);

        return () => {
            setCurrentBook(null);
            setErrorMsg("");
        };
    }, [id, getBook, setCurrentBook, setErrorMsg]);

    // Pré-remplit le formulaire quand le livre est chargé
    useEffect(() => {
        if (currentBook && currentBook._id === id) setForm(bookToForm(currentBook));
    }, [currentBook, id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const error = validateBookForm(form, image, false);
        if (error) return showToast(error);

        const success = await updateBook(id, buildBookFormData(form, image));

        if (success) navigate("/admin/learn/books", { state: { success: "Book updated successfully." } });
    };

    return (
        <>
            <AdminLearnFormPage
                title="Update book"
                subtitle={currentBook?.title ?? "Edit the details of this book."}
                backPath="/admin/learn/books"
                backLabel="Back to books"
                loading={loadingBook || (!currentBook && !fetchError)}
                error={!currentBook ? fetchError : ""}
                onDelete={() => {
                    if (!currentBook) return;
                    setBookDelete(currentBook);
                    setShowDeletePop(true);
                }}
            >
                {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

                <BookForm
                    form={form}
                    setForm={setForm}
                    image={image}
                    setImage={setImage}
                    currentImageUrl={currentBook?.image?.url}
                    loading={loadingUpdateBook}
                    submitLabel="Save changes"
                    loadingLabel="Saving..."
                    submitIcon="fa-solid fa-floppy-disk"
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/learn/books")}
                />
            </AdminLearnFormPage>

            <DeleteBookPop />
        </>
    );
};

export default memo(AdminBookUpdate);
