import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import Tasks from "./Tasks";

// Mock the useAuthContext hook to return a user object with a uid property
jest.mock("../../hooks/useAuthContext");
useAuthContext.mockReturnValue({ user: { uid: "123" } });

// Mock the useCollection hook to return a tasks array
jest.mock("../../hooks/useCollection");
useCollection.mockReturnValue({
  documents: [{ id: "1", name: "Task 1", isComplete: false }],
  error: null,
});

// Mock the useFirestore hook to provide empty implementations of the functions
jest.mock("../../hooks/useFirestore");
useFirestore.mockReturnValue({
  addDocument: jest.fn(),
  deleteDocument: jest.fn(),
  updateDocument: jest.fn(),
});

describe("Tasks", () => {
  beforeEach(() => {
    render(<Tasks />);
  });

  it("should render the Tasks component", () => {
    const pageTitle = screen.getByText(/tasks/i);
    expect(pageTitle).toBeInTheDocument();
  });

  it("should render a list of tasks", () => {
    const taskName = screen.getByText(/task 1/i);
    expect(taskName).toBeInTheDocument();
  });

  it("should render an add task form", () => {
    const addTaskTitle = screen.getByText(/add new task/i);
    expect(addTaskTitle).toBeInTheDocument();
    const nameInput = screen.getByLabelText(/name:/i);
    expect(nameInput).toBeInTheDocument();
    const detailsInput = screen.getByLabelText(/details:/i);
    expect(detailsInput).toBeInTheDocument();
    const dueDateInput = screen.getByLabelText(/due date:/i);
    expect(dueDateInput).toBeInTheDocument();
    const addButton = screen.getByRole("button", { name: /add task/i });
    expect(addButton).toBeInTheDocument();
  });

  it("should allow the user to add a new task", () => {
    const nameInput = screen.getByLabelText(/name:/i);
    const detailsInput = screen.getByLabelText(/details:/i);
    const dueDateInput = screen.getByLabelText(/due date:/i);
    const addButton = screen.getByRole("button", { name: /add task/i });

    // Enter task details and submit the form
    userEvent.type(nameInput, "Task 2");
    userEvent.type(detailsInput, "Task 2 details");
    userEvent.type(dueDateInput, "2023-03-01");
    userEvent.click(addButton);

    // Check that the addDocument function was called with the new task object
    expect(useFirestore().addDocument).toHaveBeenCalledTimes(1);
    expect(useFirestore().addDocument).toHaveBeenCalledWith({
      name: "Task 2",
      details: "Task 2 details",
      assignedUsersList: ["123"],
      createdBy: "123",
      dueDate: "2023-03-01",
    });

    // Check that the form was cleared after submission
    expect(nameInput).toHaveValue("");
    expect(detailsInput).toHaveValue("");
    expect(dueDateInput).toHaveValue("");
  });

  it("should allow the user to delete a task", () => {
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Click the delete button and check that the deleteDocument function was called with the task id
    userEvent.click(deleteButton);
    expect(useFirestore().deleteDocument).toHaveBeenCalledTimes(1);
    expect(useFirestore().deleteDocument).toHaveBeenCalledWith("123");
  });

  it("should allow the user to toggle completion of a task", () => {
    const checkbox = screen.getByRole("checkbox");
    // Click the checkbox and check that the updateDocument function was called with the task id and updated data
    userEvent.click(checkbox);
    expect(useFirestore().updateDocument).toHaveBeenCalledTimes(1);
    expect(useFirestore().updateDocument).toHaveBeenCalledWith("123", {
      isComplete: true,
    });
  });
});
