import { createContext, useContext, useState } from "react";
import { useAuthContext } from "../Contexts/AuthContext";
import { useQuotesContext } from "../Contexts/QuotesContext";
import type { Quote } from "../Types/Types";



interface QuoteFormData {
    text: string;
    source: string;
    era: string;
    author: string;
    tags: string[];
}

interface QuotesAdminContextType{
    addQuote : (dataForm : QuoteFormData)=>Promise<void>;
    loadingAddQuote : boolean;
    showAddPop : boolean;
    setShowAddPop : (b : boolean)=>void;

    updateQuote : (id: string,
    dataForm: Partial<QuoteFormData>)=>Promise<void>;
    loadingUpdateQuote : boolean;
    showUpdatePop : boolean;
    setShowUpdatePop : (b : boolean)=>void;

    deleteQuote : (id : string)=>Promise<void>;
    loadingDeleteQuote : boolean;
    showDeletePop : boolean;
    setShowDeletePop : (b : boolean)=>void;

    selectedQuote : Quote | null;
    setSelectedQuote : (q : Quote | null)=>void;
}

const QuotesAdminContext = createContext<QuotesAdminContextType | null>(null);

export const QuotesAdminProvider = ({children} : {children : React.ReactNode}) => {

    const [loadingAddQuote, setLoadingAddQuote] = useState<boolean>(false);
    const [loadingUpdateQuote, setLoadingUpdateQuote] = useState<boolean>(false);
    const [loadingDeleteQuote, setLoadingDeleteQuote] = useState<boolean>(false);

    const [showAddPop, setShowAddPop] = useState<boolean>(false);
    const [showUpdatePop, setShowUpdatePop] = useState<boolean>(false);
    const [showDeletePop, setShowDeletePop] = useState<boolean>(false);

    const {token} = useAuthContext();
    const {getAllQuotes} = useQuotesContext();

    const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

    const addQuote = async(dataForm :QuoteFormData) => {

        try{

            setLoadingAddQuote(true)

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quotes/`, {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                   Authorization : `Bearer ${token}`
                },
                body : JSON.stringify(dataForm)
            })

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in adding quote");
            }

            await getAllQuotes();
            setShowAddPop(false);

        }catch(err){
            console.error(err);
        }finally{
            setLoadingAddQuote(false);
        
        }
    }


    const updateQuote = async(id: string,
    dataForm: Partial<QuoteFormData>) => {

        try{

            setLoadingUpdateQuote(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quotes/${id}`,{
                 method : "PUT",
                 headers : {
                    "Content-Type" : "application/json",
                     Authorization : `Bearer ${token}`
                 },
                 body : JSON.stringify(dataForm)
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in updating quote");
            }

            await getAllQuotes();
            setShowUpdatePop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingUpdateQuote(false);
        }
    }

    const deleteQuote = async(id : string) => {

        try{

            setLoadingDeleteQuote(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quotes/${id}`, {
                method : "DELETE",
                headers : {
                    Authorization: `Bearer ${token}`
                },
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in deleting quote");
            }

            await getAllQuotes();
            setShowDeletePop(false);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingDeleteQuote(false);
        }
    }

    return <QuotesAdminContext.Provider value={{
        addQuote,
        loadingAddQuote,
        updateQuote,
        loadingDeleteQuote,
        deleteQuote,
        loadingUpdateQuote,
        showAddPop,
        showDeletePop,
        showUpdatePop,
        setShowAddPop,
        setShowDeletePop,
        setShowUpdatePop,


        selectedQuote,
        setSelectedQuote
    }}>
        {children}
    </QuotesAdminContext.Provider>
}


export const useQuotesAdminContext = () => {

    const context = useContext(QuotesAdminContext);

    if(!context){
        throw new Error("Use the useQuotesAdminContext inside the QuotesAdminProvider");
    }

    return context;
}

