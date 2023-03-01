import { renderHook } from "@testing-library/react-hooks";
import { useCollection } from "./useCollection";

// Mock Firestore config and collection data
jest.mock("../firebase/config", () => ({
  projectFirestore: {
    collection: () => ({
      where: () => ({
        orderBy: () => ({
          onSnapshot: (successCallback, errorCallback) => {
            const data = [
              { id: "1", name: "Document 1" },
              { id: "2", name: "Document 2" },
            ];
            successCallback({ docs: data });
          },
        }),
      }),
      onSnapshot: (successCallback, errorCallback) => {
        const data = [
          { id: "1", name: "Document 1" },
          { id: "2", name: "Document 2" },
        ];
        successCallback({ docs: data });
      },
    }),
  },
}));

describe("useCollection", () => {
  test("should return documents and no errors for a collection without query or orderBy", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useCollection("projects")
    );
    await waitForNextUpdate();
    expect(result.current.documents).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  test("should return documents and no errors for a collection with query and orderBy", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useCollection("projects", ["category", "==", "commercial"], [
        "dueDate",
        "asc",
      ])
    );
    await waitForNextUpdate();
    expect(result.current.documents).toHaveLength(2);
    expect(result.current.error).toBeNull();
  });

  test("should return an error for a failed request", async () => {
    // Spy on console.log, console.error, and global.fetch to prevent them from logging errors to the console
    jest.spyOn(console, "log").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    jest
      .spyOn(global, "fetch")
      .mockImplementation(() => Promise.reject(new Error("Server Error")));

    const { result, waitForNextUpdate } = renderHook(() =>
      useCollection("nonexistentCollection")
    );
    await waitForNextUpdate();

    // Expect the result to contain no documents and an error message
    expect(result.current.documents).toBeNull();
    expect(result.current.error).toBe("Could not fetch the data");

    // Restore the console.log, console.error, and global.fetch methods to their original state
    console.log.mockRestore();
    console.error.mockRestore();
    global.fetch.mockRestore();
  });
});
