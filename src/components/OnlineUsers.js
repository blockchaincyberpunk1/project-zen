// Import necessary modules
import { useCollection } from "../hooks/useCollection";

// Import Avatar component
import Avatar from "./Avatar";

// Import styles
import "./OnlineUsers.css";

// Define a functional component called OnlineUsers
export default function OnlineUsers() {
  // Use the useCollection hook to get the list of online users
  const { isPending, error, documents } = useCollection("users");

  // Return the list of online users
  return (
    <div className="user-list">
      <h2>All Users</h2>
      {isPending && <div>Loading users...</div>}
      {error && <div>{error}</div>}
      {documents &&
        documents.map((user) => (
          <div key={user.id} className="user-list-item">
            {/* If user is online, display an indicator */}
            {user.online && <span className="online-user"></span>}
            <span>{user.displayName}</span>
            {/* Display the user's avatar */}
            <Avatar src={user.photoURL} />
          </div>
        ))}
    </div>
  );
}
