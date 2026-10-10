
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import type { Movie } from "../Types/LearnTypes";

export type MovieWithId = Movie & {
    _id: string;
};

interface MovieContextType {
    movies: MovieWithId[];
    setMovies: (movies: MovieWithId[]) => void;

    getAllMovies: () => Promise<void>;
    loadingAllMovies: boolean;

    getMovie: (id: string) => Promise<void>;
    loadingMovie: boolean;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;

    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;

    totalMovies: number;
    totalPages: number;

    search: string;
    setSearch: (search: string) => void;

    currentMovie: MovieWithId | null;
    setCurrentMovie: (movie: MovieWithId | null) => void;

    errorMsg: string;
}

const MovieContext = createContext<MovieContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/movies`;

export const MovieProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [movies, setMovies] = useState<MovieWithId[]>([]);

    const [loadingAllMovies, setLoadingAllMovies] =
        useState<boolean>(false);

    const [loadingMovie, setLoadingMovie] =
        useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const [totalMovies, setTotalMovies] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [search, setSearch] = useState<string>("");

    const [currentMovie, setCurrentMovie] =
        useState<MovieWithId | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");

    // GET /api/v1/movies?page=1&limit=10&search=...
    const getAllMovies = useCallback(async (): Promise<void> => {
        setLoadingAllMovies(true);
        setErrorMsg("");

        try {
            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if (search.trim()) {
                params.append("search", search.trim());
            }

            const res = await fetch(
                `${API_URL}?${params.toString()}`,
                {
                    method: "GET",
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in fetching movies"
                );
            }

            setMovies(data.data ?? []);
            setTotalMovies(data.pagination?.total ?? 0);
            setTotalPages(data.pagination?.totalPages ?? 0);
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in fetching movies"
            );
        } finally {
            setLoadingAllMovies(false);
        }
    }, [page, limit, search]);

    // GET /api/v1/movies/:id
    const getMovie = useCallback(
        async (id: string): Promise<void> => {
            setLoadingMovie(true);
            setErrorMsg("");

            try {
                const res = await fetch(`${API_URL}/${id}`, {
                    method: "GET",
                });

                const data = await res.json();

                if (!res.ok) {
                    throw new Error(
                        data.error ||
                        data.message ||
                        "Error in fetching movie"
                    );
                }

                setCurrentMovie(data.data);
            } catch (err) {
                console.error(err);

                setErrorMsg(
                    err instanceof Error
                        ? err.message
                        : "Error in fetching movie"
                );
            } finally {
                setLoadingMovie(false);
            }
        },
        []
    );

    useEffect(() => {
        void getAllMovies();
    }, [getAllMovies]);

    return (
        <MovieContext.Provider
            value={{
                movies,
                setMovies,
                getAllMovies,
                loadingAllMovies,
                getMovie,
                loadingMovie,
                page,
                setPage,
                limit,
                setLimit,
                totalMovies,
                totalPages,
                search,
                setSearch,
                currentMovie,
                setCurrentMovie,
                errorMsg,
            }}
        >
            {children}
        </MovieContext.Provider>
    );
};

export const useMovieContext = () => {
    const context = useContext(MovieContext);

    if (!context) {
        throw new Error(
            "useMovieContext must be used within a MovieProvider"
        );
    }

    return context;
};
