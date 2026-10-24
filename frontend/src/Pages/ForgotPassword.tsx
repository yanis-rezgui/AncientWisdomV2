import { memo, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, MailCheck } from "lucide-react";

import { useForgotPasswordContext } from "../Contexts/ForgotPasswordContext";
 
import {
    AuthCard,
    FormMessage,
    TextField,
    linkButtonClass,
    submitClass,
} from '../Components/AuthComponents/AuthUI';

// Route où l'utilisateur peut se connecter : adapte-la si besoin.
const SIGN_IN_PATH = "/user";

const ForgotPassword = () => {
    const { forgotPassword, loadingForgotPassword, errorMsg } =
        useForgotPasswordContext();

    // Email auquel le lien a été envoyé (null = formulaire affiché).
    const [sentTo, setSentTo] = useState<string | null>(null);

    // Évite d'afficher une ancienne erreur du context (ex : page reset-password).
    const [attempted, setAttempted] = useState(false);

    const successRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    // Page de service : titre dédié et pas d'indexation.
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Forgot Password | Ancient Wisdom";

        const meta = document.createElement("meta");
        meta.name = "robots";
        meta.content = "noindex, nofollow";
        document.head.appendChild(meta);

        return () => {
            document.title = previousTitle;
            meta.remove();
        };
    }, []);

    // Déplace le focus sur la confirmation pour les lecteurs d'écran.
    useEffect(() => {
        if (sentTo) successRef.current?.focus();
    }, [sentTo]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loadingForgotPassword) return;

        const formData = new FormData(e.currentTarget);
        const email = (formData.get("email") as string)?.trim();

        if (!email) return;

        setAttempted(true);

        const success = await forgotPassword(email);

        if (success) {
            setSentTo(email);
            setAttempted(false);
        }
    };

    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.25, ease: "easeOut" as const };

    return (
        <main className="flex min-h-screen w-full items-center justify-center bg-[#E8E2D6] px-4 py-12">
            <div className="w-full max-w-md rounded-lg border border-[#8C6A43]/20 bg-[#F8F5EF] p-6 sm:p-8">
                <AnimatePresence mode="wait" initial={false}>
                    {sentTo ? (
                        <motion.div
                            key="sent"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                        >
                            <AuthCard title="Check your inbox">
                                <div
                                    ref={successRef}
                                    tabIndex={-1}
                                    role="status"
                                    className="mt-6 flex flex-col gap-4 outline-none"
                                >
                                    <span
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8C6A43]/15 text-[#3E3025]"
                                        aria-hidden="true"
                                    >
                                        <MailCheck size={24} />
                                    </span>

                                    <p className="text-[15px] leading-relaxed text-gray-700">
                                        If an account exists for{" "}
                                        <strong className="break-all font-semibold text-[#3E3025]">
                                            {sentTo}
                                        </strong>
                                        , we sent a link to reset your password.
                                        The link expires in 15 minutes.
                                    </p>

                                    <p className="text-[14px] leading-relaxed text-gray-600">
                                        Nothing in your inbox? Check your spam
                                        folder, or try a different email address.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={() => setSentTo(null)}
                                        className={`${linkButtonClass} self-start text-[15px]`}
                                    >
                                        Use a different email
                                    </button>

                                    <Link
                                        to={SIGN_IN_PATH}
                                        className={`${submitClass} block text-center`}
                                    >
                                        Back to sign in
                                    </Link>
                                </div>
                            </AuthCard>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                        >
                            <AuthCard title="Forgot your password?">
                                <p className="mt-4 text-[15px] leading-relaxed text-gray-700">
                                    Enter the email linked to your account and we
                                    will send you a link to choose a new password.
                                </p>

                                <form
                                    onSubmit={submitForm}
                                    className="mt-6 flex flex-col gap-4"
                                    noValidate={false}
                                >
                                    <TextField
                                        id="forgot-email"
                                        name="email"
                                        type="email"
                                        label="Email"
                                        placeholder="marcusaurelius@gmail.com"
                                        autoComplete="email"
                                    />

                                    <FormMessage
                                        msg={attempted ? errorMsg : null}
                                    />

                                    <button
                                        type="submit"
                                        disabled={loadingForgotPassword}
                                        className={submitClass}
                                    >
                                        {loadingForgotPassword
                                            ? "Sending..."
                                            : "Send reset link"}
                                    </button>

                                    <Link
                                        to={SIGN_IN_PATH}
                                        className="flex items-center justify-center gap-1.5 text-[15px] font-semibold text-[#3E3025] transition-opacity duration-200 hover:opacity-70 active:opacity-60"
                                    >
                                        <ArrowLeft size={16} aria-hidden="true" />
                                        Back to sign in
                                    </Link>
                                </form>
                            </AuthCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default memo(ForgotPassword);