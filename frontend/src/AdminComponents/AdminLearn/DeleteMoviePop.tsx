import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useMoviesAdminContext } from "../../AdminContexts/MovieAdminContext";
import DeleteLearnPop from "./DeleteLearnPop";

const DeleteMoviePop = () => {

    const navigate = useNavigate();

    const {
        movieDelete, setMovieDelete, showDeletePop, setShowDeletePop,
        deleteMovie, loadingDeleteMovie, errorMsg, setErrorMsg
    } = useMoviesAdminContext();

    if (!showDeletePop || !movieDelete) return null;

    const closePop = () => {
        setErrorMsg("");
        setShowDeletePop(false);
        setMovieDelete(null);
    };

    const handleDelete = async () => {
        const success = await deleteMovie(movieDelete._id);

        if (success) navigate("/admin/learn/movies", { state: { success: "Movie deleted successfully." } });
    };

    return (
        <DeleteLearnPop
            entity="movie"
            name={movieDelete.title}
            detail="with its image"
            loading={loadingDeleteMovie}
            errorMsg={errorMsg}
            onClose={closePop}
            onConfirm={handleDelete}
        />
    );
};

export default memo(DeleteMoviePop);
