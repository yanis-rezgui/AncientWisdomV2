import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { useMovieContext } from "../../Contexts/MovieContext";
import { useMoviesAdminContext } from "../../AdminContexts/MovieAdminContext";
import AdminLearnList from "../../AdminComponents/AdminLearn/AdminLearnList";
import AdminLearnCard from "../../AdminComponents/AdminLearn/AdminLearnCard";
import DeleteMoviePop from "../../AdminComponents/AdminLearn/DeleteMoviePop";

const AdminMovies = () => {

    const navigate = useNavigate();

    const {
        movies, loadingAllMovies, errorMsg, page, setPage,
        totalPages, totalMovies, search, setSearch
    } = useMovieContext();

    const { setMovieDelete, setShowDeletePop } = useMoviesAdminContext();

    return (
        <>
            <AdminLearnList
                title="Movies"
                subtitle="Manage the recommended movies list."
                total={totalMovies}
                search={search}
                onSearch={(value) => { setPage(1); setSearch(value); }}
                addLabel="Add movie"
                addPath="/admin/learn/addMovie"
                loading={loadingAllMovies}
                errorMsg={errorMsg}
                isEmpty={movies.length === 0}
                emptyLabel="No movies found. Add your first movie."
                page={page}
                totalPages={totalPages}
                setPage={setPage}
            >
                {movies.map((movie) => (
                    <AdminLearnCard
                        key={movie._id}
                        image={movie.image?.url}
                        title={movie.title}
                        description={movie.description}
                        badge={movie.era?.name}
                        footer={movie.era?.name ?? "No era"}
                        onUpdate={() => navigate(`/admin/learn/movie/${movie._id}`)}
                        onDelete={() => {
                            setMovieDelete(movie);
                            setShowDeletePop(true);
                        }}
                    />
                ))}
            </AdminLearnList>

            <DeleteMoviePop />
        </>
    );
};

export default memo(AdminMovies);
