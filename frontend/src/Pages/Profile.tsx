import { memo } from "react"
import { useAuthContext } from "../Contexts/AuthContext";
import SignIn from "../Components/AuthComponents/SignIn";
import SignUp from "../Components/AuthComponents/SignUp";



const Profile = () => {

    
    const {showSignIn, user} = useAuthContext();

    return(

        <section className="flex flex-col items-center min-h-screen w-full bg-[#E8E2D6]">

            <h1 className="text-[2em] mt-10 font-bold ">
                Ancient Wisdom
            </h1>

            <p className="text-[20px] mt-4 ">
                {showSignIn ? "Welcome back." : "Begin your journey."}
            </p>

            {
                !user ?
                showSignIn ? 
                   <SignIn/>
                   : 
                      <SignUp/>
                : 
                <></>
            }
        </section>
    )
}

export default memo(Profile);