-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS task_tags;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS users;

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(7) DEFAULT '#1976d2',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task-Tags junction table
CREATE TABLE task_tags (
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (task_id, tag_id)
);

-- Create indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);

-- Insert sample data
INSERT INTO users (email, password_hash) VALUES
  ('test@example.com', '$2b$10$YourHashedPasswordHere'); -- password: 'password123'

INSERT INTO tasks (user_id, title, description, status, priority, due_date) VALUES
  (1, 'Complete interview project', 'Build a full-stack task manager application', 'in-progress', 'high', '2024-01-15'),
  (1, 'Buy groceries', 'Milk, eggs, bread, fruits', 'pending', 'medium', '2024-01-10'),
  (1, 'Prepare presentation', 'Create slides for project demo', 'pending', 'high', '2024-01-12'),
  (1, 'Exercise', '30 minutes of cardio', 'completed', 'low', NULL);

INSERT INTO tags (name, color) VALUES
  ('work', '#ff6b6b'),
  ('personal', '#4ecdc4'),
  ('shopping', '#45b7d1'),
  ('health', '#96ceb4');

INSERT INTO task_tags (task_id, tag_id) VALUES
  (1, 1), -- Complete interview project -> work
  (2, 3), -- Buy groceries -> shopping
  (4, 4); -- Exercise -> health