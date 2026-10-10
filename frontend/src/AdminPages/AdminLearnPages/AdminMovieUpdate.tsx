import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMoviesAdminContext } from "../../AdminContexts/MovieAdminContext";
import { useMovieContext } from "../../Contexts/MovieContext";
import { buildMovieFormData, emptyMovieForm, movieToForm, validateMovieForm, type MovieFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import MovieForm from "../../AdminComponents/AdminLearn/MovieForm";
import DeleteMoviePop from "../../AdminComponents/AdminLearn/DeleteMoviePop";


const AdminMovieUpdate = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const { getMovie, currentMovie, setCurrentMovie, loadingMovie, errorMsg: fetchError } = useMovieContext();
    const {
        updateMovie, loadingUpdateMovie, errorMsg, setErrorMsg,
        setMovieDelete, setShowDeletePop
    } = useMoviesAdminContext();

    const [form, setForm] = useState<MovieFormState>(emptyMovieForm);
    const [image, setImage] = useState<File | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        setErrorMsg("");
        if (id) void getMovie(id);

        return () => {
            setCurrentMovie(null);
            setErrorMsg("");
        };
    }, [id, getMovie, setCurrentMovie, setErrorMsg]);

    useEffect(() => {
        if (currentMovie && currentMovie._id === id) setForm(movieToForm(currentMovie));
    }, [currentMovie, id]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!id) return;

        const error = validateMovieForm(form, image, false);
        if (error) return showToast(error);

        const success = await updateMovie(id, buildMovieFormData(form, image));

        if (success) navigate("/admin/learn/movies", { state: { success: "Movie updated successfully." } });
    };

    return (
        <>
            <AdminLearnFormPage
                title="Update movie"
                subtitle={currentMovie?.title ?? "Edit the details of this movie."}
                backPath="/admin/learn/movies"
                backLabel="Back to movies"
                loading={loadingMovie || (!currentMovie && !fetchError)}
                error={!currentMovie ? fetchError : ""}
                onDelete={() => {
                    if (!currentMovie) return;
                    setMovieDelete(currentMovie);
                    setShowDeletePop(true);
                }}
            >
                {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

                <MovieForm
                    form={form}
                    setForm={setForm}
                    image={image}
                    setImage={setImage}
                    currentImageUrl={currentMovie?.image?.url}
                    loading={loadingUpdateMovie}
                    submitLabel="Save changes"
                    loadingLabel="Saving..."
                    submitIcon="fa-solid fa-floppy-disk"
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/admin/learn/movies")}
                />
            </AdminLearnFormPage>

            <DeleteMoviePop />
        </>
    );
};

export default memo(AdminMovieUpdate);
