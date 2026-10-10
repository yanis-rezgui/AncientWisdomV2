import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useBookContext } from "../../Contexts/BookContext";
import { useBooksAdminContext } from "../../AdminContexts/BookAdminContext";
import AdminLearnList from "../../AdminComponents/AdminLearn/AdminLearnList";
import AdminLearnCard from "../../AdminComponents/AdminLearn/AdminLearnCard";
import DeleteBookPop from "../../AdminComponents/AdminLearn/DeleteBookPop";
const AdminBooks = () => {

    const navigate = useNavigate();

    const {
        books, loadingAllBooks, errorMsg, page, setPage,
        totalPages, totalBooks, search, setSearch
    } = useBookContext();

    const { setBookDelete, setShowDeletePop } = useBooksAdminContext();

    return (
        <>
            <AdminLearnList
                title="Books"
                subtitle="Manage the recommended reading list."
                total={totalBooks}
                search={search}
                onSearch={(value) => { setPage(1); setSearch(value); }}
                addLabel="Add book"
                addPath="/admin/learn/addBook"
                loading={loadingAllBooks}
                errorMsg={errorMsg}
                isEmpty={books.length === 0}
                emptyLabel="No books found. Add your first book."
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            >
                {books.map((book) => (
                    <AdminLearnCard
                        key={book._id}
                        image={book.image?.url}
                        title={book.title}
                        subtitle={`by ${book.author}`}
                        description={book.description}
                        badge={book.era?.name}
                        footer={book.era?.name ?? "No era"}
                        onUpdate={() => navigate(`/admin/learn/book/${book._id}`)}
                        onDelete={() => {
                            setBookDelete(book);
                            setShowDeletePop(true);
                        }}
                    />
                ))}
            </AdminLearnList>

            <DeleteBookPop />
        </>
    );
};

export default memo(AdminBooks);
