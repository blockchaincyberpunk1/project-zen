// Import necessary modules
import { Link, withRouter } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

// Import styles and images
import "./Navbar.css";
import LogoLightBlue from "../assets/logo-light-blue.svg";

// Define a functional component called Navbar
function Navbar({ history }) {
  // Get the user object from the useAuthContext hook
  const { user } = useAuthContext();
  // Get the history object from React Router
  //const history = useHistory();
  // Get the logout function and isPending status from the useLogout hook
  const { logout, isPending } = useLogout(history);

  // Function to handle logout button click
  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img src={LogoLightBlue} alt="projectzen logo" />
          <span>ProjectZen</span>
        </li>
        {/* If user is not authenticated, display login and signup links */}
        {!user && (
          <>
            <li>
              <Link className="btn" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link className="btn" to="/signup">
                Signup
              </Link>
            </li>
          </>
        )}
        {/* If user is authenticated, display logout button */}
        {user && (
          <li>
            {/* If not logging out, show the logout button */}
            {!isPending && (
              <button className="btn" onClick={handleLogout}>
                Logout
              </button>
            )}
            {/* If logging out, show a disabled button */}
            {isPending && (
              <button className="btn" disabled>
                Logging out...
              </button>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
}

export default withRouter(Navbar);
