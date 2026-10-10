import { createContext, useContext, useState } from "react";

import { useAuthContext } from "../Contexts/AuthContext";
import { useFrameContext } from "../Contexts/FrameContext";

import type { Frame } from "../Types/LearnTypes";

interface FramesAdminContextType {
    addFrame: (formData: FormData) => Promise<boolean>;
    loadingAddFrame: boolean;

    updateFrame: (id: string, formData: FormData) => Promise<boolean>;
    loadingUpdateFrame: boolean;

    deleteFrame: (id: string) => Promise<boolean>;
    loadingDeleteFrame: boolean;

    showDeletePop: boolean;
    setShowDeletePop: (show: boolean) => void;

    frameDelete: Frame | null;
    setFrameDelete: (frame: Frame | null) => void;

    errorMsg: string;
    setErrorMsg: (msg: string) => void;
}

const FramesAdminContext =
    createContext<FramesAdminContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/frames`;

export const FramesAdminProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [loadingAddFrame, setLoadingAddFrame] =
        useState<boolean>(false);

    const [loadingUpdateFrame, setLoadingUpdateFrame] =
        useState<boolean>(false);

    const [loadingDeleteFrame, setLoadingDeleteFrame] =
        useState<boolean>(false);

    const [showDeletePop, setShowDeletePop] =
        useState<boolean>(false);

    const [frameDelete, setFrameDelete] = useState<Frame | null>(null);

    const [errorMsg, setErrorMsg] = useState<string>("");

    const { token } = useAuthContext();
    const { getAllFrames } = useFrameContext();

    // POST /api/v1/frames
    const addFrame = async (formData: FormData): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to add a frame.");
            return false;
        }

        try {
            setLoadingAddFrame(true);
            setErrorMsg("");

            const res = await fetch(`${API_URL}/`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in adding frame"
                );
            }

            await getAllFrames();

            return true;
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in adding frame"
            );

            return false;
        } finally {
            setLoadingAddFrame(false);
        }
    };

    // PUT /api/v1/frames/:id
    const updateFrame = async (
        id: string,
        formData: FormData
    ): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to update a frame.");
            return false;
        }

        try {
            setLoadingUpdateFrame(true);
            setErrorMsg("");

            const res = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in updating frame"
                );
            }

            await getAllFrames();

            return true;
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in updating frame"
            );

            return false;
        } finally {
            setLoadingUpdateFrame(false);
        }
    };

    // DELETE /api/v1/frames/:id
    const deleteFrame = async (id: string): Promise<boolean> => {
        if (!token) {
            setErrorMsg("You must be logged in to delete a frame.");
            return false;
        }

        try {
            setLoadingDeleteFrame(true);
            setErrorMsg("");

            const res = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in deleting frame"
                );
            }

            setShowDeletePop(false);
            setFrameDelete(null);

            await getAllFrames();

            return true;
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in deleting frame"
            );

            return false;
        } finally {
            setLoadingDeleteFrame(false);
        }
    };

    return (
        <FramesAdminContext.Provider
            value={{
                addFrame,
                loadingAddFrame,
                updateFrame,
                loadingUpdateFrame,
                deleteFrame,
                loadingDeleteFrame,
                showDeletePop,
                setShowDeletePop,
                frameDelete,
                setFrameDelete,
                errorMsg,
                setErrorMsg,
            }}
        >
            {children}
        </FramesAdminContext.Provider>
    );
};

export const useFramesAdminContext = () => {
    const context = useContext(FramesAdminContext);

    if (!context) {
        throw new Error(
            "Please use useFramesAdminContext inside a FramesAdminProvider"
        );
    }

    return context;
};
