import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import type { Book } from "../Types/LearnTypes";

export type BookWithId = Book & {
    _id: string;
};

interface BookContextType {
    books: BookWithId[];
    setBooks: (books: BookWithId[]) => void;

    getAllBooks: () => Promise<void>;
    loadingAllBooks: boolean;

    getBook: (id: string) => Promise<void>;
    loadingBook: boolean;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;

    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;

    totalBooks: number;
    totalPages: number;

    search: string;
    setSearch: (search: string) => void;

    currentBook: BookWithId | null;
    setCurrentBook: (book: BookWithId | null) => void;

    errorMsg: string;
}

const BookContext = createContext<BookContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/books`;

export const BookProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [books, setBooks] = useState<BookWithId[]>([]);
    const [loadingAllBooks, setLoadingAllBooks] = useState<boolean>(false);
    const [loadingBook, setLoadingBook] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const [totalBooks, setTotalBooks] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [search, setSearch] = useState<string>("");
    const [currentBook, setCurrentBook] = useState<BookWithId | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // GET /api/v1/books?page=1&limit=10&search=...
    const getAllBooks = useCallback(async (): Promise<void> => {
        setLoadingAllBooks(true);
        setErrorMsg("");

        try {
            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if (search.trim()) {
                params.append("search", search.trim());
            }

            const res = await fetch(`${API_URL}?${params.toString()}`, {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in fetching books"
                );
            }

            setBooks(data.data ?? []);
            setTotalBooks(data.pagination?.total ?? 0);
            setTotalPages(data.pagination?.totalPages ?? 0);
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in fetching books"
            );
        } finally {
            setLoadingAllBooks(false);
        }
    }, [page, limit, search]);

    // GET /api/v1/books/:id
    const getBook = useCallback(async (id: string): Promise<void> => {
        setLoadingBook(true);
        setErrorMsg("");

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in fetching book"
                );
            }

            setCurrentBook(data.data);
        } catch (err) {
            console.error(err);
            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in fetching book"
            );
        } finally {
            setLoadingBook(false);
        }
    }, []);

    useEffect(() => {
        void getAllBooks();
    }, [getAllBooks]);

    return (
        <BookContext.Provider
            value={{
                books,
                setBooks,
                getAllBooks,
                loadingAllBooks,
                getBook,
                loadingBook,
                page,
                setPage,
                limit,
                setLimit,
                totalBooks,
                totalPages,
                search,
                setSearch,
                currentBook,
                setCurrentBook,
                errorMsg,
            }}
        >
            {children}
        </BookContext.Provider>
    );
};

export const useBookContext = () => {
    const context = useContext(BookContext);

    if (!context) {
        throw new Error(
            "useBookContext must be used within a BookProvider"
        );
    }

    return context;
};
