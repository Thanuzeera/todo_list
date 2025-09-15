const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Connect to database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Routes

// GET /todos - fetch all todos with optional filters
app.get('/todos', (req, res) => {
  const { category, status, priority, filter } = req.query;
  let query = 'SELECT * FROM todos WHERE 1=1';
  const values = [];
  
  // Apply filters
  if (category) {
    query += ' AND category = ?';
    values.push(category);
  }
  
  if (status) {
    query += ' AND status = ?';
    values.push(status);
  }
  
  if (priority) {
    query += ' AND priority = ?';
    values.push(priority);
  }
  
  // Time-based filters
  if (filter === 'today') {
    query += ' AND DATE(due_date) = CURDATE()';
  } else if (filter === 'thisweek') {
    query += ' AND YEARWEEK(due_date, 1) = YEARWEEK(CURDATE(), 1)';
  } else if (filter === 'thismonth') {
    query += ' AND YEAR(due_date) = YEAR(CURDATE()) AND MONTH(due_date) = MONTH(CURDATE())';
  }
  
  query += ' ORDER BY priority DESC, created_at DESC';
  
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error fetching todos:', err);
      return res.status(500).json({ error: 'Failed to fetch todos' });
    }
    res.json(results);
  });
});

// GET /todos/:id - fetch a single todo by ID
app.get('/todos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'SELECT * FROM todos WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching todo:', err);
      return res.status(500).json({ error: 'Failed to fetch todo' });
    }
    
    if (results.length === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(results[0]);
  });
});

// POST /todos - add a new todo
app.post('/todos', (req, res) => {
  const { title, description, due_date, category, priority } = req.body;
  
  // Validation
  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }
  
  const query = 'INSERT INTO todos (title, description, due_date, category, priority, status) VALUES (?, ?, ?, ?, ?, ?)';
  const values = [title.trim(), description || '', due_date || null, category || 'general', priority || 'medium', 'pending'];
  
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error creating todo:', err);
      return res.status(500).json({ error: 'Failed to create todo' });
    }
    
    res.status(201).json({
      id: results.insertId,
      title: title.trim(),
      description: description || '',
      due_date: due_date || null,
      category: category || 'general',
      priority: priority || 'medium',
      status: 'pending',
      message: 'Todo created successfully'
    });
  });
});

// PUT /todos/:id - update a todo
app.put('/todos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, due_date, category, priority, status } = req.body;
  
  // Validation
  if (title !== undefined && (!title || title.trim() === '')) {
    return res.status(400).json({ error: 'Title cannot be empty' });
  }
  
  if (status && !['pending', 'completed'].includes(status)) {
    return res.status(400).json({ error: 'Status must be either "pending" or "completed"' });
  }
  
  // Build dynamic query based on provided fields
  const updateFields = [];
  const values = [];
  
  if (title !== undefined) {
    updateFields.push('title = ?');
    values.push(title.trim());
  }
  if (description !== undefined) {
    updateFields.push('description = ?');
    values.push(description || '');
  }
  if (due_date !== undefined) {
    updateFields.push('due_date = ?');
    values.push(due_date || null);
  }
  if (category !== undefined) {
    updateFields.push('category = ?');
    values.push(category);
  }
  if (priority !== undefined) {
    updateFields.push('priority = ?');
    values.push(priority);
  }
  if (status !== undefined) {
    updateFields.push('status = ?');
    values.push(status);
  }
  
  if (updateFields.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }
  
  values.push(id);
  const query = `UPDATE todos SET ${updateFields.join(', ')} WHERE id = ?`;
  
  db.query(query, values, (err, results) => {
    if (err) {
      console.error('Error updating todo:', err);
      return res.status(500).json({ error: 'Failed to update todo' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Fetch the updated todo to return complete data
    const fetchQuery = 'SELECT * FROM todos WHERE id = ?';
    db.query(fetchQuery, [id], (fetchErr, fetchResults) => {
      if (fetchErr) {
        console.error('Error fetching updated todo:', fetchErr);
        return res.status(500).json({ error: 'Failed to fetch updated todo' });
      }
      
      if (fetchResults.length === 0) {
        return res.status(404).json({ error: 'Todo not found after update' });
      }
      
      res.json({
        ...fetchResults[0],
        message: 'Todo updated successfully'
      });
    });
  });
});

// DELETE /todos/:id - delete a todo
app.delete('/todos/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM todos WHERE id = ?';
  
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error deleting todo:', err);
      return res.status(500).json({ error: 'Failed to delete todo' });
    }
    
    if (results.affectedRows === 0) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json({ message: 'Todo deleted successfully' });
  });
});

// GET /dashboard - get dashboard statistics
app.get('/dashboard', (req, res) => {
  const queries = {
    total: 'SELECT COUNT(*) as count FROM todos',
    completed: 'SELECT COUNT(*) as count FROM todos WHERE status = "completed"',
    pending: 'SELECT COUNT(*) as count FROM todos WHERE status = "pending"',
    today: 'SELECT COUNT(*) as count FROM todos WHERE DATE(due_date) = CURDATE()',
    thisWeek: 'SELECT COUNT(*) as count FROM todos WHERE YEARWEEK(due_date, 1) = YEARWEEK(CURDATE(), 1)',
    thisMonth: 'SELECT COUNT(*) as count FROM todos WHERE YEAR(due_date) = YEAR(CURDATE()) AND MONTH(due_date) = MONTH(CURDATE())',
    byCategory: 'SELECT category, COUNT(*) as count FROM todos GROUP BY category',
    byPriority: 'SELECT priority, COUNT(*) as count FROM todos GROUP BY priority',
    recent: 'SELECT * FROM todos ORDER BY created_at DESC LIMIT 5'
  };
  
  const results = {};
  let completedQueries = 0;
  const totalQueries = Object.keys(queries).length;
  
  Object.keys(queries).forEach(key => {
    db.query(queries[key], (err, data) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        return res.status(500).json({ error: `Failed to fetch ${key} data` });
      }
      
      if (key === 'recent') {
        results[key] = data;
      } else if (key === 'byCategory' || key === 'byPriority') {
        results[key] = data;
      } else {
        results[key] = data[0].count;
      }
      
      completedQueries++;
      if (completedQueries === totalQueries) {
        res.json(results);
      }
    });
  });
});

// GET /categories - get all available categories
app.get('/categories', (req, res) => {
  const query = 'SELECT DISTINCT category FROM todos ORDER BY category';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching categories:', err);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    res.json(results.map(row => row.category));
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
