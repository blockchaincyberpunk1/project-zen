import { renderHook, act } from "@testing-library/react-hooks";
import { useLogout } from "./useLogout";
import { projectAuth, projectFirestore } from "../firebase/config";

// Mock Firebase auth and Firestore
jest.mock("../firebase/config", () => ({
  projectAuth: {
    currentUser: {
      uid: "123",
    },
    signOut: jest.fn(() => Promise.resolve()),
  },
  projectFirestore: {
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        update: jest.fn(() => Promise.resolve()),
      })),
    })),
  },
}));

describe("useLogout", () => {
  it("should log out a user successfully", async () => {
    const history = {
      push: jest.fn(),
    };
    const { result, waitForNextUpdate } = renderHook(() => useLogout(history));
    const { logout } = result.current;

    // Call the logout function
    act(() => {
      logout();
    });

    // Verify that the appropriate Firebase methods were called
    expect(projectFirestore.collection).toHaveBeenCalledWith("users");
    expect(projectFirestore.collection("users").doc).toHaveBeenCalledWith(
      "123"
    );
    expect(
      projectFirestore.collection("users").doc().update
    ).toHaveBeenCalledWith({ online: false });
    expect(projectAuth.signOut).toHaveBeenCalledTimes(1);

    // Wait for the logout function to complete
    await waitForNextUpdate();

    // Verify that there are no errors and the function is not pending
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);

    // Verify that the user is redirected to the login page
    expect(history.push).toHaveBeenCalledWith("/login");
  });

  it("should handle logout error", async () => {
    const error = new Error("Logout failed");
    const history = {
      push: jest.fn(),
    };
    const { result, waitForNextUpdate } = renderHook(() => useLogout(history));
    const { logout } = result.current;

    // Mock an error when updating Firestore
    jest
      .spyOn(projectFirestore.collection("users").doc(), "update")
      .mockRejectedValue(error);

    // Call the logout function
    act(() => {
      logout();
    });

    // Verify that the appropriate Firebase methods were called
    expect(projectFirestore.collection).toHaveBeenCalledWith("users");
    expect(projectFirestore.collection("users").doc).toHaveBeenCalledWith(
      "123"
    );
    expect(
      projectFirestore.collection("users").doc().update
    ).toHaveBeenCalledWith({ online: false });

    // Wait for the logout function to complete
    await waitForNextUpdate();

    // Verify that the error is handled and the function is not pending
    expect(result.current.error).toEqual(error.message);
    expect(result.current.isPending).toBe(false);
  });
});
