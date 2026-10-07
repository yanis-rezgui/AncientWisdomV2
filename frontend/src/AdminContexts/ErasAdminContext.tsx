import { createContext, useContext, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";

import type { HistoricalEra } from "../Types/Types";
import { useEraContext } from "../Contexts/EraContext";


interface ErasAdminContextType{

    addEra : (formData : FormData)=>Promise<boolean>;
    loadingAddEra : boolean;

    updateEra: (id : string, formData : FormData)=>Promise<boolean>;
    loadingUpdateEra : boolean;

    deleteEra : (id : string)=>Promise<boolean>;
    loadingDeleteEra : boolean;

    showDeletePop : boolean;
    setShowDeletePop : (b : boolean)=>void;

    eraDelete : HistoricalEra | null;
    setEraDelete : (era : HistoricalEra | null)=>void;

    errorMsg : string;
    setErrorMsg : (msg : string)=>void;
}

const ErasAdminContext = createContext<ErasAdminContextType | null>(null);


export const ErasAdminProvider = ({children} : {children : React.ReactNode}) => {

    const [loadingAddEra, setLoadingAddEra] = useState<boolean>(false);
    const [loadingUpdateEra, setLoadingUpdateEra] = useState<boolean>(false);
    const [loadingDeleteEra, setLoadingDeleteEra] = useState<boolean>(false);
    const [showDeletePop, setShowDeletePop] = useState<boolean>(false);
    const [eraDelete, setEraDelete] = useState<HistoricalEra | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    const {token} = useAuthContext();
    const {getAllEras} = useEraContext();

    const addEra = async(formData : FormData) : Promise<boolean> => {

        try{

            setLoadingAddEra(true);
            setErrorMsg("");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/era/`, {
                method : "POST",
                headers : {
                    Authorization : `Bearer ${token}`
                },
                body : formData
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in adding era");
            }

            await getAllEras();
            return true;

        }catch(err){
            console.error(err);
            setErrorMsg(err instanceof Error ? err.message : "Error in adding era");
            return false;
        }finally{
            setLoadingAddEra(false);
        }
    }

    const updateEra = async(id : string, formData : FormData) : Promise<boolean> => {

        try{

            setLoadingUpdateEra(true);
            setErrorMsg("");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/era/${id}`,{
                method : "PUT",
                headers : {
                    Authorization : `Bearer ${token}`,
                },
                body : formData
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating era");
            }

            await getAllEras();
            return true;

        }catch(err){
            console.error(err);
            setErrorMsg(err instanceof Error ? err.message : "Error in updating era");
            return false;
        }finally{
            setLoadingUpdateEra(false);
        }
    }

    const deleteEra = async(id : string) : Promise<boolean> => {

        try{

            setLoadingDeleteEra(true);
            setErrorMsg("");

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/era/${id}`,{
                method : "DELETE",
                headers : {
                    Authorization : `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in deleting era");
            }

            await getAllEras();
            return true;

        }catch(err){
            console.error(err);
            setErrorMsg(err instanceof Error ? err.message : "Error in deleting era");
            return false;
        }finally{
            setLoadingDeleteEra(false);
        }
    }


    return <ErasAdminContext.Provider value={{
        addEra,
        loadingAddEra,
        updateEra,
        loadingUpdateEra,
        deleteEra,
        loadingDeleteEra,
        showDeletePop,
        setShowDeletePop,
        eraDelete,
        setEraDelete,
        errorMsg,
        setErrorMsg
    }}>
        {children}
    </ErasAdminContext.Provider>
}


export const useErasAdminContext = () => {

    const context = useContext(ErasAdminContext);

    if(!context){
        throw new Error("Please use the useErasAdminContext inside the ErasAdminProvider");
    }

    return context;
}