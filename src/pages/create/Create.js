// Import necessary modules and hooks
import { useState, useEffect } from "react";
import { useCollection } from "../../hooks/useCollection";
import { useAuthContext } from "../../hooks/useAuthContext";
import { timestamp } from "../../firebase/config";
import { useFirestore } from "../../hooks/useFirestore";
import { useHistory } from "react-router";
import Select from "react-select";

// Import CSS styles
import "./Create.css";

// Define project categories for react-select
const categories = [
  { value: "industrial", label: "Industrial" },
  { value: "commerical", label: "Commerical" },
  { value: "multi-family", label: "Multi-family" },
  { value: "residential", label: "Residential" },
];

export default function Create() {
  // Initialize hooks
  const history = useHistory();
  const { addDocument, response } = useFirestore("projects");
  const { user } = useAuthContext();
  const { documents } = useCollection("users");
  const [users, setUsers] = useState([]);

  // Initialize form field values
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [formError, setFormError] = useState(null);

  // Create user options for react-select
  useEffect(() => {
    if (documents) {
      setUsers(
        documents.map((user) => ({
          value: { ...user, id: user?.id },
          label: user?.displayName,
        }))
      );
    }
  }, [documents]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    // Validate form data
    if (!category) {
      setFormError("Please select a project category.");
      return;
    }
    if (assignedUsers.length < 1) {
      setFormError("Please assign the project to at least 1 user");
      return;
    }

    // Build project data object
    const assignedUsersList = assignedUsers.map((u) => ({
      displayName: u?.value?.displayName,
      photoURL: u?.value?.photoURL,
      id: u?.value?.id,
    }));

    const createdBy = {
      displayName: user?.displayName,
      photoURL: user?.photoURL,
      id: user?.uid,
    };

    const project = {
      name,
      details,
      assignedUsersList,
      createdBy,
      category: category?.value,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      comments: [],
    };

    // Add project to database
    await addDocument(project);
    if (!response.error) {
      history.push("/");
    }
  };

 return (
  <div className="create-form">
    <h2 className="page-title">Create a new Project</h2>
    <form onSubmit={handleSubmit}>
      {/* Label and input for project name */}
      <label htmlFor="name">
        <span>Project name:</span>
        <input
          required
          type="text"
          id="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
      </label>
      {/* Label and input for project details */}
      <label htmlFor="details">
        <span>Project Details:</span>
        <textarea
          required
          id="details"
          onChange={(e) => setDetails(e.target.value)}
          value={details}
        ></textarea>
      </label>
      {/* Label and input for project due date */}
      <label htmlFor="due-date">
        <span>Set due date:</span>
        <input
          required
          type="date"
          id="due-date"
          onChange={(e) => setDueDate(e.target.value)}
          value={dueDate}
          min={new Date().toISOString().split("T")[0]}
        />
      </label>
      {/* Label and select input for project category */}
      <label htmlFor="category">
        <span>Project category:</span>
        <Select
          id="category"
          onChange={(option) => setCategory(option)}
          options={categories}
        />
      </label>
      {/* Label and select input for assigned users */}
      <label htmlFor="assigned-users">
        <span>Assign to:</span>
        <Select
          id="assigned-users"
          onChange={(option) => setAssignedUsers(option)}
          options={users}
          isMulti
        />
      </label>

      {/* Submit button */}
      <button className="btn">Add Project</button>

      {/* Error message if there's a form error */}
      {formError ? <p className="error">{formError}</p> : null}
    </form>
  </div>
);

}
