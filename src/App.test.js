import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContextProvider } from "./hooks/useAuthContext";
import App from "./App";

describe("App component", () => {
  // Test that the login page is rendered by default
  test("renders login page by default", () => {
    // Render the App component with the MemoryRouter and AuthContextProvider
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </MemoryRouter>
    );

    // Assert that the "login" text is present in the rendered output
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  // Test that the dashboard page is rendered for an authenticated user
  test("renders dashboard page for authenticated user", () => {
    // Render the App component with the MemoryRouter and AuthContextProvider, passing a user object with a uid property
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AuthContextProvider user={{ uid: "123" }}>
          <App />
        </AuthContextProvider>
      </MemoryRouter>
    );

    // Assert that the "dashboard" text is present in the rendered output
    expect(screen.getByText("dashboard")).toBeInTheDocument();
  });

  // Test that the project page is rendered for an authenticated user
  test("renders project page for authenticated user", () => {
    // Render the App component with the MemoryRouter and AuthContextProvider, passing a user object with a uid property
    render(
      <MemoryRouter initialEntries={["/projects/123"]}>
        <AuthContextProvider user={{ uid: "123" }}>
          <App />
        </AuthContextProvider>
      </MemoryRouter>
    );

    // Assert that the "project details" text is present in the rendered output
    expect(screen.getByText("project details")).toBeInTheDocument();
  });

  // Test that the user is redirected to the login page for an unauthenticated user
  test("redirects to login page for unauthenticated user", () => {
    // Render the App component with the MemoryRouter and AuthContextProvider
    render(
      <MemoryRouter initialEntries={["/create"]}>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </MemoryRouter>
    );

    // Assert that the "login" text is present in the rendered output
    expect(screen.getByText("login")).toBeInTheDocument();
  });
});
