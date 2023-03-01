import { render, screen, fireEvent } from "@testing-library/react";
import ProjectFilter from "./ProjectFilter";

describe("ProjectFilter", () => {
  // test for rendering filter buttons with labels
  it("should render filter buttons with labels", () => {
    render(<ProjectFilter changeFilter={() => {}} />);
    const filterButtons = screen.getAllByRole("button");
    expect(filterButtons).toHaveLength(6);
    expect(filterButtons[0]).toHaveTextContent("All");
    expect(filterButtons[1]).toHaveTextContent("Mine");
    expect(filterButtons[2]).toHaveTextContent("Commercial");
    expect(filterButtons[3]).toHaveTextContent("Multi-family");
    expect(filterButtons[4]).toHaveTextContent("Residential");
    expect(filterButtons[5]).toHaveTextContent("Industrial");
  });

  // test for calling changeFilter with filter name when a button is clicked
  it("should call changeFilter with filter name when a button is clicked", () => {
    const changeFilter = jest.fn();
    render(<ProjectFilter changeFilter={changeFilter} />);
    const filterButtons = screen.getAllByRole("button");
    fireEvent.click(filterButtons[1]);
    expect(changeFilter).toHaveBeenCalledWith("mine");
    fireEvent.click(filterButtons[2]);
    expect(changeFilter).toHaveBeenCalledWith("commerical"); // typo
  });

  // test for marking the active button as "active"
  it('should mark the active button as "active"', () => {
    render(<ProjectFilter changeFilter={() => {}} />);
    const filterButtons = screen.getAllByRole("button");
    expect(filterButtons[0]).toHaveClass("active");
    fireEvent.click(filterButtons[2]);
    expect(filterButtons[0]).not.toHaveClass("active");
    expect(filterButtons[2]).toHaveClass("active");
  });
});
