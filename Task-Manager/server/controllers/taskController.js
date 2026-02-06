const { Task } = require("../models/index");

const taskController = {
  getAllTasks: async (req, res) => {
    try {
      const tasks = await Task.findAll();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getTaskById: async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createTask: async (req, res) => {
    try {
      const task = await Task.create({ ...req.body, userId: 1 });
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateTask: async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      await task.update(req.body);
      res.json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteTask: async (req, res) => {
    try {
      const task = await Task.findByPk(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      await task.destroy();
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = taskController;
