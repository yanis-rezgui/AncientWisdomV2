import { memo, useState } from "react"
import { useAuthContext } from "../../Contexts/AuthContext";





const SignIn = () => {

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const {signIn, loadingSignIn, setShowSignIn, msg} = useAuthContext();

    const submitForm = async(e : React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if(!email || email === "") return;
        if(!password || password === "") return;

        await signIn(email, password);

    }
    return(
        <div className="flex flex-col w-[800px] bg-[#F5F5F5] p-4 shadow-2xl rounded-[10px] mt-5 max-[850px]:w-[500px] 
        max-[550px]:w-[320px]
        ">
            <h3 className="text-center text-[1.5em] font-bold">Login</h3>

            <form onSubmit={submitForm}
            className="flex flex-col gap-4 mt-5"
            >
                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="email"
                    className="text-[#3E3025] text-[16px] font-[600]"
                    >
                        Email
                    </label>
                    <input 
                    name="email"
                    type="email" 
                    placeholder="Ex : marcusaurelius@gmail.com"
                    className="text-[14px] p-2 border-2 border-gray-300 rounded-[5px]"
                    />
                </div>

                <div className="flex flex-col gap-1 w-full">
                    <label htmlFor="password"
                    className="text-[#3E3025] text-[16px] font-[600]"
                    >
                        Password
                    </label>

                   <div className="relative w-full">
                    <input 
                    name={"password"}
                    type={showPassword ? "text":"password"} 
                    placeholder="8+ characters, uppercase, number & special character"
                    className="text-[14px] p-2 border-2 border-gray-300 rounded-[5px] w-full"
                    />
                    <button
                        type="button"
                        tabIndex={-1}
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
                    >
                        {!showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a18.5 18.5 0 0 1 5.06-5.94M9.9 4.24A10.94 10.94 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                    </div>
                </div>

                <div className="h-[15px]  flex justify-center items-center">
                    {msg &&
                     <p className="text-[15px] text-red-800 font-[600] text-center">
                        {msg}
                     </p>
                    }
                </div>

                <button type="submit"
                className="w-full py-2 rounded-[5px] bg-[#3E3025] text-white font-[600] 
                cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60
                "
                >
                    {loadingSignIn ? "Signing In..." : "Login"}
                </button>

                <div className="flex flex-col justify-center items-center mt-1">
                    <p className="text-gray-900">
                        Don't have an account?
                    </p>
                    <p 
                    
                    onClick={()=>setShowSignIn(false)} className="text-gray-800 underline cursor-pointer transition-opacity duration-200 hover:opacity-80 active:opacity-60"> 
                       Create account
                    </p>
                </div>
            </form>
        </div>
    )
}


export default memo(SignIn);