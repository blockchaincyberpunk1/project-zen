import { renderHook, act } from "@testing-library/react-hooks";
import { useAuthContext } from "./useAuthContext";
import { useSignUp } from "./useSignUp";
import {
  projectAuth,
  projectStorage,
  projectFirestore,
} from "../firebase/config";

// Mock useAuthContext hook
jest.mock("./useAuthContext", () => ({
  useAuthContext: jest.fn(),
}));

describe("useSignUp", () => {
  beforeEach(() => {
    // Mock dispatch function in useAuthContext hook
    useAuthContext.mockReturnValue({
      dispatch: jest.fn(),
    });
  });

  it("should sign up a user successfully", async () => {
    const email = "test@example.com";
    const password = "testpassword";
    const displayName = "Test User";
    const thumbnail = new File(["test"], "test.png", { type: "image/png" });
    const user = {
      uid: "123",
      displayName,
      photoURL: "https://test.com/image.png",
    };
    const createUserSpy = jest.fn(() => ({ user }));
    const updateProfileSpy = jest.fn();
    const setDocSpy = jest.fn();
    const putSpy = jest.fn(() => ({
      ref: {
        getDownloadURL: jest.fn(() =>
          Promise.resolve("https://test.com/image.png")
        ),
      },
    }));

    // Mock FileReader API to simulate image upload
    jest.spyOn(window, "FileReader").mockImplementation(() => ({
      readAsDataURL: jest.fn(() => {
        const readerEvent = {
          target: {
            result: "data:image/png;base64,test",
          },
        };
        window.setTimeout(() => {
          const onload = jest.fn();
          onload(readerEvent);
        }, 0);
      }),
      result: "",
    }));

    // Mock File API to simulate thumbnail file upload
    jest.spyOn(window, "File").mockImplementation(() => thumbnail);

    const { result, waitForNextUpdate } = renderHook(() => useSignUp());
    const { signUp } = result.current;

    global.FileReader = window.FileReader;

    // Call setTimeout() to simulate async image upload
    jest.spyOn(window, "setTimeout").mockImplementationOnce((fn) => fn());

    jest.spyOn(window, "File").mockImplementation(() => thumbnail);

    jest
      .spyOn(projectAuth, "createUserWithEmailAndPassword")
      .mockImplementation(createUserSpy);
    jest.spyOn(projectFirestore.collection("users"), "doc").mockReturnValue({
      set: setDocSpy,
    });
    jest.spyOn(projectStorage.ref(), "put").mockReturnValue({
      on: jest.fn(),
      snapshot: {
        ref: {
          getDownloadURL: jest.fn(() =>
            Promise.resolve("https://test.com/image.png")
          ),
        },
      },
    });

    // Call the signUp function to create user and update profile
    act(() => {
      signUp(email, password, displayName, thumbnail);
    });

    await waitForNextUpdate();

    // Assertions
    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith(email, password);
    expect(projectStorage.ref).toHaveBeenCalledWith("thumbnails/123/test.png");
    expect(putSpy).toHaveBeenCalledTimes(1);
    expect(updateProfileSpy).toHaveBeenCalledTimes(1);
    expect(updateProfileSpy).toHaveBeenCalledWith({
      displayName,
      photoURL: "https://test.com/image.png",
    });
    expect(projectFirestore.collection("users").doc).toHaveBeenCalledTimes(1);
    expect(projectFirestore.collection("users").doc).toHaveBeenCalledWith(
      user.uid
    );
    expect(setDocSpy).toHaveBeenCalledTimes(1);
    expect(setDocSpy).toHaveBeenCalledWith({
      online: true,
      displayName,
      photoURL: "https://test.com/image.png",
    });
    expect(useAuthContext().dispatch).toHaveBeenCalledTimes(1);
    expect(useAuthContext().dispatch).toHaveBeenCalledWith({
      type: "LOGIN",
      payload: user,
    });
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it("should handle sign up error", async () => {
    const email = "test@example.com";
    const password = "testpassword";
    const displayName = "Test User";
    const thumbnail = new File(["test"], "test.png", { type: "image/png" });
    const error = new Error("Error signing up");
    const createUserSpy = jest.fn(() => {
      throw error;
    });

    jest.spyOn(window, "FileReader").mockImplementation(() => ({
      readAsDataURL: jest.fn(() => {
        const readerEvent = {
          target: {
            result: "data:image/png;base64,test",
          },
        };
        window.setTimeout(() => {
          const onload = jest.fn();
          onload(readerEvent);
        }, 0);
      }),
      result: "",
    }));

    jest.spyOn(window, "File").mockImplementation(() => thumbnail);

    const { result, waitForNextUpdate } = renderHook(() => useSignUp());
    const { signUp } = result.current;

    global.FileReader = window.FileReader;

    act(() => {
      signUp(email, password, displayName, thumbnail);
    });

    await waitForNextUpdate();

    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith(email, password);
    expect(result.current.error).toEqual(error.message);
    expect(result.current.isPending).toBe(false);
  });
});
