import { useEffect, useState, useCallback } from "react";
import { projectAuth, projectFirestore } from "../firebase/config";

// The useLogout hook takes a `dispatch` function as a parameter to decouple it from the useAuthContext hook
export const useLogout = (history) => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  // Wrap the logout function with useCallback to memoize it
  const logout = useCallback(async () => {
    setError(null);
    setIsPending(true);

    try {
      // update online status of the user
      const { uid } = projectAuth.currentUser;
      await projectFirestore
        .collection("users")
        .doc(uid)
        .update({ online: false });

      // sign the user out
      await projectAuth.signOut();

      // update state
      if (!isCancelled) {
        // If the component is not cancelled, set the login status to not pending and clear any errors
        setIsPending(false);
        setError(null);
        history.push("/login"); // Redirect to the login page after logout
      }
    } catch (err) {
      // If the component is not cancelled, set the error message and set the login status to not pending
      if (!isCancelled) {
        setError(err.message);
        setIsPending(false);
      }
    }
  }, [history, isCancelled]);

  // useEffect hook to set the isCancelled state to true when the component unmounts
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  // Return the logout function, error message, and isPending status
  return { logout, error, isPending };
};
