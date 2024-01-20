import { createContext, useEffect, useState } from "react";

type ErrorContextType = {
  errorMessage: string;
  setErrorMessage: (value: string) => void;
  showError: boolean;
  setShowError: (value: boolean) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

type ErrorContextProviderProps = {
  children: React.ReactNode;
}

export default function ErrorContextProvider({children}: ErrorContextProviderProps) {

  const [errorMessage, setErrorMessage] = useState("Error");
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowError(false);
    }, 5000)
    return () => clearTimeout(timeout);
  }, [showError])

  return (
    <ErrorContext.Provider value={{errorMessage, setErrorMessage, showError, setShowError}}>
      {children}
    </ErrorContext.Provider>
  )
}