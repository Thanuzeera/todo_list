import React from 'react';
import { Table, Badge, Button, Spinner, Alert, Row, Col, Form } from 'react-bootstrap';
import { PencilSquare, Trash, CheckCircle, Circle } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';

const TodoListView = ({ 
  todos, 
  loading, 
  onEdit, 
  onDelete, 
  onToggleStatus, 
  filters, 
  onFilterChange 
}) => {
  const { colors } = useTheme();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    return status === 'completed' 
      ? <Badge bg="success">Completed</Badge>
      : <Badge style={{ backgroundColor: colors.primary }}>Pending</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      medium: 'warning',
      low: 'secondary'
    };
    return <Badge bg={variants[priority]}>{priority.toUpperCase()}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const colors = {
      work: 'primary',
      personal: 'info',
      health: 'success',
      general: 'secondary'
    };
    return <Badge bg={colors[category] || 'secondary'}>{category}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading todos...</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <Alert variant="info" className="mt-4">
        <Alert.Heading>No todos found!</Alert.Heading>
        <p>Try adjusting your filters or add a new todo.</p>
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      {/* Filters */}
      <Row className="mb-3">
        <Col md={3}>
          <Form.Select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="work">Work</option>
            <option value="personal">Personal</option>
            <option value="health">Health</option>
            <option value="general">General</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select
            value={filters.priority || ''}
            onChange={(e) => onFilterChange('priority', e.target.value)}
          >
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Button 
            variant="outline-secondary" 
            onClick={() => onFilterChange('clear', '')}
            size="sm"
          >
            Clear Filters
          </Button>
        </Col>
      </Row>

      {/* Todo List Table */}
      <Table responsive striped hover>
        <thead>
          <tr>
            <th>Status</th>
            <th>Title</th>
            <th>Description</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Due Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {todos.map((todo) => (
            <tr key={todo.id} className={todo.status === 'completed' ? 'table-secondary' : ''}>
              <td>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => onToggleStatus(todo.id, todo.status)}
                  className="p-0"
                >
                  {todo.status === 'completed' ? (
                    <CheckCircle className="text-success" size={20} />
                  ) : (
                    <Circle style={{ color: colors.primary }} size={20} />
                  )}
                </Button>
              </td>
              <td>
                <span className={todo.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}>
                  {todo.title}
                </span>
              </td>
              <td>
                <span className={todo.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}>
                  {todo.description || '-'}
                </span>
              </td>
              <td>{getCategoryBadge(todo.category)}</td>
              <td>{getPriorityBadge(todo.priority)}</td>
              <td>{formatDate(todo.due_date)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-1"
                  onClick={() => onEdit(todo)}
                  title="Edit todo"
                  style={{ borderColor: colors.primary, color: colors.primary }}
                >
                  <PencilSquare size={14} />
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => onDelete(todo.id)}
                  title="Delete todo"
                >
                  <Trash size={14} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TodoListView;
