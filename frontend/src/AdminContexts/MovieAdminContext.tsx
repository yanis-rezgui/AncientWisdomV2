
import { createContext, useContext, useState } from "react";

import { useAuthContext } from "../Contexts/AuthContext";
import {
    useMovieContext,
    type MovieWithId,
} from "../Contexts/MovieContext";

export interface MovieFormData {
    title: string;
    description: string;
    era: string;
    image?: File | null;
}

interface MoviesAdminContextType {
    addMovie: (formData: FormData) => Promise<boolean>;
    loadingAddMovie: boolean;

    updateMovie: (
        id: string,
        formData: FormData
    ) => Promise<boolean>;
    loadingUpdateMovie: boolean;

    deleteMovie: (id: string) => Promise<boolean>;
    loadingDeleteMovie: boolean;

    showDeletePop: boolean;
    setShowDeletePop: (show: boolean) => void;

    movieDelete: MovieWithId | null;
    setMovieDelete: (movie: MovieWithId | null) => void;

    errorMsg: string;
    setErrorMsg: (msg: string) => void;
}

const MoviesAdminContext =
    createContext<MoviesAdminContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/movies`;

export const MoviesAdminProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [loadingAddMovie, setLoadingAddMovie] =
        useState<boolean>(false);

    const [loadingUpdateMovie, setLoadingUpdateMovie] =
        useState<boolean>(false);

    const [loadingDeleteMovie, setLoadingDeleteMovie] =
        useState<boolean>(false);

    const [showDeletePop, setShowDeletePop] =
        useState<boolean>(false);

    const [movieDelete, setMovieDelete] =
        useState<MovieWithId | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");

    const { token } = useAuthContext();
    const { getAllMovies } = useMovieContext();

    // POST /api/v1/movies
    const addMovie = async (
        formData: FormData
    ): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to add a movie.");
            return false;
        }

        try {
            setLoadingAddMovie(true);
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
                    data.error ||
                    data.message ||
                    "Error in adding movie"
                );
            }

            await getAllMovies();

            return true;
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in adding movie"
            );

            return false;
        } finally {
            setLoadingAddMovie(false);
        }
    };

    // PUT /api/v1/movies/:id
    const updateMovie = async (
        id: string,
        formData: FormData
    ): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to update a movie.");
            return false;
        }

        try {
            setLoadingUpdateMovie(true);
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
                    data.error ||
                    data.message ||
                    "Error in updating movie"
                );
            }

            await getAllMovies();

            return true;
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in updating movie"
            );

            return false;
        } finally {
            setLoadingUpdateMovie(false);
        }
    };

    // DELETE /api/v1/movies/:id
    const deleteMovie = async (
        id: string
    ): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to delete a movie.");
            return false;
        }

        try {
            setLoadingDeleteMovie(true);
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
                    data.error ||
                    data.message ||
                    "Error in deleting movie"
                );
            }

            setShowDeletePop(false);
            setMovieDelete(null);

            await getAllMovies();

            return true;
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in deleting movie"
            );

            return false;
        } finally {
            setLoadingDeleteMovie(false);
        }
    };

    return (
        <MoviesAdminContext.Provider
            value={{
                addMovie,
                loadingAddMovie,
                updateMovie,
                loadingUpdateMovie,
                deleteMovie,
                loadingDeleteMovie,
                showDeletePop,
                setShowDeletePop,
                movieDelete,
                setMovieDelete,
                errorMsg,
                setErrorMsg,
            }}
        >
            {children}
        </MoviesAdminContext.Provider>
    );
};

export const useMoviesAdminContext = () => {
    const context = useContext(MoviesAdminContext);

    if (!context) {
        throw new Error(
            "Please use useMoviesAdminContext inside a MoviesAdminProvider"
        );
    }

    return context;
};
