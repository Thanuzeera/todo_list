import React from 'react';
import { Card, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { PencilSquare, Trash, CheckCircle, Circle } from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';

const TodoList = ({ todos, loading, onEdit, onDelete, onToggleStatus }) => {
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

  const getStatusIcon = (status) => {
    return status === 'completed' 
      ? <CheckCircle className="text-success" size={20} />
      : <Circle style={{ color: colors.primary }} size={20} />;
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
        <p>Start by adding your first todo using the "Add New Todo" button above.</p>
      </Alert>
    );
  }

  return (
    <div className="mt-4">
      <h3 className="mb-3" style={{ color: colors.primary }}>Your Todos ({todos.length})</h3>
      <Row>
        {todos.map((todo) => (
          <Col key={todo.id} md={6} lg={4} className="mb-3">
            <Card 
              className={`h-100 ${todo.status === 'completed' ? 'border-success' : 'border-primary'}`}
              style={{ borderColor: todo.status === 'completed' ? '#198754' : colors.primary }}
            >
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  {getStatusIcon(todo.status)}
                  <span className="ms-2">{getStatusBadge(todo.status)}</span>
                </div>
                <div>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-1"
                    onClick={() => onEdit(todo)}
                    title="Edit todo"
                    style={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    <PencilSquare size={16} />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => onDelete(todo.id)}
                    title="Delete todo"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                <Card.Title className={todo.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}>
                  {todo.title}
                </Card.Title>
                {todo.description && (
                  <Card.Text className={todo.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}>
                    {todo.description}
                  </Card.Text>
                )}
                <small className="text-muted">
                  Due: {formatDate(todo.due_date)}
                </small>
              </Card.Body>
              <Card.Footer>
                <Button
                  variant={todo.status === 'completed' ? 'outline-warning' : 'outline-success'}
                  size="sm"
                  onClick={() => onToggleStatus(todo.id, todo.status)}
                  className="w-100"
                  style={todo.status === 'completed' ? {} : { borderColor: colors.primary, color: colors.primary }}
                >
                  {todo.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default TodoList;
