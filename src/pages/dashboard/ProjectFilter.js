import { useState } from "react";

// Array of objects that includes both filter name and display label
const filterList = [
  { name: "all", label: "All" },
  { name: "mine", label: "Mine" },
  { name: "commerical", label: "Commercial" },
  { name: "multi-family", label: "Multi-family" },
  { name: "residential", label: "Residential" },
  { name: "industrial", label: "Industrial" },
];

// Component for the project filter
export default function ProjectFilter({ changeFilter }) {
  // The current filter is stored in state and initially set to 'all'
  const [currentFilter, setCurrentFilter] = useState("all");

  // This function is called when the user clicks a filter button
  const handleClick = (filterName) => {
    // The current filter is passed directly to the handleClick function
    changeFilter(filterName);
    // The main filter state is updated
    setCurrentFilter(filterName);
  };

  // The filter buttons are rendered based on the filterList
  return (
    <div className="project-filter">
      <nav>
        <p>Filter by: </p>
        {filterList.map((filter) => (
          <button
            key={filter.name}
            // When clicked, the corresponding handleClick function is called with the new filter value
            onClick={() => handleClick(filter.name)}
            // The "active" class is added to the currently selected filter button
            className={currentFilter === filter.name ? "active" : ""}
          >
            {filter.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
