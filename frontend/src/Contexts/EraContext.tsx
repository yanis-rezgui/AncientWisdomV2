import { createContext, useContext, useEffect, useState } from "react";
import type { FilterOptionsType, HistoricalEra } from "../Types/Types";




interface EraContextType{
    eras: HistoricalEra[];
    setEras : (eras : HistoricalEra[])=>void;
    getAllEras : ()=>Promise<void>;
    loadingAllEras : boolean;
    getEra : (id : string)=>Promise<void>;
    loadingEra : boolean;
    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    totalEras: number;
    totalPages: number;
    search : string;
    setSearch : (search : string)=>void;
    currentEra: HistoricalEra | null;
    setCurrentEra: (era : HistoricalEra | null)=>void;

    erasOptions : FilterOptionsType[];

   
}


const EraContext = createContext<EraContextType | null>(null);

export const EraProvider = ({children} : {children : React.ReactNode}) => {

    const [eras, setEras] = useState<HistoricalEra[]>([]);
    const [loadingAllEras, setLoadingAllEras] = useState<boolean>(false);
    const [search, setSearch] = useState<string>("");

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalEras, setTotalEras] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingEra, setLoadingEra] = useState<boolean>(false);

    const [currentEra, setCurrentEra] = useState<HistoricalEra | null>(null);

    const [erasOptions, setErasOptions] = useState<FilterOptionsType[]>([]);
    


    const getAllEras = async () => {

        setLoadingAllEras(true);
        try{

            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if(search){
                params.append("search", search);
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/era?${params.toString()}`,{
                method : "GET",
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in fetching eras");
            }

            setEras(data.data);
            console.log("Eras : ", data.data);
            setTotalEras(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingAllEras(false);
        }
    }


    const getEra = async(id : string) => {

        try{

            setLoadingEra(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/era/${id}`, {
                method : "GET"
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in fetching era");
            }

            setCurrentEra(data.data);
            console.log("Current Era : ", data.data);

        }catch(err){
            console.error(err);
        }finally{
            setLoadingEra(false);
        }
    }


    const getErasOptions = async() => {

        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/era/options`, {
                method : "GET"
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in fetching eras");
            }

            setErasOptions(data.data);
            console.log("Era Options: ", data.data);

        }catch(err){
            console.error(err);
        }
    }
    useEffect(()=>{
        getAllEras();
    }, [page, limit, search]);

    useEffect(()=>{
        getErasOptions();
    }, []);


    return <EraContext.Provider value={{
   
    eras,
    setEras,
    getAllEras,
    loadingAllEras,
    getEra,
    loadingEra,
    page,
    setPage,
    limit,
    setLimit,
    totalEras,
    totalPages,
    search ,
    setSearch ,
    currentEra,
    setCurrentEra,
    erasOptions,
    

    }}>
         {children}
    </EraContext.Provider>
}


export const useEraContext = () => {

    const context = useContext(EraContext);
    if(!context){
        throw new Error("useEraContext must be used within an EraProvider");
    }
    return context;
}