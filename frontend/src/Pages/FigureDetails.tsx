import { memo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFiguresContext } from "../Contexts/FiguresContext";
import FigureOverview from "../Components/FigureDetailsComponents/FigureOverview";
import FigureFacts from "../Components/FigureDetailsComponents/FigureFacts";
import Biography from "../Components/FigureDetailsComponents/Biography";
import FiguresEras from "../Components/FigureDetailsComponents/FiguresEras";
import FiguresQuotes from "../Components/FigureDetailsComponents/FiguresQuotes";



const FigureDetails = () => {

    const {id} = useParams();
    const navigate = useNavigate();
    

    const {getFigure, currentFigure, loadingFigure} = useFiguresContext();

    useEffect(()=>{
        getFigure(id);
    }, [id]);
    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">
            {
                loadingFigure ?
                   <p className="mt-10 text-[18px] font-[600] text-center">
                    Loading...
                   </p>
                   :
            
            !currentFigure ?
             
              <div className="flex flex-col gap-3 bg-gray-50 rounded-lg mt-10 gap-5 py-5">
                <img src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791209322/3c4be797-829b-48ad-94b0-6e8a1a40d5b3.png"
                alt="" 
                className="w-[300px]"
                />

                <p className="text-center text-[1.4em] font-bold">
                    Figure Not Found
                </p>
              </div>
              :
              <>
                <FigureOverview figure={currentFigure}/>
                <FigureFacts figure={currentFigure}/>
                <Biography figure={currentFigure}/>
                <FiguresEras figure={currentFigure}/>
                <FiguresQuotes figure={currentFigure}/>
              </>
            }

            <button
            onClick={()=>navigate("/figures")}
            className="bg-[#3E3025] text-white absolute left-2 top-2
            flex flex-row justify-center items-center gap-2 px-4 py-1 rounded-[10px]
            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
            ">
                <i className="fa-solid fa-arrow-left-long"></i>
                Back
            </button>
        </section>
    )
}

export default memo(FigureDetails);