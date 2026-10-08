import { createContext, useContext, useState } from "react";

import { useAuthContext } from "../Contexts/AuthContext";


import type { HistoricalEvent } from "../Types/Types";
import { useEventContext } from "../Contexts/EventContext";


// ============================================================
// EVENT FORM DATA
// ============================================================

export interface EventFormData {

    name: string;

    startDate: string;

    endDate: string;

    location: string;

    era: string;

    description: string;

    sections: {
        title: string;
        content: string;
    }[];

    tags: string[];

}


// ============================================================
// CONTEXT TYPE
// ============================================================

interface EventsAdminContextType {

    addEvent: (
        dataForm: EventFormData
    ) => Promise<boolean>;

    loadingAddEvent: boolean;


    updateEvent: (
        id: string,
        dataForm: Partial<EventFormData>
    ) => Promise<boolean>;

    loadingUpdateEvent: boolean;


    deleteEvent: (
        id: string
    ) => Promise<boolean>;

    loadingDeleteEvent: boolean;


    showDeletePop: boolean;

    setShowDeletePop: (
        b: boolean
    ) => void;


    eventDelete: HistoricalEvent | null;

    setEventDelete: (
        event: HistoricalEvent | null
    ) => void;


    errorMsg: string;

    setErrorMsg: (
        msg: string
    ) => void;

}


// ============================================================
// CONTEXT
// ============================================================

const EventsAdminContext =
    createContext<EventsAdminContextType | null>(null);


// ============================================================
// PROVIDER
// ============================================================

export const EventsAdminProvider = ({
    children
}: {
    children: React.ReactNode
}) => {


    // ========================================================
    // LOADING STATES
    // ========================================================

    const [
        loadingAddEvent,
        setLoadingAddEvent
    ] = useState<boolean>(false);


    const [
        loadingUpdateEvent,
        setLoadingUpdateEvent
    ] = useState<boolean>(false);


    const [
        loadingDeleteEvent,
        setLoadingDeleteEvent
    ] = useState<boolean>(false);


    // ========================================================
    // DELETE POPUP
    // ========================================================

    const [
        showDeletePop,
        setShowDeletePop
    ] = useState<boolean>(false);


    const [
        eventDelete,
        setEventDelete
    ] = useState<HistoricalEvent | null>(null);


    // ========================================================
    // ERROR
    // ========================================================

    const [
        errorMsg,
        setErrorMsg
    ] = useState<string>("");


    // ========================================================
    // CONTEXTS
    // ========================================================

    const { token } =
        useAuthContext();


    const { getAllEvents } =
        useEventContext();



    // ========================================================
    // ADD EVENT
    // ========================================================

    const addEvent = async (
        dataForm: EventFormData
    ): Promise<boolean> => {

        try {

            setLoadingAddEvent(true);

            setErrorMsg("");


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/event/`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify(dataForm)
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in adding event"
                );

            }


            // Refresh events

            await getAllEvents();


            return true;


        } catch (err) {

            console.error(err);


            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in adding event"
            );


            return false;


        } finally {

            setLoadingAddEvent(false);

        }

    };



    // ========================================================
    // UPDATE EVENT
    // ========================================================

    const updateEvent = async (
        id: string,
        dataForm: Partial<EventFormData>
    ): Promise<boolean> => {

        try {

            setLoadingUpdateEvent(true);

            setErrorMsg("");


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/event/${id}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify(dataForm)
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in updating event"
                );

            }


            // Refresh events

            await getAllEvents();


            return true;


        } catch (err) {

            console.error(err);


            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in updating event"
            );


            return false;


        } finally {

            setLoadingUpdateEvent(false);

        }

    };



    // ========================================================
    // DELETE EVENT
    // ========================================================

    const deleteEvent = async (
        id: string
    ): Promise<boolean> => {

        try {

            setLoadingDeleteEvent(true);

            setErrorMsg("");


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/event/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in deleting event"
                );

            }


            // Refresh events

            await getAllEvents();


            return true;


        } catch (err) {

            console.error(err);


            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in deleting event"
            );


            return false;


        } finally {

            setLoadingDeleteEvent(false);

        }

    };



    // ========================================================
    // PROVIDER
    // ========================================================

    return (

        <EventsAdminContext.Provider
            value={{

                addEvent,

                loadingAddEvent,


                updateEvent,

                loadingUpdateEvent,


                deleteEvent,

                loadingDeleteEvent,


                showDeletePop,

                setShowDeletePop,


                eventDelete,

                setEventDelete,


                errorMsg,

                setErrorMsg

            }}
        >

            {children}

        </EventsAdminContext.Provider>

    );

};


// ============================================================
// HOOK
// ============================================================

export const useEventsAdminContext = () => {

    const context =
        useContext(EventsAdminContext);


    if (!context) {

        throw new Error(
            "Please use the useEventsAdminContext inside the EventsAdminProvider"
        );

    }


    return context;

};
