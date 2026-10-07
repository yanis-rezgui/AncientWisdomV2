import { memo } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { HistoricalFigure } from "../../Types/Types";
import { useFiguresAdminContext } from "../../AdminContexts/FigureAdminContext";




const AdminFiguresCard = ({ figure }: { figure: HistoricalFigure }) => {

    const navigate = useNavigate();
    const { setShowDeletePop, setFigureDelete } = useFiguresAdminContext();

    return (
        <div className="flex flex-col items-center w-[300px] bg-[#F8F5EF] shadow-lg p-4 gap-3 rounded-lg
        transition-all duration-300
        hover:-translate-y-1
        hover:shadow-xl">

            <img
                src={figure.image?.url || ""}
                alt={figure.name}
                className="w-[200px] h-[200px] object-cover rounded-full"
            />

            <div className="flex flex-col items-center gap-1 text-center">
                <h3 className="text-[18px] font-[600] text-[#3E3025]">
                    {figure.name}
                </h3>

                <div className="flex flex-col items-center  text-[16px] font-bold text-gray-600">
                    <span>{figure.birthDate}</span>

                    <ArrowDown size={15} />

                    <span>{figure.deathDate}</span>
                </div>
            </div>

            <div className="flex flex-row justify-center items-center gap-2 mt-1">
                <button
                    className="bg-green-900 text-white text-[13px] font-[600] p-2
                    rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80
                    active:opacity-60"
                    onClick={() => navigate(`/admin/figure/${figure._id}`)}
                >
                    <i className="fa-solid fa-pen-to-square"></i> Update
                </button>

                <button
                    className="bg-red-900 text-white text-[13px] font-[600] p-2
                    rounded-lg cursor-pointer transition-opacity duration-200 hover:opacity-80
                    active:opacity-60"
                    onClick={() => {
                        setFigureDelete(figure);
                        setShowDeletePop(true);
                    }}
                >
                    <i className="fa-solid fa-trash"></i> Delete
                </button>
            </div>
        </div>
    );
};

export default memo(AdminFiguresCard);