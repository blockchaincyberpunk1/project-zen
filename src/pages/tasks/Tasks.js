import React, { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useCollection } from "../../hooks/useCollection";
import { useFirestore } from "../../hooks/useFirestore";
import { Card, Button } from "react-bootstrap";

// styles
import "./Tasks.css";

const Tasks = () => {
  const { user } = useAuthContext();
  const { documents: tasks, error } = useCollection(
    "tasks",
    ["assignedUsersList", "array-contains", user.uid],
    ["dueDate", "asc"]
  );
  const { addDocument, deleteDocument, updateDocument } = useFirestore("tasks");
  const [newTask, setNewTask] = useState({
    name: "",
    details: "",
    assignedUsersList: [user.uid],
    createdBy: user.uid,
    dueDate: "",
  });

  const formatDate = (date) => {
    const options = { month: "short", day: "numeric" };
    return new Date(date).toLocaleDateString("en-US", options);
  };

  const handleAddTask = () => {
    addDocument(newTask);
    setNewTask({
      name: "",
      details: "",
      assignedUsersList: [user.uid],
      createdBy: user.uid,
      dueDate: "",
    });
  };

  const handleDeleteTask = (id) => {
    deleteDocument(id);
  };

  const handleToggleCompletion = (id, isComplete) => {
    updateDocument(id, { isComplete: !isComplete });
  };

  return (
    <div className="tasks">
      <h2 className="page-title" style={{ marginBottom: "1rem" }}>
        Tasks
      </h2>
      {error && <p>{error}</p>}
      {tasks &&
        tasks.map((task) => (
          <Card
            key={task.id}
            className={task.isComplete ? "completed-task" : ""}
            style={{ marginBottom: "1rem" }}
          >
            <Card.Body>
              <Card.Title>
                <input
                  type="checkbox"
                  checked={task.isComplete}
                  onChange={() =>
                    handleToggleCompletion(task.id, task.isComplete)
                  }
                  style={{ marginRight: "1rem" }}
                />
                {task.name}
              </Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {formatDate(task.dueDate)}
              </Card.Subtitle>
              <Card.Text>{task.details}</Card.Text>
              <Button onClick={() => handleDeleteTask(task.id)}>Delete</Button>
            </Card.Body>
          </Card>
        ))}
      <div>
        <h2 className="page-title">Add New Task</h2>
        <label>
          Name:
          <input
            type="text"
            value={newTask.name}
            onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
          />
        </label>
        <br />
        <label>
          Details:
          <input
            type="text"
            value={newTask.details}
            onChange={(e) =>
              setNewTask({ ...newTask, details: e.target.value })
            }
          />
        </label>
        <br />
        <label>
          Due Date:
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) =>
              setNewTask({ ...newTask, dueDate: e.target.value })
            }
          />
        </label>
        <br />
        <Button onClick={handleAddTask}>Add Task</Button>
      </div>
    </div>
  );
};

export default Tasks;
