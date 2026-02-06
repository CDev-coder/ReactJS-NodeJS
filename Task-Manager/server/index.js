const express = require("express");
const cors = require("cors");
const { Client } = require("pg");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// PostgreSQL client - with trust auth (no password)
const client = new Client({
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || "todoapp",
  user: process.env.DB_USER || "postgres",
  // No password with trust auth
});

let dbConnected = false;

// Connect to database
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ PostgreSQL connection successful!");
    dbConnected = true;
    return true;
  } catch (error) {
    console.log("⚠️  Database connection failed:", error.message);
    console.log("💡 Using mock data for demo...");
    return false;
  }
}

// Mock data
const mockTasks = [
  {
    id: 1,
    title: "Complete interview project",
    description: "Build task manager",
    status: "in-progress",
    priority: "high",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Buy groceries",
    description: "Milk, eggs, bread",
    status: "pending",
    priority: "medium",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Prepare presentation",
    description: "Create slides",
    status: "completed",
    priority: "low",
    created_at: new Date().toISOString(),
  },
];

// Routes
app.get("/api/health", async (req, res) => {
  res.json({
    status: "OK",
    database: dbConnected ? "connected" : "mock",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/tasks", async (req, res) => {
  try {
    if (dbConnected) {
      const result = await client.query("SELECT * FROM tasks");
      res.json(result.rows);
    } else {
      res.json(mockTasks);
    }
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    res.json(mockTasks); // Fallback to mock
  }
});

app.post("/api/tasks", async (req, res) => {
  const {
    title,
    description,
    status = "pending",
    priority = "medium",
  } = req.body;

  try {
    if (dbConnected) {
      const result = await client.query(
        "INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *",
        [1, title, description, status, priority],
      );
      res.status(201).json(result.rows[0]);
    } else {
      const newTask = {
        id: mockTasks.length + 1,
        user_id: 1,
        title,
        description,
        status,
        priority,
        created_at: new Date().toISOString(),
      };
      mockTasks.push(newTask);
      res.status(201).json(newTask);
    }
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
});

app.put("/api/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id);
  const updates = req.body;

  try {
    if (dbConnected) {
      // Build dynamic update query
      const setClause = Object.keys(updates)
        .map((key, index) => `${key} = $${index + 2}`)
        .join(", ");

      const values = [taskId, ...Object.values(updates)];

      const result = await client.query(
        `UPDATE tasks SET ${setClause} WHERE id = $1 RETURNING *`,
        values,
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(result.rows[0]);
    } else {
      const taskIndex = mockTasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates };
      res.json(mockTasks[taskIndex]);
    }
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ error: "Failed to update task" });
  }
});

app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    if (dbConnected) {
      const result = await client.query(
        "DELETE FROM tasks WHERE id = $1 RETURNING *",
        [taskId],
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.status(204).send();
    } else {
      const taskIndex = mockTasks.findIndex((t) => t.id === taskId);

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      mockTasks.splice(taskIndex, 1);
      res.status(204).send();
    }
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start server
async function startServer() {
  // Try to connect to DB
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Health: http://localhost:${PORT}/api/health`);
    console.log(`📝 Tasks: http://localhost:${PORT}/api/tasks`);
    console.log(`💡 Database: ${dbConnected ? "Connected" : "Mock mode"}`);
  });
}

startServer().catch((error) => {
  console.error("❌ Failed to start server:", error);
  process.exit(1);
});
