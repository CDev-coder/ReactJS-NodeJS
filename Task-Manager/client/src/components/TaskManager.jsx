import React, { useState, useEffect } from "react";
import { taskAPI } from "../services/api";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll();
      console.log("Tasks API response:", response);
      setTasks(response.data || response);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      // Fallback data
      setTasks([
        { id: 1, title: "Test Task 1", status: "pending" },
        { id: 2, title: "Test Task 2", status: "completed" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Task Manager</h1>
      <p>Total tasks: {tasks.length}</p>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <strong>{task.title}</strong> - {task.status}
          </li>
        ))}
      </ul>

      <button onClick={() => fetchTasks()}>Refresh Tasks</button>
    </div>
  );
};

export default TaskManager;
