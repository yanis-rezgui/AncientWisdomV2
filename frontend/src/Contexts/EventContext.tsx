import { createContext, useContext, useEffect, useState } from "react";
import type { HistoricalEvent, EventFilterType } from "../Types/Types";



interface EventContextType {
    events: HistoricalEvent[];
    setEvents: (events: HistoricalEvent[]) => void;
    getAllEvents: () => Promise<void>;
    loadingAllEvents: boolean;
    eventsFilter : EventFilterType;
    setEventsFilter : (filter : EventFilterType)=>void;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;
    totalEvents: number;
    totalPages: number;

    getEvent: (id: string) => Promise<void>;
    loadingEvent: boolean;

    currentEvent: HistoricalEvent | null;
    setCurrentEvent: (e: HistoricalEvent | null) => void;
}

const EventContext = createContext<EventContextType | null>(null);

export const EventProvider = ({children} : {children : React.ReactNode}) => {

    const [events, setEvents] = useState<HistoricalEvent[]>([]);
    const [loadingAllEvents, setLoadingAllEvents] = useState<boolean>(false);
    const [loadingEvent, setLoadingEvent] = useState<boolean>(false);

    const [eventsFilter, setEventsFilter] = useState<EventFilterType>(()=>{

        const saved = localStorage.getItem("eventsFilter");

        return saved ? JSON.parse(saved) : {
        search : "",
        era : ""
    }
    });

    useEffect(()=>{
        localStorage.setItem("eventsFilter", JSON.stringify(eventsFilter));
    }, [eventsFilter]);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);
    const [totalEvents, setTotalEvents] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [currentEvent, setCurrentEvent] = useState<HistoricalEvent | null>(null);

    
    const getAllEvents = async () => {

        try{
            setLoadingAllEvents(true);

            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if(eventsFilter.search){
                params.append("search", eventsFilter.search);
            }

            if(eventsFilter.era){
                params.append("era", eventsFilter.era);
            }

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/event?${params.toString()}`,{
                method : "GET",
            });

            const data = await res.json();

            if(!res.ok) {
                throw new Error(data.message || data.error || "Failed to fetch events");
            }

            setEvents(data.data);
            setTotalEvents(data.pagination.total);
            setTotalPages(data.pagination.totalPages);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoadingAllEvents(false);
        }
    }

    useEffect(() => {
        getAllEvents();
    }, [page, limit, eventsFilter]);

    const getEvent = async (id: string) => {

        try{
            setLoadingEvent(true);

            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/event/${id}`, {
                method : "GET"
            });

            const data = await res.json();

            if(!res.ok) {
                throw new Error(data.message || data.error || "Failed to fetch event");
            }

            setCurrentEvent(data.data);
        } catch (error) {
            console.error("Error fetching event:", error);
        } finally {
            setLoadingEvent(false);
        }
    }

    return (
        <EventContext.Provider value={{
            events,
            setEvents,
            getAllEvents,
            loadingAllEvents,
            eventsFilter,
            setEventsFilter,
            page,
            setPage,
            limit,
            setLimit,
            totalEvents,
            totalPages,
            getEvent,
            loadingEvent,
            currentEvent,
            setCurrentEvent
        }}>
            {children}
        </EventContext.Provider>
    );
}


export const useEventContext = () => {

    const context = useContext(EventContext);
    if(!context){
        throw new Error("useEventContext must be used within an EventProvider");
    }

    return context;
}