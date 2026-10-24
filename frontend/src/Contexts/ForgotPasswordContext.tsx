
import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface ForgotPasswordContextType {
  forgotPassword: (email: string) => Promise<boolean>;
  loadingForgotPassword: boolean;

  resetPassword: (
    token: string,
    password1: string,
    password2: string
  ) => Promise<boolean>;

  loadingResetPassword: boolean;
  errorMsg: string | null;
}

const ForgotPasswordContext =
  createContext<ForgotPasswordContextType | null>(null);

const API_URL = import.meta.env.VITE_API_URL;

export const ForgotPasswordProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [loadingForgotPassword, setLoadingForgotPassword] =
    useState(false);

  const [loadingResetPassword, setLoadingResetPassword] =
    useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const forgotPassword = async (
    email: string
  ): Promise<boolean> => {
    setLoadingForgotPassword(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `${API_URL}/api/v1/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(
          data.message || "Unable to send the password reset email."
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Forgot password error:", error);

      setErrorMsg(
        "Unable to connect to the server. Please try again later."
      );

      return false;
    } finally {
      setLoadingForgotPassword(false);
    }
  };

  const resetPassword = async (
    token: string,
    password1: string,
    password2: string
  ): Promise<boolean> => {
    setLoadingResetPassword(true);
    setErrorMsg(null);

    try {
      const res = await fetch(
        `${API_URL}/api/v1/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
            password1,
            password2,
          }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setErrorMsg(
          data.message || "Unable to reset your password."
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Reset password error:", error);

      setErrorMsg(
        "Unable to connect to the server. Please try again later."
      );

      return false;
    } finally {
      setLoadingResetPassword(false);
    }
  };

  return (
    <ForgotPasswordContext.Provider
      value={{
        forgotPassword,
        loadingForgotPassword,
        resetPassword,
        loadingResetPassword,
        errorMsg,
      }}
    >
      {children}
    </ForgotPasswordContext.Provider>
  );
};

export const useForgotPasswordContext = () => {
  const context = useContext(ForgotPasswordContext);

  if (!context) {
    throw new Error(
      "useForgotPasswordContext must be used inside a ForgotPasswordProvider."
    );
  }

  return context;
};
