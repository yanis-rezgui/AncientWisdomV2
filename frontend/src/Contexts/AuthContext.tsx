import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../Types/Types";


interface AuthContextType{
    user : User | null;
    token : string | null;
    
    signIn : (email : string, password : string)=>Promise<void>;
    loadingSignIn : boolean;

    signUp : (firstName : string, lastName : string, email : string, password1 : string, password2 : string)=>Promise<void>;
    loadingSignUp : boolean;

    signOut : ()=>Promise<void>;
    loadingSignOut : boolean;
}


const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({children} : {children : React.ReactNode}) => {

    const [user, setUser] = useState<User | null>(()=>{
        const saved = localStorage.getItem('user');

        return saved ? JSON.parse(saved) : null;
    });

    const [token, setToken] = useState<string | null>(()=>{
        const saved = localStorage.getItem('token');

        return saved ? JSON.parse(saved) : null;
    });


    useEffect(()=>{
        localStorage.setItem('user', JSON.stringify(user));
    }, [user]);

    useEffect(()=>{
        localStorage.setItem('token', JSON.stringify(token));
    }, [token]);

    const [loadingSignIn, setLoadingSignIn] = useState<boolean>(false);
    const [loadingSignUp, setLoadingSignUp] = useState<boolean>(false);
    const [loadingSignOut, setLoadingSignOut] = useState<boolean>(false);



    const signIn = async(email : string, password : string) => {

        try{

            setLoadingSignIn(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/sign-in`, {
                method : "POST",
                headers: {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({email, password})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in signing in");
            }

            setUser(data.data.user);
            setToken(data.data.token);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingSignIn(false);
        }
    }


    const signUp = async(firstName : string, lastName : string, email : string, password1: string, password2 : string)=>{

        try{

            setLoadingSignUp(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/sign-up`, {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify({firstName, lastName, email, password1, password2})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in signing up");
            }

            setUser(data.data.user);
            setToken(data.data.token);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingSignUp(false);
        }
    }

    const signOut = async() => {
        try{

            setLoadingSignOut(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/sign-out`,{
                method: "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in signing out");
            }

            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
            setToken(null);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingSignOut(false);
        }
    }


    return <AuthContext.Provider value={{
    user,
    token ,
    signIn,
    loadingSignIn ,
    signUp ,
    loadingSignUp ,
    signOut ,
    loadingSignOut
    }}>
        {children}
    </AuthContext.Provider>


}


export const useAuthContext = () => {

    const context = useContext(AuthContext);

    if(!context){
        throw new Error("Please use the ueAuthContext inside the AuthProvider");
    }

    return context;
}