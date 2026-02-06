const express = require("express");
const router = express.Router();
const { Task } = require("../models/index");

// GET all tasks
router.get("/", async (req, res) => {
  try {
    const { status, priority, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (priority) where.priority = priority;

    const tasks = await Task.findAll({ where });
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// GET single task
router.get("/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// POST create task
router.post("/", async (req, res) => {
  try {
    // For demo, hardcode user_id as 1
    const taskData = { ...req.body, userId: 1 };
    const task = await Task.create(taskData);
    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(400).json({ error: "Failed to create task" });
  }
});

// PUT update task
router.put("/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.update(req.body);
    res.json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(400).json({ error: "Failed to update task" });
  }
});

// DELETE task
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    await task.destroy();
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

module.exports = router;
