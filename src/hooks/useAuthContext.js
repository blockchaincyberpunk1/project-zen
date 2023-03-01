import { AuthContext } from "../context/AuthContext";
import { useContext } from "react";

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within an AuthContextProvider");
  }

  return context;
};

/* 
The hook returns the authentication context retrieved using useContext. 
If the context is undefined, an error is thrown to ensure that the useAuthContext 
hook is used within an AuthContextProvider. 
*/ 
