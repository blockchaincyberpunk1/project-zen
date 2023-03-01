import { useState, useEffect } from 'react';
import { projectAuth, projectStorage, projectFirestore } from '../firebase/config';
import { useAuthContext } from './useAuthContext';

// Custom hook for user sign-up
export const useSignUp = () => {
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);
  const { dispatch } = useAuthContext();

  // Function to upload image to Firebase Storage
  const uploadImage = async (uid, image) => {
    const uploadPath = `thumbnails/${uid}/${image.name}`;
    const uploadTask = projectStorage.ref(uploadPath).put(image);
    const snapshot = await uploadTask;
    const imageUrl = await snapshot.ref.getDownloadURL();
    return imageUrl;
  };

  // Function for user sign-up
  const signUp = async (email, password, displayName, thumbnail) => {
    setError(null);
    setIsPending(true);

    try {
      // Create a new user account with the given email and password
      const userCredential = await projectAuth.createUserWithEmailAndPassword(
        email,
        password
      );
      const { user } = userCredential;

      // Upload user thumbnail to Firebase Storage
      const photoURL = await uploadImage(user.uid, thumbnail);

      // Update the user profile with the display name and photo URL
      await user.updateProfile({ displayName, photoURL });

      // Create a new user document in the 'users' collection in Firestore
      await projectFirestore.collection('users').doc(user.uid).set({
        online: true,
        displayName,
        photoURL,
      });

      // Dispatch a login action with the newly created user object
      dispatch({ type: 'LOGIN', payload: user });
      // Update state after the sign-up operation
      if (!isCancelled) {
        setIsPending(false);
        setError(null);
      }
    } catch(err) {
      if (!isCancelled) {
        setError(err.message)
        setIsPending(false)
      }
    }
  };

  // Clean up function to prevent memory leaks
  useEffect(() => {
    return () => setIsCancelled(true);
  }, []);

  return { signUp, error, isPending };
};

