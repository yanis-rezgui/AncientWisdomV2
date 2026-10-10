import { memo, useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { buildMovieFormData, emptyMovieForm, validateMovieForm, type MovieFormState } from "../../AdminComponents/AdminLearn/learnFormUtils";
import { useMoviesAdminContext } from "../../AdminContexts/MovieAdminContext";
import { useLearnToast } from "../../AdminComponents/AdminLearn/useLearnToast";
import Toast from "../../AdminComponents/AdminErasComponents/Toast";
import MovieForm from "../../AdminComponents/AdminLearn/MovieForm";
import AdminLearnFormPage from "../../AdminComponents/AdminLearn/AdminLearnFormPage";

const AdminMovieAjout = () => {

    const navigate = useNavigate();
    const { addMovie, loadingAddMovie, errorMsg, setErrorMsg } = useMoviesAdminContext();

    const [form, setForm] = useState<MovieFormState>(emptyMovieForm);
    const [image, setImage] = useState<File | null>(null);

    const { toast, showToast, closeToast } = useLearnToast(errorMsg);

    useEffect(() => {
        setErrorMsg("");
        return () => setErrorMsg("");
    }, [setErrorMsg]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const error = validateMovieForm(form, image, true);
        if (error) return showToast(error);

        const success = await addMovie(buildMovieFormData(form, image));

        if (success) navigate("/admin/learn/movies", { state: { success: "Movie added successfully." } });
    };

    return (
        <AdminLearnFormPage
            title="Add a movie"
            subtitle="Fill in the details of the new movie."
            backPath="/admin/learn/movies"
            backLabel="Back to movies"
        >
            {toast && <Toast message={toast.message} type={toast.type} onClose={closeToast} />}

            <MovieForm
                form={form}
                setForm={setForm}
                image={image}
                setImage={setImage}
                loading={loadingAddMovie}
                submitLabel="Add movie"
                loadingLabel="Adding..."
                submitIcon="fa-solid fa-plus"
                onSubmit={handleSubmit}
                onCancel={() => navigate("/admin/learn/movies")}
            />
        </AdminLearnFormPage>
    );
};

export default memo(AdminMovieAjout);
