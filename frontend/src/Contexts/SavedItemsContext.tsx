import { createContext, useContext, useEffect, useState } from "react";
import type { HistoricalEvent, HistoricalFigure, ItemType, Quote } from "../Types/Types";
import { useAuthContext } from "./AuthContext";



interface SavedItemsContextType{
    savedQuotes : Quote[];
    loadingSavedQuotes : boolean;
    getSavedQuotes : ()=>Promise<void>;

    savedEvents : HistoricalEvent[];
    loadingSavedEvents : boolean;
    getSavedEvents : ()=>Promise<void>;
    
    savedFigures : HistoricalFigure[];
    loadingSavedFigures : boolean;
    getSavedFigures : ()=>Promise<void>;

    toggleFavorite : (itemType: ItemType, itemId : string)=>Promise<void>;
    loadingToggleFavorite : boolean;
}


const SavedItemsContext = createContext<SavedItemsContextType | null>(null);

export const SavedItemsProvider = ({children} : {children : React.ReactNode}) => {

    const [savedQuotes, setSavedQuotes] = useState<Quote[]>([]);
    const [loadingSavedQuotes, setLoadingSavedQuotes] = useState<boolean>(false);

    const [savedEvents, setSavedEvents] = useState<HistoricalEvent[]>([]);
    const [loadingSavedEvents, setLoadingSavedEvents] = useState<boolean>(false);

    const [savedFigures, setSavedFigures] = useState<HistoricalFigure[]>([]);
    const [loadingSavedFigures, setLoadingSavedFigures] = useState<boolean>(false);

    const [loadingToggleFavorite, setLoadingToggleFavorite] = useState<boolean>(false);

    const {token, user} = useAuthContext();


    const getSavedQuotes = async() => {

        try{

            setLoadingSavedQuotes(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/saved-items/quotes`,{
                method : "GET",
                headers : {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${token}`
                }
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting saved Quotes");
            }

            setSavedQuotes(data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingSavedQuotes(false);
        }
    }


    const getSavedEvents = async() => {

        try{

            setLoadingSavedEvents(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/saved-items/events`,{
                method : "GET",
                headers : {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${token}`
                }
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting saved events");
            }

            setSavedEvents(data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingSavedEvents(false);
        }
    }

    
    const getSavedFigures = async() => {

        try{

            setLoadingSavedFigures(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/saved-items/figures`,{
                method : "GET",
                headers : {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${token}`
                }
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting saved figures");
            }

            setSavedFigures(data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingSavedFigures(false);
        }
    }


    const toggleFavorite = async(itemType : ItemType, itemId : string) => {

        try{

            setLoadingToggleFavorite(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/saved-items/toggle`, {
                method : "POST",
                headers : {
                    "Content-Type": "application/json",
                    Authorization : `Bearer ${token}`
                },
                body : JSON.stringify({itemType, itemId})
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in toggling");
            }

            await getSavedEvents();
            await getSavedFigures();
            await getSavedQuotes();
        }catch(err){
            console.error(err);
        }finally{
            setLoadingToggleFavorite(false);
        }
    }


    useEffect(()=>{
        getSavedEvents();
        getSavedFigures();
        getSavedQuotes();
    }, [user, token])

    return <SavedItemsContext.Provider value={{
            savedQuotes,
    loadingSavedQuotes,
    getSavedQuotes,

    savedEvents,
    loadingSavedEvents ,
    getSavedEvents ,
    
    savedFigures ,
    loadingSavedFigures ,
    getSavedFigures ,

    toggleFavorite ,
    loadingToggleFavorite
    }}>
        {children}
    </SavedItemsContext.Provider>
}


export const useSavedItemsContext = () => {

    const context = useContext(SavedItemsContext);

    if(!context){
        throw new Error("Please use the useSavedItemsContext inside the SavedItemsProvider");
    }

    return context;
}