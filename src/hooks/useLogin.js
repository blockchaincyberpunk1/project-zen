import { useState, useEffect, useRef } from 'react';
import { projectAuth, projectFirestore } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

export const useLogin = (history) => {
  const [isPending, setIsPending] = useState(false); // State variable to indicate login status
  const [error, setError] = useState(null); // State variable to store any login errors
  const { dispatch } = useAuthContext(); // Get the dispatch function from the AuthContext

  const isMounted = useRef(true); // Ref to track if component is mounted

  // Function to log in user with email and password
  const login = async (email, password) => {
    setIsPending(true); // Set login status to pending
    setError(null); // Clear any previous errors

    try {
      // Call Firebase to log in user
      const res = await projectAuth.signInWithEmailAndPassword(email, password);

      // Update online status of user
      const documentRef = projectFirestore.collection('users').doc(res.user.uid);
      await documentRef.update({ online: true });

      // Dispatch a LOGIN action with the user object
      dispatch({ type: 'LOGIN', payload: res.user });

      if (isMounted.current) {
        // If component is still mounted, set login status to not pending and clear any errors
        setIsPending(false);
        setError(null);
      }

      // Redirect to the homepage after successful login
      history.push("/");
    } catch (err) {
      if (isMounted.current) {
        // If component is still mounted, set the error message and set login status to not pending
        setError(err.message);
        setIsPending(false);
      }
    }
  };

  // When the component using this hook is unmounted, set isMounted to false to prevent state updates
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Return login function, login status, and error message
  return { login, isPending, error };
};
