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

const SignUp = () => {
    const { signUp, loadingSignUp, setShowSignIn, msg } = useAuthContext();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        await signUp(
            (formData.get("firstName") as string)?.trim(),
            (formData.get("lastName") as string)?.trim(),
            (formData.get("email") as string)?.trim(),
            formData.get("password1") as string,
            formData.get("password2") as string
        );
    };

    return (
        <AuthCard title="Create an account">
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2">
                    <TextField
                        id="signup-firstName"
                        name="firstName"
                        label="First name"
                        placeholder="Julius"
                        autoComplete="given-name"
                    />
                    <TextField
                        id="signup-lastName"
                        name="lastName"
                        label="Last name"
                        placeholder="Caesar"
                        autoComplete="family-name"
                    />
                </div>

                <TextField
                    id="signup-email"
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="juliuscaesar@gmail.com"
                    autoComplete="email"
                />

                <PasswordField
                    id="signup-password1"
                    name="password1"
                    label="Password"
                    placeholder="8+ characters, uppercase, number & special"
                    autoComplete="new-password"
                />

                <PasswordField
                    id="signup-password2"
                    name="password2"
                    label="Confirm password"
                    placeholder="Repeat your password"
                    autoComplete="new-password"
                />

                <FormMessage msg={msg} />

                <button type="submit" disabled={loadingSignUp} className={submitClass}>
                    {loadingSignUp ? "Signing up..." : "Sign up"}
                </button>

                <p className="text-center text-[15px] text-gray-700">
                    Already have an account?{" "}
                    <button
                        type="button"
                        onClick={() => setShowSignIn(true)}
                        className={linkButtonClass}
                    >
                        Sign in
                    </button>
                </p>
            </form>
        </AuthCard>
    );
};

export default memo(SignUp);