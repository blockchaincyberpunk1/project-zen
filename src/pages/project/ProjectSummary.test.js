import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProjectSummary from "./ProjectSummary";

// Mocking useFirestore and useAuthContext hooks
jest.mock("../../hooks/useFirestore", () => ({
  useFirestore: jest.fn(() => ({
    deleteDocument: jest.fn(),
  })),
}));

jest.mock("../../hooks/useAuthContext", () => ({
  useAuthContext: jest.fn(() => ({
    user: { uid: "abc123" },
  })),
}));

describe("ProjectSummary component", () => {
  it("should render project details", () => {
    // Setting up test data
    const project = {
      id: "123",
      name: "Test Project",
      dueDate: {
        toDate: () => new Date("2023-03-01"),
      },
      details: "This is a test project.",
      assignedUsersList: [],
      createdBy: {
        id: "abc123",
      },
    };

     // Rendering ProjectSummary component with test data
    render(
      <MemoryRouter>
        <ProjectSummary project={project} />
      </MemoryRouter>
    );

    // Asserting that the rendered component displays the correct project details
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(
      screen.getByText("Project due by Tue Mar 01 2023")
    ).toBeInTheDocument();
    expect(screen.getByText("This is a test project.")).toBeInTheDocument();
  });

  it("should render assigned users", () => {
    const project = {
      id: "123",
      name: "Test Project",
      dueDate: {
        toDate: () => new Date("2023-03-01"),
      },
      details: "This is a test project.",
      assignedUsersList: [
        { id: "user1", photoURL: "http://example.com/user1.png" },
        { id: "user2", photoURL: "http://example.com/user2.png" },
      ],
      createdBy: {
        id: "abc123",
      },
    };

    // Rendering ProjectSummary component with test data
    render(
      <MemoryRouter>
        <ProjectSummary project={project} />
      </MemoryRouter>
    );

    // Asserting that the rendered component displays the correct assigned users
    expect(screen.getByAltText("user1")).toBeInTheDocument();
    expect(screen.getByAltText("user2")).toBeInTheDocument();
  });

  it('should render "Mark as Complete" button for projects created by logged-in user', () => {
    const project = {
      id: "123",
      name: "Test Project",
      dueDate: {
        toDate: () => new Date("2023-03-01"),
      },
      details: "This is a test project.",
      assignedUsersList: [],
      createdBy: {
        id: "abc123",
      },
    };

    // Rendering ProjectSummary component with test data
    render(
      <MemoryRouter>
        <ProjectSummary project={project} />
      </MemoryRouter>
    );

    // Asserting that the rendered component displays "Mark as Complete" button
    expect(screen.getByText("Mark as Complete")).toBeInTheDocument();
  });

  it('should not render "Mark as Complete" button for projects not created by logged-in user', () => {
    const project = {
      id: "123",
      name: "Test Project",
      dueDate: {
        toDate: () => new Date("2023-03-01"),
      },
      details: "This is a test project.",
      assignedUsersList: [],
      createdBy: {
        id: "def456",
      },
    };

    render(
      <MemoryRouter>
        <ProjectSummary project={project} />
      </MemoryRouter>
    );

    expect(screen.queryByText("Mark as Complete")).not.toBeInTheDocument();
  });
});
