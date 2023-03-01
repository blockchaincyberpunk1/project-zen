import { useEffect, useState, useRef } from "react"
import { projectFirestore } from "../firebase/config"
/**
 * A custom hook that retrieves a Firestore collection and updates the documents and any errors in state
 * @param {string} collection - The name of the Firestore collection to retrieve
 * @param {Array} query - An optional array that specifies a query to filter the collection (e.g. ["fieldName", "operator", "value"])
 * @param {Array} orderBy - An optional array that specifies a query to sort the collection (e.g. ["fieldName", "asc" or "desc"])
 * @returns {Object} An object with two properties: 'documents', an array of the documents in the collection, and 'error', any error that occurred during the retrieval of the documents
 */
// The useCollection hook takes a collection, query and orderBy as arguments
export const useCollection = (collection, query = null, orderBy = null) => {
  // Documents are stored in state
  const [documents, setDocuments] = useState(null)
  // Errors are stored in state
  const [error, setError] = useState(null)

  // Use useRef to persist the query and orderBy objects across re-renders
  // We use useRef to ensure that the query and orderBy objects don't cause a re-render loop
  const queryRef = useRef(query).current
  const orderByRef = useRef(orderBy).current

  // The effect function retrieves the documents when the component mounts
  useEffect(() => {
    // Set up a reference to the Firestore collection
    let ref = projectFirestore.collection(collection)

    // If a query is provided, filter the collection
    if (queryRef) {
      ref = ref.where(...queryRef)
    }
    // If an orderBy parameter is provided, sort the collection
    if (orderByRef) {
      ref = ref.orderBy(...orderByRef)
    }

   /*  onSnapshot is a method provided by Firebase's Firestore API that attaches a listener to a document or query and invokes a callback every time there is a change in the document or query result.

    When a change occurs in the document or query, the listener is triggered and the callback function is called. The callback function then updates the data on the client side. This creates a real-time update experience for the user, as any change made on the server-side will immediately be reflected in the user interface.

    This method is particularly useful for real-time applications where the user needs to be able to see updates in real-time without refreshing the page or manually triggering an update. */
    // Subscribe to the snapshot of the Firestore collection
    const unsubscribe = ref.onSnapshot(snapshot => {
      // Loop through the documents and convert them to plain objects with IDs
      let results = []
      // Update the state with the new documents and clear any errors
      snapshot.docs.forEach(doc => {
        // Convert each document to a plain object with an 'id' property
        results.push({...doc.data(), id: doc.id})
      });
      
      // Update the state with the new documents and clear any errors
      setDocuments(results)
      setError(null)
    }, error => {
      // Log any errors and set the error state
      console.log(error)
      setError('Could not fetch the data')
    })

    // Unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe()
    // Only re-run the effect when the collection, query, or orderBy parameters change
  }, [collection, queryRef, orderByRef])

  // Return the documents and any errors
  return { documents, error }
}