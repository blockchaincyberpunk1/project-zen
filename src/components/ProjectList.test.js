import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import ProjectList from "./ProjectList";

describe("ProjectList", () => {
  const projects = [
    {
      id: "1",
      name: "Project 1",
      dueDate: {
        toDate: () => new Date("2022-01-01"),
      },
      assignedUsersList: [
        {
          photoURL: "avatar1.png",
        },
        {
          photoURL: "avatar2.png",
        },
      ],
    },
    {
      id: "2",
      name: "Project 2",
      dueDate: {
        toDate: () => new Date("2022-02-01"),
      },
      assignedUsersList: [],
    },
  ];

  it("renders a message when there are no projects", () => {
    render(
      // Wrap ProjectList in BrowserRouter to prevent errors related to Link components
      <BrowserRouter>
        <ProjectList projects={[]} />
      </BrowserRouter>
    );
    expect(screen.getByText("No projects yet!")).toBeInTheDocument();
  });

  it("renders the list of projects with their details", () => {
    render(
      // Wrap ProjectList in BrowserRouter to prevent errors related to Link components
      <BrowserRouter>
        <ProjectList projects={projects} />
      </BrowserRouter>
    );
    // Check that each project name and due date is displayed
    expect(screen.getByText("Project 1")).toBeInTheDocument();
    expect(screen.getByText("Due by Sat Jan 01 2022")).toBeInTheDocument();
    expect(screen.getByAltText("user avatar")).toBeInTheDocument();
    expect(screen.getByText("Project 2")).toBeInTheDocument();
    expect(screen.getByText("Due by Tue Feb 01 2022")).toBeInTheDocument();
    expect(screen.queryAllByAltText("user avatar")).toHaveLength(0);
    // Check that user avatars are displayed only for projects with assigned users
  });
});
