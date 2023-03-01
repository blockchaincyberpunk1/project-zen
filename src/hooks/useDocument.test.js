import { renderHook } from "@testing-library/react-hooks";
import { useDocument } from "./useDocument";
import { projectFirestore } from "../firebase/config";

describe("useDocument", () => {
  test("should get document from Firestore", async () => {
    // Define sample document data
    const docData = {
      id: "123",
      name: "Test Document",
      details: "This is a test document",
    };

    // Create Firestore document reference and set sample data
    const ref = projectFirestore.collection("testCollection").doc("123");
    await ref.set(docData);

    // Render the hook and wait for update
    const { result, waitForNextUpdate } = renderHook(() =>
      useDocument("testCollection", "123")
    );
    await waitForNextUpdate();

    // Expect the hook to return the sample document data with no error
    expect(result.current.document).toEqual(docData);
    expect(result.current.error).toBeNull();
  });

  test("should handle error if no document exists", async () => {
    // Render the hook with a non-existent document ID and wait for update
    const { result, waitForNextUpdate } = renderHook(() =>
      useDocument("testCollection", "456")
    );
    await waitForNextUpdate();

    // Expect the hook to return null document and "No such document exists" error
    expect(result.current.document).toBeNull();
    expect(result.current.error).toEqual("No such document exists");
  });

  test("should handle error if document retrieval fails", async () => {
    // Spy on the Firestore collection function and throw an error
    jest.spyOn(projectFirestore, "collection").mockImplementation(() => {
      throw new Error("Error getting document");
    });

    // Render the hook and wait for update
    const { result, waitForNextUpdate } = renderHook(() =>
      useDocument("testCollection", "123")
    );
    await waitForNextUpdate();

    // Expect the hook to return null document and "Failed to get document" error
    expect(result.current.document).toBeNull();
    expect(result.current.error).toEqual("Failed to get document");

    // Restore the Firestore collection function
    jest.restoreAllMocks();
  });
});
