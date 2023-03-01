import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSignUp } from "../../hooks/useSignUp";
import "./SignUp.css";

export default function SignUp() {
  // Destructure the register and handleSubmit functions from the useForm hook
  const { register, handleSubmit } = useForm();

  // Use object destructuring to simplify the useSignUp hook
  const signUpData = useSignUp();
  const { signUp, isPending, error } = signUpData;

  // Define state variables for display name, thumbnail, and thumbnail error
  const [displayName, setDisplayName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);

  // Define the onSubmit function to sign up a user with the entered credentials
  const onSubmit = (data) => {
    signUp(data.email, data.password, displayName, thumbnail);
  };

  // Define the handleFileChange function to update the thumbnail state when a new file is selected
  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];

    // Check if a file was selected
    if (!selected) {
      setThumbnailError("Please select a file");
      return;
    }

    // Check if the selected file is an image
    if (!selected.type.includes("image")) {
      setThumbnailError("Selected file must be an image");
      return;
    }

    // Check if the selected image file size is less than 100kb
    if (selected.size > 100000) {
      setThumbnailError("Image file size must be less than 100kb");
      return;
    }

    setThumbnailError(null);
    setThumbnail(selected);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
      <h2>sign up</h2>
      <label htmlFor="email">
        <span>email:</span>
        {/* Use the register function to register the email input with the form and set up validation rules */}
        <input
          required
          type="email"
          id="email"
          {...register("email", { required: true })}
        />
      </label>
      <label htmlFor="password">
        <span>password:</span>
        {/* Use the register function to register the password input with the form and set up validation rules */}
        <input
          required
          type="password"
          id="password"
          {...register("password", { required: true })}
        />
      </label>
      <label htmlFor="displayName">
        <span>display name:</span>
        {/* Set up the display name input with a value and onChange handler */}
        <input
          required
          type="text"
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </label>
      <label htmlFor="thumbnail">
        <span>Profile thumbnail:</span>
        {/* Use the register function to register the thumbnail input with the form and set up validation rules */}
        <input
          required
          type="file"
          id="thumbnail"
          onChange={handleFileChange}
        />
        {thumbnailError && <div className="error">{thumbnailError}</div>}
      </label>
      {/* Use the ternary operator to conditionally render the "loading" button */}
      {isPending ? (
        <button className="btn" disabled>
          loading
        </button>
      ) : (
        <button className="btn">Sign up</button>
      )}
      {error && <div className="error">{error}</div>}
    </form>
  );
}
