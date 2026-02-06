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
} from "@mui/material";
import { Add, Delete, Edit, FilterList } from "@mui/icons-material";
import { taskAPI } from "../services/api";

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [filters, setFilters] = useState({ status: "", priority: "" });

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getAll(filters);
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      const response = await taskAPI.create(newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: "", description: "" });
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task:", error);
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
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Task Manager
        </Typography>

        {/* Add Task Form */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Task Title"
                  value={newTask.title}
                  onChange={(e) =>
                    setNewTask({ ...newTask, title: e.target.value })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Description"
                  value={newTask.description}
                  onChange={(e) =>
                    setNewTask({ ...newTask, description: e.target.value })
                  }
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={handleAddTask}
                  fullWidth
                >
                  Add Task
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
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
                    <MenuItem value="">All</MenuItem>
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
                    <MenuItem value="">All</MenuItem>
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
          </CardContent>
        </Card>

        {/* Task List */}
        {tasks.map((task) => (
          <Card key={task.id} sx={{ mb: 2 }}>
            <CardContent>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={8}>
                  <Typography variant="h6">{task.title}</Typography>
                  <Typography color="textSecondary" gutterBottom>
                    {task.description}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
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
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={task.priority}
                      color={
                        task.priority === "high"
                          ? "error"
                          : task.priority === "medium"
                            ? "warning"
                            : "success"
                      }
                      size="small"
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={4}
                  container
                  justifyContent="flex-end"
                  spacing={1}
                >
                  <Select
                    value={task.status}
                    onChange={(e) =>
                      handleUpdateStatus(task.id, e.target.value)
                    }
                    size="small"
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="in-progress">In Progress</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                  </Select>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    <Delete />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Container>
  );
};

export default TaskManager;
