import { createContext, useContext, useEffect, useState } from "react";
import type { HistoricalFigure, FigureFilterType, FilterOptionsType } from "../Types/Types";


interface FiguresContextType{

    figures : HistoricalFigure[];
    setFigures : (f : HistoricalFigure[])=>void;
    getAllFigures : ()=>Promise<void>;
    loadingAllFigures : boolean;
    figuresFilter : FigureFilterType;
    setFiguresFilter : (filter : FigureFilterType)=>void;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    totalFigures: number;
    totalPages: number;

    getFigure : (id : string)=>Promise<void>;
    loadingFigure : boolean;

    currentFigure : HistoricalFigure | null;
    setCurrentFigure : (f : HistoricalFigure | null)=>void;

    figuresOptions : FilterOptionsType[];
}


const FiguresContext = createContext<FiguresContextType | null>(null);

export const FiguresProvider = ({children} : {children : React.ReactNode}) => {

    const [figures, setFigures] = useState<HistoricalFigure[]>([]);
    const [loadingAllFigures, setLoadingAllFigures] = useState<boolean>(false);
    const [loadingFigure, setLoadingFigure] = useState<boolean>(false);

    const [figuresFilter, setFiguresFilter] = useState<FigureFilterType>(()=>{

        const saved = localStorage.getItem("figuresFilter");

        return saved ? JSON.parse(saved) : {
        search : "",
        era : ""
    }
    });

    const [figuresOptions, setFiguresOptions] = useState<FilterOptionsType[]>([]);

    useEffect(()=>{
        localStorage.setItem("figuresFilter", JSON.stringify(figuresFilter));
    }, [figuresFilter]);


    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalFigures, setTotalFigures] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentFigure, setCurrentFigure] = useState<HistoricalFigure | null>(null);

    const getAllFigures = async() => {

        try{

            setLoadingAllFigures(true);
            
            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if(figuresFilter.search){
                params.append("search", figuresFilter.search);
            }

            if(figuresFilter.era){
                params.append("era", figuresFilter.era);
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/figure?${params.toString()}`,{
                method : "GET",
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message || data.error || "Error in fetching Figures");
            }

            setFigures(data.data);
            console.log("Figures : ", data.data);
            setTotalFigures(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingAllFigures(false);
        }
    }


    const getFigure = async(id : string) => {

        try{

            setLoadingFigure(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/figure/${id}`, {
                method : "GET"
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message || data.error || "Error in fetching Figure");
            }

            setCurrentFigure(data.data);

            
        }catch(err){
            console.error(err);
        }finally{
            setLoadingFigure(false);
        }
    }

    const getFiguresOptions = async() => {

        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/figure/options`, {
                method : "GET",

            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message || data.error || "Error in fetching Figure");
            }

            setFiguresOptions(data.data);

        }catch(err){
            console.error(err);
        }
    }


    useEffect(()=>{
        getAllFigures();
    }, [page, limit, figuresFilter]);


    useEffect(()=>{
        getFiguresOptions();
    }, []);

    return <FiguresContext.Provider value={{
        figures,
        setFigures,
        getAllFigures,
        loadingAllFigures,
        figuresFilter,
        setFiguresFilter,
        page,
        setPage,
        limit,
        setLimit,
        totalFigures,
        totalPages,
        getFigure,
        loadingFigure,
        currentFigure,
        setCurrentFigure,
        figuresOptions
    }}>
        {children}
    </FiguresContext.Provider>


}


export const useFiguresContext = () => {

    const context = useContext(FiguresContext);

    if(!context){
        throw new Error("useFiguresContext must be used within a FiguresProvider");
    }

    return context;
}