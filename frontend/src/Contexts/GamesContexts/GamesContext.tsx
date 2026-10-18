import { createContext, useContext, useEffect, useState } from "react";
import type { Game } from "../../Types/Games";


interface GamesContextType{
    games: Game[];
    getGames : ()=>Promise<void>;
    loadingGames : boolean;

    getGame : (id : string)=>Promise<void>;
    loadingGame : boolean;
    currentGame : Game | null;
}

const GamesContext = createContext<GamesContextType | null>(null);

export const GamesProvider = ({children} : {children : React.ReactNode}) => {

    const [games, setGames] = useState<Game[]>([]);
    const [loadingGames, setLoadingGames] = useState<boolean>(false);

    const [currentGame, setCurrentGame] = useState<Game | null>(null);
    const [loadingGame, setLoadingGame] = useState<boolean>(false);

    const getGames = async() => {
        setLoadingGames(true)
        try{
            
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/games/`,{
                method : "GET",
            })

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting games")
            }

            setGames(data.data);
             console.log("Games : ", data.data);
        }catch(err){
            console.error(err);
        }finally{
            setLoadingGames(false);
        }
    }

    const getGame = async(id : string) => {
        setLoadingGame(true);
        try{

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/games/${id}`,{
                method : "GET"
            });

            const data = await res.json();

            if(!res.ok){
                throw new Error(data.error || data.message || "Error in getting game")
            }

            setCurrentGame(data.data);
           
        }catch(err){
            console.error(err);
        }finally{
            setLoadingGame(false);
        }
    }

    useEffect(()=>{
       getGames();
    }, []);

    return <GamesContext.Provider value={{
        games,
        currentGame,
        loadingGame,
        loadingGames,
        getGame,
        getGames
    }}>
        {children}
    </GamesContext.Provider>
}


export const useGamesContext = () => {

    const context = useContext(GamesContext);

    if(!context){
        throw new Error("Please use the useGamesContext inside the GamesProvider");
    }

    return context;
}