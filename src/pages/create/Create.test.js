import { render, screen, fireEvent } from "@testing-library/react";
import Create from "./Create";

describe("Create component", () => {
  it("should render the create form", () => {
    // Render the component
    render(<Create />);

    // Check that the form inputs are present
    expect(screen.getByLabelText("Project name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Project Details:")).toBeInTheDocument();
    expect(screen.getByLabelText("Set due date:")).toBeInTheDocument();
    expect(screen.getByLabelText("Project category:")).toBeInTheDocument();
    expect(screen.getByLabelText("Assign to:")).toBeInTheDocument();

    // Check that the submit button is present
    expect(screen.getByText("Add Project")).toBeInTheDocument();
  });

  it("should display an error message if the category field is not filled out", () => {
    // Render the component
    render(<Create />);

    // Fill out form inputs
    const nameInput = screen.getByLabelText("Project name:");
    const detailsInput = screen.getByLabelText("Project Details:");
    const dueDateInput = screen.getByLabelText("Set due date:");
    const assignedUsersInput = screen.getByLabelText("Assign to:");
    fireEvent.change(nameInput, { target: { value: "Test Project" } });
    fireEvent.change(detailsInput, { target: { value: "Test Project Details" } });
    fireEvent.change(dueDateInput, { target: { value: "2022-01-01" } });
    fireEvent.change(assignedUsersInput, { target: { value: [{ label: "Test User", value: { id: "testuser123" } }] } });

    // Submit the form
    const submitButton = screen.getByText("Add Project");
    fireEvent.click(submitButton);

    // Check that the error message is displayed
    const errorMessage = screen.getByText("Please select a project category.");
    expect(errorMessage).toBeInTheDocument();
  });

  it("should display an error message if no users are assigned to the project", () => {
    // Render the component
    render(<Create />);

    // Fill out form inputs
    const nameInput = screen.getByLabelText("Project name:");
    const detailsInput = screen.getByLabelText("Project Details:");
    const dueDateInput = screen.getByLabelText("Set due date:");
    const categoryInput = screen.getByLabelText("Project category:");
    fireEvent.change(nameInput, { target: { value: "Test Project" } });
    fireEvent.change(detailsInput, { target: { value: "Test Project Details" } });
    fireEvent.change(dueDateInput, { target: { value: "2022-01-01" } });
    fireEvent.change(categoryInput, { target: { value: [{ label: "Industrial", value: "industrial" }] } });

    // Submit the form
    const submitButton = screen.getByText("Add Project");
    fireEvent.click(submitButton);

    // Check that the error message is displayed
    const errorMessage = screen.getByText("Please assign the project to at least 1 user");
    expect(errorMessage).toBeInTheDocument();
  });
});
