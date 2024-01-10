import { createContext, useEffect, useState } from "react";

export const ErrorContext = createContext({});

export default function ErrorContextProvider({children}) {

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