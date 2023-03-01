import { useEffect, useState } from "react";
import { projectFirestore } from "../firebase/config";

export const useDocument = (collection, id) => {
  const [document, setDocument] = useState(null);
  const [error, setError] = useState(null);

  // Listen to realtime updates on the document with the specified id in the specified collection
  useEffect(() => {
    const ref = projectFirestore.collection(collection).doc(id);

    /* 
    Reference - https://firebase.google.com/docs/firestore/query-data/listen
    */
    // Subscribe to changes in the document data
    const unsubscribe = ref.onSnapshot(
      (snapshot) => {
        // Check if the document exists and has data
        if (snapshot.data()) {
          // Update the state with the retrieved document data and its id
          setDocument({ ...snapshot.data(), id: snapshot.id });
          setError(null);
        } else {
          // If no document is found with the given id, set an error message
          setError("No such document exists");
        }
      },
      (err) => {
        console.log(err.message);
        // If there is an error while fetching the document, set an error message
        setError("Failed to get document");
      }
    );

    // Unsubscribe from updates on unmount
    return () => unsubscribe();
  }, [collection, id]);

  return { document, error };
};
