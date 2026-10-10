
import { createContext, useContext, useState } from "react";

import { useAuthContext } from "../Contexts/AuthContext";
import { useBookContext, type BookWithId } from "../Contexts/BookContext";

export interface BookFormData {
    title: string;
    author: string;
    description: string;
    era: string;
    image?: File | null;
}

interface BooksAdminContextType {
    addBook: (formData: FormData) => Promise<boolean>;
    loadingAddBook: boolean;

    updateBook: (id: string, formData: FormData) => Promise<boolean>;
    loadingUpdateBook: boolean;

    deleteBook: (id: string) => Promise<boolean>;
    loadingDeleteBook: boolean;

    showDeletePop: boolean;
    setShowDeletePop: (show: boolean) => void;

    bookDelete: BookWithId | null;
    setBookDelete: (book: BookWithId | null) => void;

    errorMsg: string;
    setErrorMsg: (msg: string) => void;
}

const BooksAdminContext = createContext<BooksAdminContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/books`;

export const BooksAdminProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [loadingAddBook, setLoadingAddBook] = useState<boolean>(false);
    const [loadingUpdateBook, setLoadingUpdateBook] = useState<boolean>(false);
    const [loadingDeleteBook, setLoadingDeleteBook] = useState<boolean>(false);

    const [showDeletePop, setShowDeletePop] = useState<boolean>(false);
    const [bookDelete, setBookDelete] = useState<BookWithId | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");

    const { token } = useAuthContext();
    const { getAllBooks } = useBookContext();

    // POST /api/v1/books
    const addBook = async (formData: FormData): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to add a book.");
            return false;
        }

        try {
            setLoadingAddBook(true);
            setErrorMsg("");

            const res = await fetch(`${API_URL}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in adding book"
                );
            }

            await getAllBooks();
            return true;
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err instanceof Error ? err.message : "Error in adding book"
            );
            return false;
        } finally {
            setLoadingAddBook(false);
        }
    };

    // PUT /api/v1/books/:id
    const updateBook = async (
        id: string,
        formData: FormData
    ): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to update a book.");
            return false;
        }

        try {
            setLoadingUpdateBook(true);
            setErrorMsg("");

            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in updating book"
                );
            }

            await getAllBooks();
            return true;
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err instanceof Error ? err.message : "Error in updating book"
            );
            return false;
        } finally {
            setLoadingUpdateBook(false);
        }
    };

    // DELETE /api/v1/books/:id
    const deleteBook = async (id: string): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to delete a book.");
            return false;
        }

        try {
            setLoadingDeleteBook(true);
            setErrorMsg("");

            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in deleting book"
                );
            }

            setShowDeletePop(false);
            setBookDelete(null);

            await getAllBooks();
            return true;
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err instanceof Error ? err.message : "Error in deleting book"
            );
            return false;
        } finally {
            setLoadingDeleteBook(false);
        }
    };

    return (
        <BooksAdminContext.Provider
            value={{
                addBook,
                loadingAddBook,
                updateBook,
                loadingUpdateBook,
                deleteBook,
                loadingDeleteBook,
                showDeletePop,
                setShowDeletePop,
                bookDelete,
                setBookDelete,
                errorMsg,
                setErrorMsg,
            }}
        >
            {children}
        </BooksAdminContext.Provider>
    );
};

export const useBooksAdminContext = () => {
    const context = useContext(BooksAdminContext);

    if (!context) {
        throw new Error(
            "Please use useBooksAdminContext inside a BooksAdminProvider"
        );
    }

    return context;
};
