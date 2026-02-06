import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import { Add, Delete, FilterList } from "@mui/icons-material";
import { taskAPI } from "../services/api";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "medium",
  });
  const [filters, setFilters] = useState({ status: "", priority: "" });

  // Fetch tasks on component mount and when filters change
  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await taskAPI.getAll(filters);
      console.log("Fetched tasks:", response.data);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Failed to load tasks. Please check backend connection.");
      // Keep existing tasks if we have them
      if (tasks.length === 0) {
        setTasks([
          {
            id: 1,
            title: "Complete interview project",
            description: "Build task manager app",
            status: "in-progress",
            priority: "high",
          },
          {
            id: 2,
            title: "Buy groceries",
            description: "Milk, eggs, bread",
            status: "pending",
            priority: "medium",
          },
          {
            id: 3,
            title: "Prepare presentation",
            description: "Create slides",
            status: "completed",
            priority: "low",
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      setError("Task title is required");
      return;
    }

    try {
      const response = await taskAPI.create(newTask);
      console.log("Added task:", response.data);
      setTasks([...tasks, response.data]);
      setNewTask({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
      });
      setError("");
    } catch (error) {
      console.error("Error adding task:", error);
      setError("Failed to add task. Please try again.");
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
      setError("Failed to delete task.");
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await taskAPI.update(id, { status });
      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, status } : task)),
      );
    } catch (error) {
      console.error("Error updating task:", error);
      setError("Failed to update task status.");
    }
  };

  const handleUpdatePriority = async (id, priority) => {
    try {
      await taskAPI.update(id, { priority });
      setTasks(
        tasks.map((task) => (task.id === id ? { ...task, priority } : task)),
      );
    } catch (error) {
      console.error("Error updating priority:", error);
      setError("Failed to update task priority.");
    }
  };

  // Filter tasks based on status and priority filters
  const filteredTasks = tasks.filter((task) => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.priority && task.priority !== filters.priority) return false;
    return true;
  });

  if (loading && tasks.length === 0) {
    return (
      <Container maxWidth="md">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="80vh"
        >
          <CircularProgress />
          <Typography variant="h6" sx={{ ml: 2 }}>
            Loading tasks...
          </Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom color="primary">
          📝 Task Manager
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {/* Add Task Form */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Add New Task
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Task Title *"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                variant="outlined"
                required
                placeholder="What needs to be done?"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                variant="outlined"
                multiline
                rows={2}
                placeholder="Add details..."
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={newTask.status}
                  label="Status"
                  onChange={(e) =>
                    setNewTask({ ...newTask, status: e.target.value })
                  }
                >
                  <MenuItem value="pending">⏳ Pending</MenuItem>
                  <MenuItem value="in-progress">🚧 In Progress</MenuItem>
                  <MenuItem value="completed">✅ Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={newTask.priority}
                  label="Priority"
                  onChange={(e) =>
                    setNewTask({ ...newTask, priority: e.target.value })
                  }
                >
                  <MenuItem value="low">🟢 Low</MenuItem>
                  <MenuItem value="medium">🟡 Medium</MenuItem>
                  <MenuItem value="high">🔴 High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={handleAddTask}
                fullWidth
                size="large"
                sx={{ mt: 1 }}
              >
                Add Task
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Filters */}
        <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom color="text.secondary">
            Filter Tasks
          </Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <MenuItem value="">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="in-progress">In Progress</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filters.priority}
                  label="Priority"
                  onChange={(e) =>
                    setFilters({ ...filters, priority: e.target.value })
                  }
                >
                  <MenuItem value="">All Priority</MenuItem>
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setFilters({ status: "", priority: "" })}
                fullWidth
              >
                Clear Filters
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Task List */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tasks ({filteredTasks.length})
            {filters.status || filters.priority ? " (filtered)" : ""}
          </Typography>
        </Box>

        {filteredTasks.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">
              {tasks.length === 0
                ? "No tasks found. Add your first task above!"
                : "No tasks match your filters. Try changing filter criteria."}
            </Typography>
          </Paper>
        ) : (
          filteredTasks.map((task) => (
            <Card
              key={task.id}
              sx={{
                mb: 2,
                "&:hover": {
                  boxShadow: 6,
                  transform: "translateY(-2px)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                },
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
            >
              <CardContent>
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      {task.title}
                    </Typography>
                    <Typography color="textSecondary" paragraph>
                      {task.description || "No description provided"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                      <Chip
                        label={task.status}
                        color={
                          task.status === "completed"
                            ? "success"
                            : task.status === "in-progress"
                              ? "warning"
                              : "default"
                        }
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        label={`Priority: ${task.priority}`}
                        color={
                          task.priority === "high"
                            ? "error"
                            : task.priority === "medium"
                              ? "warning"
                              : "success"
                        }
                        size="small"
                        variant="outlined"
                      />
                      {task.due_date && (
                        <Chip
                          label={`Due: ${new Date(task.due_date).toLocaleDateString()}`}
                          size="small"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "row", md: "column" },
                        gap: 1,
                        justifyContent: "flex-end",
                        alignItems: { xs: "center", md: "flex-end" },
                      }}
                    >
                      <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                          value={task.status}
                          onChange={(e) =>
                            handleUpdateStatus(task.id, e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="in-progress">In Progress</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl
                        size="small"
                        sx={{ minWidth: 120, mt: { md: 1 } }}
                      >
                        <Select
                          value={task.priority}
                          onChange={(e) =>
                            handleUpdatePriority(task.id, e.target.value)
                          }
                          size="small"
                        >
                          <MenuItem value="low">Low</MenuItem>
                          <MenuItem value="medium">Medium</MenuItem>
                          <MenuItem value="high">High</MenuItem>
                        </Select>
                      </FormControl>

                      <IconButton
                        color="error"
                        onClick={() => handleDeleteTask(task.id)}
                        aria-label="delete"
                        sx={{ mt: { md: 1 } }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))
        )}

        {/* Refresh Button */}
        <Box sx={{ mt: 4, textAlign: "center" }}>
          <Button variant="outlined" onClick={fetchTasks} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : "Refresh Tasks"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default TaskManager;
