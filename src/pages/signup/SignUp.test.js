import { render, screen, fireEvent } from "@testing-library/react";
import { useSignUp } from "../../hooks/useSignUp";
import SignUp from "./SignUp";

// Mock the useSignUp hook
jest.mock("../../hooks/useSignUp", () => ({
  useSignUp: () => ({
    signUp: jest.fn(),
    isPending: false,
    error: null,
  }),
}));

describe("SignUp component", () => {
  it("should render the sign up form", () => {
    render(<SignUp />);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const displayNameInput = screen.getByLabelText(/display name:/i);
    const thumbnailInput = screen.getByLabelText(/profile thumbnail:/i);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    expect(emailInput).toBeInTheDocument();
    expect(passwordInput).toBeInTheDocument();
    expect(displayNameInput).toBeInTheDocument();
    expect(thumbnailInput).toBeInTheDocument();
    expect(signUpButton).toBeInTheDocument();
  });

  it("should allow the user to sign up with valid credentials", () => {
    render(<SignUp />);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const displayNameInput = screen.getByLabelText(/display name:/i);
    const thumbnailInput = screen.getByLabelText(/profile thumbnail:/i);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    // Fill out the form and submit it
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(displayNameInput, { target: { value: "Test User" } });
    fireEvent.change(thumbnailInput, {
      target: {
        files: [new File(["test"], "test.jpg", { type: "image/jpg" })],
      },
    });
    fireEvent.click(signUpButton);

    // Check that the signUp function was called with the correct data
    expect(useSignUp().signUp).toHaveBeenCalledTimes(1);
    expect(useSignUp().signUp).toHaveBeenCalledWith(
      "test@test.com",
      "password",
      "Test User",
      expect.any(File)
    );
  });

  it("should display an error message if the user tries to sign up with invalid credentials", () => {
    render(<SignUp />);
    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    const displayNameInput = screen.getByLabelText(/display name:/i);
    const thumbnailInput = screen.getByLabelText(/profile thumbnail:/i);
    const signUpButton = screen.getByRole("button", { name: /sign up/i });
    // Fill out the form with invalid credentials and submit it
    fireEvent.change(emailInput, { target: { value: "test" } });
    fireEvent.change(passwordInput, { target: { value: "" } });
    fireEvent.change(displayNameInput, { target: { value: "" } });
    fireEvent.change(thumbnailInput, {
      target: {
        files: [new File(["test"], "test.txt", { type: "text/plain" })],
      },
    });
    fireEvent.click(signUpButton);

    // Check that the error message is displayed
    expect(
      screen.getByText(/Please enter a valid email address/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Please enter a password/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Please enter a display name/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Selected file must be an image/i)
    ).toBeInTheDocument();
  });
});
