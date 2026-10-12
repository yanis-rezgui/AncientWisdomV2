import { Landmark, Quote, Save, SaveIcon, UserRound } from "lucide-react";
import { memo } from "react"
import { useAuthContext } from "../../Contexts/AuthContext";
import { useNavigate } from "react-router-dom";



const NoUser = () => {

    const data =  [
        {
            title : "Quotes",
            icon : Quote,
        },
        {
            title : "Events",
            icon : Landmark
        },
        {
            title : "Figures",
            icon : UserRound
        }
    ];

    const {setShowSignIn} = useAuthContext();
    const navigate = useNavigate();

    return(
        <div className=" flex flex-col justify-center items-center gap-2 mt-10 ">
           <div className="text-[#3E3025] bg-gray-50 p-4 rounded-full">
               <Save size={30}/>
           </div>

           <h1 className="text-[#3E3025] text-[1.3em] font-semibold">
            Your Personal Collection
           </h1>

           <p className="text-gray-800 text-[1.1em] font-[600] text-center">
            Save the moments, people, and words that shaped history.
           </p>

           <div className="flex flex-wrap justify-center items-center gap-5 mt-5">
               {data.map((d)=>{
                const Icon = d.icon;
                 return(
                    <div className="w-[250px] rounded-lg py-3 flex flex-col
                    justify-center items-center gap-2 text-[#3E3025] font-bold
                    bg-gray-50
                    shadow-lg
                hover:shadow-2xl
                hover:-translate-y-1
                transition-all
                duration-300
                    ">
                        <Icon size={30}/>
                        <p>
                            {d.title}
                        </p>
                    </div>
                 )
               })}
           </div>

           <p className="text-gray-700 mt-3 text-center w-[600px] max-[620px]:w-[400px] max-[420px]:w-[300px]">
            Create your own historical collection.
             Sign in to save your favorite quotes, events,
              and historical figures and find them whenever you return.
           </p>

          <div className="w-[600px] max-[620px]:w-[400px] max-[420px]:w-[300px]
          flex flex-col
          ">
              <button 
             className="flex flex-row justify-center items-center gap-2 bg-[#3E3025] text-white p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3
                "
              onClick={()=>{
                setShowSignIn(true);
                navigate("/user")
              }}
              >
            Sign in to your account
           </button>

           <button 
           className="flex flex-row justify-center items-center gap-2 bg-white text-[#3E3025] p-2
                font-[600] rounded-[5px] transition-opacity duration-200 hover:opacity-80 active:opacity-60
                mt-3 border-2 border-[#3E3025] cursor-pointer
                "
           onClick={()=>{
            setShowSignIn(false);
            navigate("/user")
           }}>
            Create an account
           </button>
          </div>
           
        </div>
    )
}


export default memo(NoUser);