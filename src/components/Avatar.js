// Import the CSS file for the Avatar component's styles
import "./Avatar.css";

// Define a functional component called Avatar, which takes a prop called 'src'
export default function Avatar({ src }) {
  // The component returns a div with a class of 'avatar' and an img element with the 'src' and 'alt' attributes.
  return (
    <div className="avatar">
      <img src={src} alt="user avatar" />
    </div>
  );
}
