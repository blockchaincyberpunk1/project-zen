// Import the necessary testing libraries
import { render, screen } from "@testing-library/react";

// Import the Avatar component
import Avatar from "./Avatar";

// Test the Avatar component
describe("Avatar", () => {
  it("renders an img element with a src prop", () => {
    // Define the src prop for the Avatar component
    const src = "https://example.com/avatar.jpg";
    // Render the Avatar component with the src prop
    render(<Avatar src={src} />);

    // Assert that an img element with the src prop is rendered
    expect(screen.getByRole("img", { name: /user avatar/i })).toHaveAttribute(
      "src",
      src
    );
  });
});
