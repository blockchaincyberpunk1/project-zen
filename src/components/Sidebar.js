// Import necessary modules
import { NavLink } from "react-router-dom";
import { useAuthContext } from "../hooks/useAuthContext";

// Import Avatar component
import Avatar from "./Avatar";

// Import styles and images
import "./Sidebar.css";
import DashboardIcon from "../assets/dashboard_icon.svg";
import AddIcon from "../assets/add_icon.svg";
import ListCheck from '../assets/list-check-solid.svg'
// Define a functional component called Sidebar
export default function Sidebar() {
  // Use the useAuthContext hook to get the user object
  const { user } = useAuthContext();

  // Render the sidebar with user details and links to dashboard and project creation page
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="user">
          {/* Display the user's avatar and name */}
          <Avatar src={user.photoURL} />
          <p>Hey {user.displayName}</p>
        </div>
        <nav className="links">
          <ul>
            <li>
              {/* Link to dashboard */}
              <NavLink exact to="/">
                <img src={DashboardIcon} alt="dashboard icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              {/* Link to project creation page */}
              <NavLink to="/create">
                <img src={AddIcon} alt="add project icon" />
                <span>New Project</span>
              </NavLink>
            </li>
            <li>
              {/* Link to tasks page */}
              <NavLink to="/tasks">
                <img src={ListCheck} alt="tasks icon" />
                <span>Tasks</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}


/* I did not write a test for this component since its only presentational component and doesn't have any logic or state to test. */