import { useReducer, useEffect, useState, useCallback } from "react"
import { projectFirestore, timestamp } from "../firebase/config"

// initial state of response
let initialState = {
  document: null,
  isPending: false,
  error: null,
  success: null,
}

// Reducer function to update the response state based on action
const firestoreReducer = (state, action) => {
  switch (action.type) {
    case 'IS_PENDING':
      return { isPending: true, document: null, success: false, error: null }
    case 'ADDED_DOCUMENT':
      return { isPending: false, document: action.payload, success: true, error: null }
    case 'DELETED_DOCUMENT':
      return { isPending: false, document: null, success: true, error: null }
    case 'ERROR':
      return { isPending: false, document: null, success: false, error: action.payload }
    case "UPDATED_DOCUMENT":
      return { isPending: false, document: action.payload, success: true,  error: null }
    default:
      return state
  }
}

// custom hook useFirestore
export const useFirestore = (collection) => {
  // declare response state and dispatch method to update the state
  const [response, dispatch] = useReducer(firestoreReducer, initialState)
  // state to keep track of cancellation
  const [isCancelled, setIsCancelled] = useState(false)

  // collection ref
  const ref = projectFirestore.collection(collection)

  // only dispatch if not cancelled
  const dispatchIfNotCancelled = useCallback(
    (action) => {
      if (!isCancelled) {
        dispatch(action);
      }
    },
    [isCancelled]
  );
  
  // add a document to firestore
  const addDocument = useCallback(
    async (doc) => {
      dispatch({ type: "IS_PENDING" });

      try {
        const createdAt = timestamp.fromDate(new Date());
        const addedDocument = await ref.add({ ...doc, createdAt });
        dispatchIfNotCancelled({ type: "ADDED_DOCUMENT", payload: addedDocument });
      } catch (err) {
        dispatchIfNotCancelled({ type: "ERROR", payload: err.message });
      }
    },
    [dispatchIfNotCancelled, ref]
  );

  // delete a document from firestore
  const deleteDocument = useCallback(
    async (id) => {
      dispatch({ type: "IS_PENDING" });

      try {
        await ref.doc(id).delete();
        dispatchIfNotCancelled({ type: "DELETED_DOCUMENT" });
      } catch (err) {
        dispatchIfNotCancelled({ type: "ERROR", payload: "could not delete" });
      }
    },
    [dispatchIfNotCancelled, ref]
  );

  // update a document in firestore
  const updateDocument = useCallback(
    async (id, updates) => {
      dispatch({ type: "IS_PENDING" });

      try {
        await ref.doc(id).update(updates);
        dispatchIfNotCancelled({ type: "UPDATED_DOCUMENT", payload: { id, ...updates } });
      } catch (error) {
        dispatchIfNotCancelled({ type: "ERROR", payload: error });
      }
    },
    [dispatchIfNotCancelled, ref]
  );

  // cleanup function to cancel any pending request
  useEffect(() => {
    return () => setIsCancelled(true)
  }, [])

  // return the necessary functions and response state
  return { addDocument, deleteDocument, updateDocument, response }

}
