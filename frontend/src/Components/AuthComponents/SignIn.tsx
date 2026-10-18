import { memo } from "react";
import { useAuthContext } from "../../Contexts/AuthContext";
import {
    AuthCard,
    FormMessage,
    PasswordField,
    TextField,
    linkButtonClass,
    submitClass,
} from "./AuthUI";

const SignIn = () => {
    const { signIn, loadingSignIn, setShowSignIn, msg } = useAuthContext();

    const submitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const email = (formData.get("email") as string)?.trim();
        const password = formData.get("password") as string;

        if (!email || !password) return;

        await signIn(email, password);
    };

    return (
        <AuthCard title="Sign in">
            <form onSubmit={submitForm} className="mt-6 flex flex-col gap-4">
                <TextField
                    id="signin-email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="marcusaurelius@gmail.com"
                    autoComplete="email"
                />

                <PasswordField
                    id="signin-password"
                    name="password"
                    label="Password"
                    placeholder="Enter your password"
                    autoComplete="current-password"
                />

                <FormMessage msg={msg} />

                <button type="submit" disabled={loadingSignIn} className={submitClass}>
                    {loadingSignIn ? "Signing in..." : "Sign in"}
                </button>

                <p className="text-center text-[15px] text-gray-700">
                    Don't have an account?{" "}
                    <button
                        type="button"
                        onClick={() => setShowSignIn(false)}
                        className={linkButtonClass}
                    >
                        Create account
                    </button>
                </p>
            </form>
        </AuthCard>
    );
};

export default memo(SignIn);