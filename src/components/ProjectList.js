// Import necessary modules
import { Link } from "react-router-dom";
import Avatar from "../components/Avatar";

// Import styles
import "./ProjectList.css";

// Define a functional component called ProjectList, which takes a prop called 'projects'
export default function ProjectList({ projects }) {
  // Log the projects to the console
  console.log(projects);

  // Render the list of projects with their details
  return (
    <div className="project-list">
      {/* If there are no projects, display a message */}
      {projects.length === 0 && <p>No projects yet!</p>}
      {/* If there are projects, display each one with its details */}
      {projects.map((project) => (
        <Link to={`/projects/${project.id}`} key={project.id}>
          <h4>{project.name}</h4>
          <p>Due by {project.dueDate.toDate().toDateString()}</p>
          <div className="assigned-to">
            <p>
              <strong>Assigned to:</strong>
            </p>
            <ul>
              {project.assignedUsersList.map((user) => (
                <li key={user.photoURL}>
                  {/* Display each assigned user's avatar */}
                  <Avatar src={user.photoURL} />
                </li>
              ))}
            </ul>
          </div>
        </Link>
      ))}
    </div>
  );
}
