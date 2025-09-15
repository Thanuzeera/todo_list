import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import './themes.css';

// Import components
import Navigation from './components/Navigation';
import TodoList from './components/TodoList';
import TodoListView from './components/TodoListView';
import AddTodoForm from './components/AddTodoForm';
import EditTodoForm from './components/EditTodoForm';
import Dashboard from './components/Dashboard';
import Rewards from './components/Rewards';

// Import API service
import { todoAPI } from './services/api';

// Import Theme Provider
import { ThemeProvider, useTheme } from './contexts/ThemeContext';

function AppContent() {
  const { colors } = useTheme();
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const [activeView, setActiveView] = useState('list');
  const [filters, setFilters] = useState({});

  // Fetch todos on component mount and when filters change
  useEffect(() => {
    fetchTodos();
  }, [filters, activeView]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let queryFilters = { ...filters };
      
      // Apply time-based filters based on active view
      if (activeView === 'today') {
        queryFilters.filter = 'today';
      } else if (activeView === 'thisweek') {
        queryFilters.filter = 'thisweek';
      } else if (activeView === 'thismonth') {
        queryFilters.filter = 'thismonth';
      }
      
      const data = await todoAPI.getAllTodos(queryFilters);
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos. Please check if the backend server is running.');
      console.error('Error fetching todos:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (todoData) => {
    try {
      const newTodo = await todoAPI.createTodo(todoData);
      setTodos([newTodo, ...todos]);
      setShowAddForm(false);
      setError(null);
    } catch (err) {
      setError('Failed to create todo. Please try again.');
      console.error('Error creating todo:', err);
    }
  };

  const handleUpdateTodo = async (id, todoData) => {
    try {
      const updatedTodo = await todoAPI.updateTodo(id, todoData);
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setEditingTodo(null);
      setError(null);
    } catch (err) {
      setError('Failed to update todo. Please try again.');
      console.error('Error updating todo:', err);
    }
  };

  const handleDeleteTodo = async (id) => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      try {
        await todoAPI.deleteTodo(id);
        setTodos(todos.filter(todo => todo.id !== id));
        setError(null);
      } catch (err) {
        setError('Failed to delete todo. Please try again.');
        console.error('Error deleting todo:', err);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    try {
      const updatedTodo = await todoAPI.updateTodo(id, { status: newStatus });
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
      setError(null);
    } catch (err) {
      setError('Failed to update todo status. Please try again.');
      console.error('Error updating todo status:', err);
    }
  };

  const handleViewChange = (view) => {
    setActiveView(view);
    setShowAddForm(false);
    setEditingTodo(null);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'clear') {
      setFilters({});
    } else {
      setFilters(prev => ({
        ...prev,
        [filterType]: value || undefined
      }));
    }
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard />;
      case 'rewards':
        return <Rewards />;
      case 'list':
      case 'today':
      case 'thisweek':
      case 'thismonth':
      default:
        return (
          <>
            {showAddForm && (
              <AddTodoForm
                onSubmit={handleAddTodo}
                onCancel={() => setShowAddForm(false)}
              />
            )}

            {editingTodo && (
              <EditTodoForm
                todo={editingTodo}
                onSubmit={(todoData) => handleUpdateTodo(editingTodo.id, todoData)}
                onCancel={() => setEditingTodo(null)}
              />
            )}

            <TodoListView
              todos={todos}
              loading={loading}
              onEdit={setEditingTodo}
              onDelete={handleDeleteTodo}
              onToggleStatus={handleToggleStatus}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </>
        );
    }
  };

  return (
    <div className="App">
      <Navigation activeView={activeView} onViewChange={handleViewChange} />
      <Container>
        <Row>
          <Col>
            {activeView !== 'dashboard' && activeView !== 'rewards' && (
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 style={{ color: colors.primary }}>
                  {activeView === 'list' && 'All Todos'}
                  {activeView === 'today' && 'Today\'s Todos'}
                  {activeView === 'thisweek' && 'This Week\'s Todos'}
                  {activeView === 'thismonth' && 'This Month\'s Todos'}
                </h1>
                <Button 
                  style={{ backgroundColor: colors.primary, borderColor: colors.primary }}
                  onClick={() => setShowAddForm(true)}
                  disabled={showAddForm || editingTodo}
                >
                  Add New Todo
                </Button>
              </div>
            )}

            {error && (
              <Alert variant="danger" dismissible onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {renderContent()}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;