
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

import type { Frame } from "../Types/LearnTypes";

interface FrameContextType {
    frames: Frame[];
    setFrames: (frames: Frame[]) => void;

    getAllFrames: () => Promise<void>;
    loadingAllFrames: boolean;

    getFrame: (id: string) => Promise<void>;
    loadingFrame: boolean;

    page: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;

    limit: number;
    setLimit: React.Dispatch<React.SetStateAction<number>>;

    totalFrames: number;
    totalPages: number;

    search: string;
    setSearch: (search: string) => void;

    currentFrame: Frame | null;
    setCurrentFrame: (frame: Frame | null) => void;

    errorMsg: string;
}

const FrameContext = createContext<FrameContextType | null>(null);

const API_URL = `${import.meta.env.VITE_API_URL}/api/v1/frames`;

export const FrameProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [frames, setFrames] = useState<Frame[]>([]);

    const [loadingAllFrames, setLoadingAllFrames] =
        useState<boolean>(false);

    const [loadingFrame, setLoadingFrame] = useState<boolean>(false);

    const [page, setPage] = useState<number>(1);
    const [limit, setLimit] = useState<number>(10);

    const [totalFrames, setTotalFrames] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    const [search, setSearch] = useState<string>("");

    const [currentFrame, setCurrentFrame] = useState<Frame | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>("");

    // GET /api/v1/frames?page=1&limit=10&search=...
    const getAllFrames = useCallback(async (): Promise<void> => {
        setLoadingAllFrames(true);
        setErrorMsg("");

        try {
            const params = new URLSearchParams();

            params.append("page", page.toString());
            params.append("limit", limit.toString());

            if (search.trim()) {
                params.append("search", search.trim());
            }

            const res = await fetch(`${API_URL}?${params.toString()}`, {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in fetching frames"
                );
            }

            setFrames(data.data ?? []);
            setTotalFrames(data.pagination?.total ?? 0);
            setTotalPages(data.pagination?.totalPages ?? 0);
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in fetching frames"
            );
        } finally {
            setLoadingAllFrames(false);
        }
    }, [page, limit, search]);

    // GET /api/v1/frames/:id
    const getFrame = useCallback(async (id: string): Promise<void> => {
        setLoadingFrame(true);
        setErrorMsg("");

        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: "GET",
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(
                    data.error || data.message || "Error in fetching frame"
                );
            }

            setCurrentFrame(data.data);
        } catch (err) {
            console.error(err);

            setErrorMsg(
                err instanceof Error
                    ? err.message
                    : "Error in fetching frame"
            );
        } finally {
            setLoadingFrame(false);
        }
    }, []);

    useEffect(() => {
        void getAllFrames();
    }, [getAllFrames]);

    return (
        <FrameContext.Provider
            value={{
                frames,
                setFrames,
                getAllFrames,
                loadingAllFrames,
                getFrame,
                loadingFrame,
                page,
                setPage,
                limit,
                setLimit,
                totalFrames,
                totalPages,
                search,
                setSearch,
                currentFrame,
                setCurrentFrame,
                errorMsg,
            }}
        >
            {children}
        </FrameContext.Provider>
    );
};

export const useFrameContext = () => {
    const context = useContext(FrameContext);

    if (!context) {
        throw new Error(
            "useFrameContext must be used within a FrameProvider"
        );
    }

    return context;
};
