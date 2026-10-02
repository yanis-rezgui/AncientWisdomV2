import { createContext, useContext, useEffect, useState } from "react";
import type { Quote, QuoteFilterType } from "../Types/Types";



interface QuotesContextType{

    quotes : Quote[];
    setQuotes: (quotes : Quote[])=>void;
    getAllQuotes : ()=>Promise<void>;
    loadingAllQuotes : boolean;

    quotesFilter : QuoteFilterType;
    setQuotesFilter : (filter : QuoteFilterType)=>void;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    totalQuotes: number;
    totalPages: number;

    getQuote : (id : string)=>Promise<void>;
    loadingQuote : boolean;

    currentQuote : Quote | null;
    setCurrentQuote : (q : Quote | null)=>void;
}

const QuotesContext = createContext<QuotesContextType | null>(null);

export const QuotesProvider = ({children} : {children : React.ReactNode}) => {

    const [quotes, setQuotes] = useState<Quote[]>([]);
    const [loadingAllQuotes, setLoadingAllQuotes] = useState<boolean>(false);
    const [loadingQuote, setLoadingQuote] = useState<boolean>(false);

    const [quotesFilter, setQuotesFilter] = useState<QuoteFilterType>(()=>{

        const saved = localStorage.getItem("quotesFilter");

        return saved ? JSON.parse(saved) : {
        search : "",
        era : "",
        author : ""
    }
    });

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalQuotes, setTotalQuotes] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);

    const getAllQuotes = async() => {

        try{

            setLoadingAllQuotes(true);

            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if(quotesFilter.search){
                params.append("search", quotesFilter.search);
            }

            if(quotesFilter.era){
                params.append("era", quotesFilter.era);
            }

            if(quotesFilter.author){
                params.append("author", quotesFilter.author);
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quotes?${params.toString()}`,{
                method : "GET",
                headers : {
                    "Content-Type" : "application/json"
                }
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message || data.error || "Error in fetching quotes");
            }

            setQuotes(data.data);
            console.log("Quotes : ", data.data);
            setTotalQuotes(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingAllQuotes(false);
        }
    }



    const getQuote = async(id : string) => {

        try{

            setLoadingQuote(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/quotes/${id}`, {
                method : "GET",
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.message || data.error || "Error in fetching Quote");
            }

            setCurrentQuote(data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingQuote(false);
        }
    }

    useEffect(()=>{
        getAllQuotes();
    }, [page, limit, quotesFilter]);

    useEffect(()=>{
        localStorage.setItem("quotesFilter", JSON.stringify(quotesFilter));
    }, [quotesFilter]);


    return <QuotesContext.Provider value={{
        quotes,
        loadingAllQuotes,
        quotesFilter,
        setQuotesFilter,
        page,
        setPage,
        limit,
        setLimit,
        totalQuotes,
        totalPages,
        getAllQuotes,
        loadingQuote,
        getQuote,
        currentQuote,
        setCurrentQuote,
        setQuotes
    }}>
        {children}
    </QuotesContext.Provider>
}


export const useQuotesContext = () => {

    const context = useContext(QuotesContext);

    if(!context){
        throw new Error("useQuotesContext must be used within a QuotesProvider");
    }

    return context;
}