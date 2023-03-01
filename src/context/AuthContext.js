import { createContext, useReducer, useEffect } from "react";
import { projectAuth } from "../firebase/config";

// Create the AuthContext
export const AuthContext = createContext();

// Define the authReducer function
const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      // If the action type is "LOGIN", return a new state object with the 'user' property set to the action's payload.
      return { ...state, user: action.payload };
    case "LOGOUT":
      // If the action type is "LOGOUT", return a new state object with the 'user' property set to null.
      return { ...state, user: null };
    case "AUTH_IS_READY":
      // If the action type is "AUTH_IS_READY", return a new state object with the 'user' property set to the action's payload and the 'authIsReady' property set to true.
      return { user: action.payload, authIsReady: true };
    default:
      // If the action type is not recognized, return the current state.
      return state;
  }
};

// Define the AuthContextProvider component, which takes a prop called 'children'
export const AuthContextProvider = ({ children }) => {
  // Use useReducer to manage the state of the AuthContext
  const [{ user, authIsReady }, dispatch] = useReducer(authReducer, {
    user: null,
    authIsReady: false,
  });

  // Use the useEffect hook to listen for changes in authentication state
  useEffect(() => {
    const unsub = projectAuth.onAuthStateChanged((user) => {
      dispatch({ type: "AUTH_IS_READY", payload: user });
      unsub();
    });
  }, []);

  // Render the AuthContext.Provider with the AuthContext state and dispatch function
  return (
    <AuthContext.Provider value={{ user, authIsReady, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
