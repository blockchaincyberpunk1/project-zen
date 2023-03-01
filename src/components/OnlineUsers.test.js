import { render, screen } from "@testing-library/react";
import OnlineUsers from "./OnlineUsers";

// Mock the useCollection hook to return dummy data
// We're mocking the hook to ensure that we're only testing the OnlineUsers component, not the useCollection hook that it depends on
jest.mock("../hooks/useCollection", () => ({
  useCollection: () => ({
    isPending: false,
    error: null,
    documents: [
      {
        id: "1",
        displayName: "John Doe",
        photoURL: "https://example.com/avatar.png",
        online: true,
      },
      {
        id: "2",
        displayName: "Jane Smith",
        photoURL: "https://example.com/avatar2.png",
        online: false,
      },
    ],
  }),
}));

describe("OnlineUsers component", () => {
  test("renders list of online users", () => {
    render(<OnlineUsers />);
    expect(screen.getByText("All Users")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  test("displays online indicator for online users", () => {
    render(<OnlineUsers />);
    const onlineIndicator = screen.getByTestId("online-indicator-1");
    // Check that the online indicator is in the document
    expect(onlineIndicator).toBeInTheDocument();
    // Check that the online indicator has the 'online-user' class
    expect(onlineIndicator).toHaveClass("online-user");
  });

  test("displays avatar for each user", () => {
    render(<OnlineUsers />);
    const avatars = screen.getAllByAltText("user avatar");
    // Check that there are two avatars in the document
    expect(avatars).toHaveLength(2);
    // Check that the first avatar has the correct src attribute
    expect(avatars[0]).toHaveAttribute("src", "https://example.com/avatar.png");
    // Check that the second avatar has the correct src attribute
    expect(avatars[1]).toHaveAttribute(
      "src",
      "https://example.com/avatar2.png"
    );
  });
});
