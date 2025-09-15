-- Create database
CREATE DATABASE IF NOT EXISTS todo_app;
USE todo_app;

-- Create todos table
CREATE TABLE IF NOT EXISTS todos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE,
    category VARCHAR(50) DEFAULT 'general',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    status ENUM('pending', 'completed') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert some sample data (optional)
INSERT INTO todos (title, description, due_date, category, priority, status) VALUES
('Complete project documentation', 'Write comprehensive documentation for the todo app project', '2024-01-15', 'work', 'high', 'pending'),
('Review code', 'Review the backend API code for any improvements', '2024-01-10', 'work', 'medium', 'completed'),
('Setup database', 'Configure MySQL database connection', '2024-01-08', 'work', 'high', 'completed'),
('Buy groceries', 'Get milk, bread, and vegetables', CURDATE(), 'personal', 'medium', 'pending'),
('Call mom', 'Weekly check-in call', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'personal', 'low', 'pending'),
('Gym workout', 'Cardio and strength training', DATE_ADD(CURDATE(), INTERVAL 1 DAY), 'health', 'medium', 'pending');
