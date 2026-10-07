import { memo } from "react";
import { Link } from "react-router-dom";
import FiguresFilters from "../Components/FiguresComponents/FiguresFilters";
import { useFiguresContext } from "../Contexts/FiguresContext";
import Pagination from "../Components/Pagination/Pagination";
import AdminFiguresCard from "../AdminComponents/AdminFiguresComponents/AdminFiguresCard";
import DeleteFigurePop from "../AdminComponents/AdminFiguresComponents/DeleteFigurePop";
import { useFiguresAdminContext } from "../AdminContexts/FigureAdminContext";


const AdminFigures = () => {

    // Adapte les noms si ton FiguresContext les expose différemment
    const { totalFigures, figures, page, totalPages, limit, setPage, setLimit } = useFiguresContext();
    const { showDeletePop } = useFiguresAdminContext();

    return (
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6]">
            <div className="w-[900px] flex flex-row items-center justify-between mt-10
            max-[950px]:w-[600px] max-[650px]:flex-col max-[650px]:justify-center
            max-[650px]:px-4 max-[650px]:gap-3
            ">
                <h2 className="text-[#3E3025] text-[1.5em] font-[600]">
                    Historical Figures
                </h2>

                <Link to={"/admin/addFigure"} className="bg-[#3E3025] text-white text-[14px] font-[600]
                p-2 rounded-lg cursor-pointer transition-opacity duration-200
                hover:opacity-80 active:opacity-60
                ">
                    + Add Figure
                </Link>
            </div>

            <p className="text-[#3E3025] mt-5 px-4 text-center">
                Manage the historical figures of Ancient Wisdom, Add, Update And Delete
            </p>

            <FiguresFilters />

            <div className="flex flex-row justify-center items-center gap-2 mt-5 font-[600] text-[18px]">
                <p>Total Figures :</p>
                <p>{totalFigures}</p>
            </div>

            <div className="flex flex-row flex-wrap justify-center items-start gap-4 mt-5 px-4">
                {figures.map((f) => (
                    <AdminFiguresCard figure={f} key={f._id} />
                ))}
            </div>

            <Pagination
                page={page}
                totalPages={totalPages}
                totalItems={totalFigures}
                limit={limit}
                setPage={setPage}
                setLimit={setLimit}
            />

            {showDeletePop && <DeleteFigurePop />}
        </section>
    );
};

export default memo(AdminFigures);