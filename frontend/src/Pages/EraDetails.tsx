import { memo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEraContext } from "../Contexts/EraContext";
import EraHero from "../Components/EraDetailsComponents/EraHero";
import EraSections from "../Components/EraDetailsComponents/EraSections";



const EraDetails = () => {

    const {id} = useParams();
    const {getEra, loadingEra, currentEra} = useEraContext();

    useEffect(()=>{
        getEra(id);
    }, [id]);

    const navigate = useNavigate();

    return(
        <section className="flex flex-col w-full items-center min-h-screen bg-[#E8E2D6] relative">
            
            {loadingEra ?
            
               <p className="mt-10 text-[1.2em] font-[600] text-center">
                Loading...
               </p>
               : 
                !currentEra ?
                   <div className="flex flex-col gap-3 bg-gray-50 rounded-lg mt-10 gap-5 py-5">
                        <img src="https://res.cloudinary.com/dub4fhabm/image/upload/v1791209639/f59eb14c-76d1-407d-95fa-f1a1adc253e5.png"
                        alt="" 
                        className="w-[300px]"
                        />

                        <p className="text-center text-[1.4em] font-bold">
                            Event Not Found
                        </p>
                    </div>
                    : 
                    <>
                      <EraHero era={currentEra}/>
                      <EraSections era={currentEra}/>
                    </>
             }

              <button
            onClick={()=>navigate("/eras")}
            className="bg-[#3E3025] text-white absolute left-2 top-2
            flex flex-row justify-center items-center gap-2 px-4 py-1 rounded-[10px]
            cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
            ">
                <i className="fa-solid fa-arrow-left-long"></i>
                Back
            </button>
        </section>
    );
}


export default memo(EraDetails);