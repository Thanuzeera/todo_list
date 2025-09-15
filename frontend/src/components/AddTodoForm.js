import React, { useState } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { useTheme } from '../contexts/ThemeContext';

const AddTodoForm = ({ onSubmit, onCancel }) => {
  const { colors } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: '',
    category: 'general',
    priority: 'medium'
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.due_date && new Date(formData.due_date) < new Date()) {
      newErrors.due_date = 'Due date cannot be in the past';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      setFormData({ title: '', description: '', due_date: '', category: 'general', priority: 'medium' });
      setErrors({});
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h4 className="mb-0">Add New Todo</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter todo title"
                  isInvalid={!!errors.title}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.title}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter todo description (optional)"
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Due Date</Form.Label>
                <Form.Control
                  type="date"
                  name="due_date"
                  value={formData.due_date}
                  onChange={handleChange}
                  isInvalid={!!errors.due_date}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.due_date}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general">General</option>
                  <option value="work">Work</option>
                  <option value="personal">Personal</option>
                  <option value="health">Health</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Priority</Form.Label>
                <Form.Select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          
          <div className="d-flex gap-2">
            <Button type="submit" style={{ backgroundColor: colors.primary, borderColor: colors.primary }}>
              Add Todo
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AddTodoForm;
