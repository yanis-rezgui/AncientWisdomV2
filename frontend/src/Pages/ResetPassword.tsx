import { memo, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CircleCheck, LinkIcon } from "lucide-react";

import { useForgotPasswordContext } from "../Contexts/ForgotPasswordContext";

import {
    AuthCard,
    FormMessage,
    PasswordField,
    submitClass,
} from '../Components/AuthComponents/AuthUI';

// Route où l'utilisateur peut se connecter : adapte-la si besoin.
const SIGN_IN_PATH = "/user";
const FORGOT_PASSWORD_PATH = "/forgot-password";

// Même règle que le backend (resetPassword.controller.js).
const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const PASSWORD_RULES =
    "At least 8 characters, with one uppercase letter, one lowercase letter, " +
    "one number and one special character (@$!%*?&).";

const ResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const { resetPassword, loadingResetPassword, errorMsg } =
        useForgotPasswordContext();

    const [done, setDone] = useState(false);
    const [attempted, setAttempted] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const successRef = useRef<HTMLDivElement>(null);
    const reduceMotion = useReducedMotion();

    // Page de service : pas d'indexation, et le token ne doit pas fuiter
    // dans l'en-tête Referer vers un site externe.
    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Reset Password | Ancient Wisdom";

        const robots = document.createElement("meta");
        robots.name = "robots";
        robots.content = "noindex, nofollow";

        const referrer = document.createElement("meta");
        referrer.name = "referrer";
        referrer.content = "no-referrer";

        document.head.append(robots, referrer);

        return () => {
            document.title = previousTitle;
            robots.remove();
            referrer.remove();
        };
    }, []);

    useEffect(() => {
        if (done) successRef.current?.focus();
    }, [done]);

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (loadingResetPassword || !token) return;

        const formData = new FormData(e.currentTarget);
        const password1 = formData.get("password1") as string;
        const password2 = formData.get("password2") as string;

        if (!password1 || !password2) return;

        if (password1 !== password2) {
            setLocalError("Passwords do not match.");
            return;
        }

        if (!PASSWORD_REGEX.test(password1)) {
            setLocalError(PASSWORD_RULES);
            return;
        }

        setLocalError(null);
        setAttempted(true);

        const success = await resetPassword(token, password1, password2);

        if (success) {
            setDone(true);
            setAttempted(false);
        }
    };

    const transition = reduceMotion
        ? { duration: 0 }
        : { duration: 0.25, ease: "easeOut" as const };

    const message = localError ?? (attempted ? errorMsg : null);

    const iconClass =
        "flex h-12 w-12 items-center justify-center rounded-full bg-[#8C6A43]/15 text-[#3E3025]";

    return (
        <main className="flex min-h-[80vh] items-center justify-center bg-[#E8E2D6] px-4 py-12">
            <div className="w-full max-w-md rounded-lg border border-[#8C6A43]/20 bg-[#F8F5EF] p-6 sm:p-8">
                <AnimatePresence mode="wait" initial={false}>
                    {!token ? (
                        <motion.div
                            key="invalid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                        >
                            <AuthCard title="Invalid reset link">
                                <div className="mt-6 flex flex-col gap-4">
                                    <span className={iconClass} aria-hidden="true">
                                        <LinkIcon size={24} />
                                    </span>
                                    <p className="text-[15px] leading-relaxed text-gray-700">
                                        This link is incomplete. Request a new
                                        one to reset your password.
                                    </p>
                                    <Link
                                        to={FORGOT_PASSWORD_PATH}
                                        className={`${submitClass} block text-center`}
                                    >
                                        Request a new link
                                    </Link>
                                </div>
                            </AuthCard>
                        </motion.div>
                    ) : done ? (
                        <motion.div
                            key="done"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={transition}
                        >
                            <AuthCard title="Password updated">
                                <div
                                    ref={successRef}
                                    tabIndex={-1}
                                    role="status"
                                    className="mt-6 flex flex-col gap-4 outline-none"
                                >
                                    <span className={iconClass} aria-hidden="true">
                                        <CircleCheck size={24} />
                                    </span>
                                    <p className="text-[15px] leading-relaxed text-gray-700">
                                        Your password has been changed. You can
                                        now sign in with your new password.
                                    </p>
                                    <Link
                                        to={SIGN_IN_PATH}
                                        className={`${submitClass} block text-center`}
                                    >
                                        Go to sign in
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
                            <AuthCard title="Choose a new password">
                                <form
                                    onSubmit={submitForm}
                                    className="mt-6 flex flex-col gap-4"
                                >
                                    <PasswordField
                                        id="reset-password1"
                                        name="password1"
                                        label="New password"
                                        placeholder="Enter your new password"
                                        autoComplete="new-password"
                                    />

                                    <PasswordField
                                        id="reset-password2"
                                        name="password2"
                                        label="Confirm new password"
                                        placeholder="Repeat your new password"
                                        autoComplete="new-password"
                                    />

                                    <p className="text-[14px] leading-relaxed text-gray-600">
                                        {PASSWORD_RULES}
                                    </p>

                                    <FormMessage msg={message} />

                                    <button
                                        type="submit"
                                        disabled={loadingResetPassword}
                                        className={submitClass}
                                    >
                                        {loadingResetPassword
                                            ? "Saving..."
                                            : "Save new password"}
                                    </button>

                                    {attempted && errorMsg && (
                                        <p className="text-center text-[15px] text-gray-700">
                                            Link expired?{" "}
                                            <Link
                                                to={FORGOT_PASSWORD_PATH}
                                                className="font-semibold text-[#3E3025] underline transition-opacity duration-200 hover:opacity-70 active:opacity-60"
                                            >
                                                Request a new one
                                            </Link>
                                        </p>
                                    )}
                                </form>
                            </AuthCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </main>
    );
};

export default memo(ResetPassword);