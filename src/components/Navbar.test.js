// Import testing libraries
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContextProvider } from "../hooks/useAuthContext";
import Navbar from "./Navbar";

describe("Navbar component", () => {
  // Test if Navbar renders the logo and title
  test("renders logo and title", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <Navbar />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const logo = screen.getByAltText("projectzen logo");
    const title = screen.getByText("ProjectZen");
    expect(logo).toBeInTheDocument();
    expect(title).toBeInTheDocument();
  });

  // Test if Navbar renders login and signup links for unauthenticated user
  test("renders login and signup links for unauthenticated user", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider>
          <Navbar />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const loginLink = screen.getByText("Login");
    const signupLink = screen.getByText("Signup");
    expect(loginLink).toBeInTheDocument();
    expect(signupLink).toBeInTheDocument();
  });

  // Test if Navbar renders logout button for authenticated user
  test("renders logout button for authenticated user", () => {
    render(
      <MemoryRouter>
        <AuthContextProvider user={{ uid: "123" }}>
          <Navbar />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const logoutButton = screen.getByText("Logout");
    expect(logoutButton).toBeInTheDocument();
  });

  // Test if logout button calls handleLogout function when clicked
  test("calls handleLogout function when logout button is clicked", () => {
    const mockLogout = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <AuthContextProvider user={{ uid: "123" }}>
          <Navbar />
        </AuthContextProvider>
      </MemoryRouter>
    );
    const logoutButton = getByText("Logout");
    logoutButton.onclick = mockLogout;
    fireEvent.click(logoutButton);
    expect(mockLogout).toHaveBeenCalled();
  });
});
