import { memo, useCallback, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { useMovieContext } from "../../Contexts/MovieContext";
import MediaCard, { type MediaItem } from "../../Components/LearnComponents/SharedComponents/MediaCard";
import MediaModal from "../../Components/LearnComponents/SharedComponents/MediaModal";
import LearnSearch from "../../Components/LearnComponents/SharedComponents/LearnSearch";
import LearnPagination from "../../Components/LearnComponents/SharedComponents/LearnPagination";

const Movies = () => {
    const {
        movies,
        loadingAllMovies,
        page,
        setPage,
        totalPages,
        search,
        setSearch,
        errorMsg,
    } = useMovieContext();

    const [selected, setSelected] = useState<MediaItem | null>(null);

    const items: MediaItem[] = useMemo(
        () =>
            movies.map((m) => ({
                _id: m._id,
                title: m.title,
                description: m.description,
                imageUrl: m.image?.url ?? "",
                eraName: m.era?.name,
            })),
        [movies]
    );

    const handleSearch = useCallback(
        (value: string) => {
            setPage(1);
            setSearch(value);
        },
        [setPage, setSearch]
    );

    const handlePageChange = useCallback(
        (p: number) => {
            setPage(p);
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [setPage]
    );

    const openItem = useCallback((item: MediaItem) => setSelected(item), []);
    const closeItem = useCallback(() => setSelected(null), []);

    return (
        <section className="flex flex-col min-h-screen items-center w-full bg-[#E8E2D6] pb-10">
            {/* Header */}
            <div className="flex flex-col justify-center items-center gap-2 mt-10 px-5">
                <h3 className="text-[#3E3025] font-semibold text-center">
                    HISTORY ON SCREEN
                </h3>

                <h1 className="text-[1.5em] font-bold text-gray-800 text-center">
                    Films That Bring the Past to Life
                </h1>

                <p
                    className="w-[500px] text-center text-gray-800
                    max-[550px]:w-[300px]"
                >
                    Discover historical films and the real stories, people,
                    and eras that inspired them.
                </p>

                <Link
                    to="/learn"
                    className="p-2 mt-2 bg-white text-[#3E3025] font-semibold text-[14px] rounded-lg flex flex-row gap-2
                    items-center cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"
                >
                    <i className="fa-solid fa-arrow-left"></i> Back to Learn
                </Link>
            </div>

            {/* Search */}
            <div className="mt-6 px-5">
                <LearnSearch
                    placeholder="Search movies by title"
                    value={search}
                    onSearch={handleSearch}
                />
            </div>

            {/* Content */}
            <div className="w-full max-w-[1200px] px-5 mt-8 pt-6 border-t border-t-gray-400">
                {errorMsg ? (
                    <p className="py-10 text-center text-[15px] text-red-700">
                        {errorMsg}
                    </p>
                ) : loadingAllMovies ? (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] max-[450px]:grid-cols-2 gap-4">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div
                                key={n}
                                className="aspect-[2/3.4] rounded-lg bg-gray-300/60 animate-pulse"
                            />
                        ))}
                    </div>
                ) : items.length === 0 ? (
                    <p className="py-10 text-center text-[15px] text-gray-700 italic">
                        {search.trim()
                            ? "No movie matches your search."
                            : "No movies have been added yet."}
                    </p>
                ) : (
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] max-[450px]:grid-cols-2 gap-4">
                        {items.map((item) => (
                            <MediaCard
                                key={item._id}
                                item={item}
                                onOpen={openItem}
                            />
                        ))}
                    </div>
                )}

                <LearnPagination
                    page={page}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                />
            </div>

            <MediaModal item={selected} kindLabel="Movie" onClose={closeItem} />
        </section>
    );
};

export default memo(Movies);