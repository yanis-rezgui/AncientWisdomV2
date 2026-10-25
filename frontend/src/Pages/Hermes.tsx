import { memo, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import { useAuthContext } from "../Contexts/AuthContext"; // adapte les chemins
import { ConversationProvider } from "../Contexts/ConversationContext";
import { HermesProvider, useHermesContext } from "../Contexts/HermesContext";

import HermesSidebar from "../Components/Hermes/HermesSidebar";
import ChatWindow from "../Components/Hermes/ChatWindow";
import DeleteConversationPop from "../Components/Hermes/DeleteConversationPop";
import HermesAuthGate from "../Components/Hermes/HermesAuthGate";

// Hauteur de ta navbar : ajuste cette valeur
const NAV_OFFSET = "80px";

const HermesChat = () => {
    const navigate = useNavigate();
    const { conversationId: paramId } = useParams<{ conversationId?: string }>();
    const { conversationId, loadConversation, newChat } = useHermesContext();

    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    const activeIdRef = useRef<string | null>(conversationId);

    useEffect(() => {
        activeIdRef.current = conversationId;
    }, [conversationId]);

    // URL -> chat : ouverture d'une conversation, bouton retour du navigateur
    useEffect(() => {
        if (paramId) {
            void loadConversation(paramId);
        } else if (activeIdRef.current) {
            newChat();
        }
    }, [paramId, loadConversation, newChat]);

    // Chat -> URL : la première réponse crée la conversation côté serveur
    useEffect(() => {
        if (conversationId && conversationId !== paramId) {
            navigate(`/hermes/${conversationId}`, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId]);

    // Fermer le tiroir mobile avec Echap
    useEffect(() => {
        if (!sidebarOpen) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setSidebarOpen(false);
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [sidebarOpen]);

    const handleNewChat = useCallback(() => {
        newChat();
        setSidebarOpen(false);
        navigate("/hermes");
    }, [newChat, navigate]);

    const handleSelect = useCallback(
        (id: string) => {
            setSidebarOpen(false);
            navigate(`/hermes/${id}`);
        },
        [navigate]
    );

    return (
        <section
            aria-label="Hermes AI assistant"
            style={{ height: `calc(100dvh - ${NAV_OFFSET})` }}
            className="relative flex w-full overflow-hidden bg-[#E8E2D6]"
        >
            {/* Sidebar desktop */}
            <aside className="hidden w-[300px] shrink-0 border-r border-gray-400 bg-[#F5E6C8] min-lg:flex">
                <HermesSidebar onSelect={handleSelect} onNewChat={handleNewChat} />
            </aside>

            {/* Tiroir mobile */}
            <AnimatePresence>
                {sidebarOpen && (
                    <>
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            onClick={() => setSidebarOpen(false)}
                            aria-hidden="true"
                            className="absolute inset-0 z-30 bg-black/40 min-lg:hidden"
                        />
                        <motion.aside
                            key="drawer"
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 z-40 flex w-[85%] max-w-[320px] border-r border-gray-400
                            bg-[#F5E6C8] shadow-xl min-lg:hidden"
                        >
                            <HermesSidebar
                                onSelect={handleSelect}
                                onNewChat={handleNewChat}
                                onClose={() => setSidebarOpen(false)}
                            />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <ChatWindow onOpenSidebar={() => setSidebarOpen(true)} />

            <DeleteConversationPop />
        </section>
    );
};

const Hermes = () => {
    const { token } = useAuthContext();

    // Même garde que Profile.tsx : remplace HermesAuthGate par ton SignIn / SignUp si tu préfères
    if (!token) return <HermesAuthGate />;

    return (
        <ConversationProvider>
            <HermesProvider>
                <HermesChat />
            </HermesProvider>
        </ConversationProvider>
    );
};

export default memo(Hermes);