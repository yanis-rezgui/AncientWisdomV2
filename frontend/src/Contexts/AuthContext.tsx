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

    showSignIn : boolean;
    setShowSignIn : (b : boolean)=>void;


    msg : string | null;
    loadingGetUser : boolean;
    getUser : ()=>Promise<void>;

    updateUserInfo : (firstName : string, lastName : string)=>Promise<void>;
    loadingUpdateUserInfo : boolean;

    updateUserPassword : (oldPassword : string, newPassword1 : string, newPassword2 : string)=>Promise<void>;
    loadingUpdatePassword : boolean;
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

    const [msg, setMsg] = useState<string | null>(null);

    const [showSignIn, setShowSignIn] = useState<boolean>(true);

    const [loadingGetUser, setLoadingGetUser] = useState<boolean>(false);

    const [loadingUpdateUserInfo, setLoadingUpdateUserInfo] = useState<boolean>(false);
    const [loadingUpdatePassword, setLoadingUpdatePassword] = useState<boolean>(false);


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
                setMsg(data.error || data.message || "Error in signing in")
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
                setMsg(data.error || data.message || "Error in signing up")
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


    const getUser = async() => {

        try{

            setLoadingGetUser(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/user`, {
                method : "GET",
                headers : {
                    Authorization : `Bearer ${token}`
                }
            });

            if(res.status === 401) signOut();
            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting user");
            }

            setUser(data.data);
            console.log("Current User : ", data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingGetUser(false);
        }
    }

    const updateUserInfo = async(firstName :string, lastName : string) => {

        try{

            setLoadingUpdateUserInfo(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/update/info`,{
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({firstName, lastName})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "User updated successfully");
            }

            await getUser();
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdateUserInfo(false);
        }

    }

    const updateUserPassword = async(oldPassword : string, newPassword1 : string, newPassword2 : string) => {

        try{

            setLoadingUpdatePassword(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/auth/update/password`, {
                method : "PUT",
                headers : {
                    "Content-Type" : "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({oldPassword, newPassword1, newPassword2})
            });

            
            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating password");
            }

            await getUser();
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdatePassword(false);
        }
    }
    useEffect(()=>{
        if(!token) return;
        getUser();
    }, []);


    return <AuthContext.Provider value={{
    user,
    token ,
    signIn,
    loadingSignIn ,
    signUp ,
    loadingSignUp ,
    signOut ,
    loadingSignOut,

    showSignIn,
    setShowSignIn,
    msg,
    loadingGetUser,
    getUser,

    updateUserInfo,
    loadingUpdateUserInfo,
    updateUserPassword,
    loadingUpdatePassword
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