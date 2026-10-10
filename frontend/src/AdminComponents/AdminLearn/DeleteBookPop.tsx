import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useBooksAdminContext } from "../../AdminContexts/BookAdminContext";
import DeleteLearnPop from "./DeleteLearnPop";

const DeleteBookPop = () => {

    const navigate = useNavigate();

    const {
        bookDelete, setBookDelete, showDeletePop, setShowDeletePop,
        deleteBook, loadingDeleteBook, errorMsg, setErrorMsg
    } = useBooksAdminContext();

    if (!showDeletePop || !bookDelete) return null;

    const closePop = () => {
        setErrorMsg("");
        setShowDeletePop(false);
        setBookDelete(null);
    };

    const handleDelete = async () => {
        const success = await deleteBook(bookDelete._id);

        // Si on supprime depuis la page Update, on retourne à la liste
        if (success) navigate("/admin/learn/books", { state: { success: "Book deleted successfully." } });
    };

    return (
        <DeleteLearnPop
            entity="book"
            name={bookDelete.title}
            detail="with its image"
            loading={loadingDeleteBook}
            errorMsg={errorMsg}
            onClose={closePop}
            onConfirm={handleDelete}
        />
    );
};

export default memo(DeleteBookPop);
