# setup-database.ps1
Write-Host "Setting up Task Manager Database..." -ForegroundColor Green

# 1. Check Docker is running
Write-Host "`n1. Checking Docker..." -ForegroundColor Yellow
docker-compose ps

# 2. Create simple schema
Write-Host "`n2. Creating tables..." -ForegroundColor Yellow
$schema = @"
-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create tasks table  
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  priority VARCHAR(20) NOT NULL DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"@

# Execute schema
$schema -split ";" | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
    docker-compose exec postgres psql -U postgres -d todoapp -c "$_"
}

# 3. Insert sample data
Write-Host "`n3. Inserting sample data..." -ForegroundColor Yellow
$sampleData = @"
-- Insert a test user (password: 'password123')
INSERT INTO users (email, password_hash) VALUES 
('test@example.com', '\$2b\$10\$dXJ3SW6G7P50lGmMkkmwe.20cQQubK3.HYWzG3YB1tlRy.fqvM/BG')
ON CONFLICT (email) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (user_id, title, description, status, priority) VALUES
(1, 'Complete interview project', 'Build a full-stack task manager', 'in-progress', 'high'),
(1, 'Buy groceries', 'Milk, eggs, bread, fruits', 'pending', 'medium'),
(1, 'Prepare presentation', 'Create slides for project demo', 'completed', 'low')
ON CONFLICT DO NOTHING;
"@

$sampleData -split ";" | Where-Object { $_.Trim() -ne "" } | ForEach-Object {
    docker-compose exec postgres psql -U postgres -d todoapp -c "$_"
}

# 4. Verify
Write-Host "`n4. Verifying setup..." -ForegroundColor Yellow
docker-compose exec postgres psql -U postgres -d todoapp -c "\dt"
docker-compose exec postgres psql -U postgres -d todoapp -c "SELECT COUNT(*) as user_count FROM users;"
docker-compose exec postgres psql -U postgres -d todoapp -c "SELECT COUNT(*) as task_count FROM tasks;"
docker-compose exec postgres psql -U postgres -d todoapp -c "SELECT id, title, status FROM tasks;"

Write-Host "`n✅ Database setup complete!" -ForegroundColor Green