import { createContext, useContext, useState } from "react";

import { useAuthContext } from "../Contexts/AuthContext";
import { useFiguresContext } from "../Contexts/FiguresContext";

import type { HistoricalFigure } from "../Types/Types";


interface FiguresAdminContextType {

    addFigure: (
        formData: FormData
    ) => Promise<boolean>;

    loadingAddFigure: boolean;


    updateFigure: (
        id: string,
        formData: FormData
    ) => Promise<boolean>;

    loadingUpdateFigure: boolean;


    deleteFigure: (
        id: string
    ) => Promise<boolean>;

    loadingDeleteFigure: boolean;


    showDeletePop: boolean;

    setShowDeletePop: (
        b: boolean
    ) => void;


    figureDelete: HistoricalFigure | null;

    setFigureDelete: (
        figure: HistoricalFigure | null
    ) => void;


    errorMsg: string;

    setErrorMsg: (
        msg: string
    ) => void;

}


const FiguresAdminContext =
    createContext<FiguresAdminContextType | null>(null);



export const FiguresAdminProvider = ({
    children
}: {
    children: React.ReactNode
}) => {


    const [
        loadingAddFigure,
        setLoadingAddFigure
    ] = useState<boolean>(false);


    const [
        loadingUpdateFigure,
        setLoadingUpdateFigure
    ] = useState<boolean>(false);


    const [
        loadingDeleteFigure,
        setLoadingDeleteFigure
    ] = useState<boolean>(false);


    const [
        showDeletePop,
        setShowDeletePop
    ] = useState<boolean>(false);


    const [
        figureDelete,
        setFigureDelete
    ] = useState<HistoricalFigure | null>(null);


    const [
        errorMsg,
        setErrorMsg
    ] = useState<string>("");


    const { token } =
        useAuthContext();


    const { getAllFigures } =
        useFiguresContext();



    // ========================================================
    // ADD FIGURE
    // ========================================================

    const addFigure = async (
        formData: FormData
    ): Promise<boolean> => {

        try {

            setLoadingAddFigure(true);

            setErrorMsg("");


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/figure/`,
                {
                    method: "POST",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in adding figure"
                );

            }


            await getAllFigures();


            return true;


        } catch (err) {

            console.error(err);


            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in adding figure"
            );


            return false;


        } finally {

            setLoadingAddFigure(false);

        }

    };



    // ========================================================
    // UPDATE FIGURE
    // ========================================================

    const updateFigure = async (
        id: string,
        formData: FormData
    ): Promise<boolean> => {

        try {

            setLoadingUpdateFigure(true);

            setErrorMsg("");


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/figure/${id}`,
                {
                    method: "PUT",

                    headers: {
                        Authorization: `Bearer ${token}`
                    },

                    body: formData
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in updating figure"
                );

            }


            await getAllFigures();


            return true;


        } catch (err) {

            console.error(err);


            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in updating figure"
            );


            return false;


        } finally {

            setLoadingUpdateFigure(false);

        }

    };



    // ========================================================
    // DELETE FIGURE
    // ========================================================

    const deleteFigure = async (
        id: string
    ): Promise<boolean> => {

        try {

            setLoadingDeleteFigure(true);

            setErrorMsg("");


            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/api/v1/figure/${id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );


            const data = await res.json();


            if (!res.ok) {

                throw new Error(
                    data.error ||
                    data.message ||
                    "Error in deleting figure"
                );

            }


            await getAllFigures();


            return true;


        } catch (err) {

            console.error(err);


            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in deleting figure"
            );


            return false;


        } finally {

            setLoadingDeleteFigure(false);

        }

    };



    // ========================================================
    // PROVIDER
    // ========================================================

    return (
        <FiguresAdminContext.Provider
            value={{

                addFigure,

                loadingAddFigure,


                updateFigure,

                loadingUpdateFigure,


                deleteFigure,

                loadingDeleteFigure,


                showDeletePop,

                setShowDeletePop,


                figureDelete,

                setFigureDelete,


                errorMsg,

                setErrorMsg

            }}
        >

            {children}

        </FiguresAdminContext.Provider>
    );

};



export const useFiguresAdminContext = () => {

    const context =
        useContext(FiguresAdminContext);


    if (!context) {

        throw new Error(
            "Please use the useFiguresAdminContext inside the FiguresAdminProvider"
        );

    }


    return context;

};

