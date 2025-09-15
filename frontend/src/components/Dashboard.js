import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Spinner, Alert, ProgressBar, ListGroup } from 'react-bootstrap';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  CalendarWeek, 
  CalendarMonth,
  Trophy,
//   TrendingUp
} from 'react-bootstrap-icons';
import { todoAPI } from '../services/api';
import { GraphUp } from "react-bootstrap-icons";
import { useTheme } from '../contexts/ThemeContext';


const Dashboard = () => {
  const { colors } = useTheme();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoAPI.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!dashboardData) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Data</Alert.Heading>
        <p>No dashboard data available.</p>
      </Alert>
    );
  }

  const completionRate = dashboardData.total > 0 
    ? Math.round((dashboardData.completed / dashboardData.total) * 100) 
    : 0;

  return (
    <div className="mt-4">
      <h2 className="mb-4">
        <Trophy className="me-2" />
        Dashboard Overview
      </h2>

      {/* Main Statistics */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.primary }}>
                <GraphUp size={30} />
              </Card.Title>
              <Card.Text className="h4">{dashboardData.total}</Card.Text>
              <Card.Text className="text-muted">Total Todos</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.primary }}>
                <CheckCircle size={30} />
              </Card.Title>
              <Card.Text className="h4">{dashboardData.completed}</Card.Text>
              <Card.Text className="text-muted">Completed</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.primary }}>
                <Clock size={30} />
              </Card.Title>
              <Card.Text className="h4">{dashboardData.pending}</Card.Text>
              <Card.Text className="text-muted">Pending</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.primary }}>
                <Trophy size={30} />
              </Card.Title>
              <Card.Text className="h4">{completionRate}%</Card.Text>
              <Card.Text className="text-muted">Completion Rate</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress Bar */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Overall Progress</h5>
            </Card.Header>
            <Card.Body>
              <ProgressBar 
                now={completionRate} 
                label={`${completionRate}%`}
                variant="success"
                className="mb-2"
              />
              <small className="text-muted">
                {dashboardData.completed} of {dashboardData.total} todos completed
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Time-based Statistics */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.primary }}>
                <Calendar size={30} />
              </Card.Title>
              <Card.Text className="h4">{dashboardData.today}</Card.Text>
              <Card.Text className="text-muted">Due Today</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.primary }}>
                <CalendarWeek size={30} />
              </Card.Title>
              <Card.Text className="h4">{dashboardData.thisWeek}</Card.Text>
              <Card.Text className="text-muted">This Week</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title style={{ color: colors.primary }}>
                <CalendarMonth size={30} />
              </Card.Title>
              <Card.Text className="h4">{dashboardData.thisMonth}</Card.Text>
              <Card.Text className="text-muted">This Month</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Category and Priority Breakdown */}
      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">By Category</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {dashboardData.byCategory?.map((item, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between">
                    <span className="text-capitalize">{item.category}</span>
                    <span className="badge" style={{ backgroundColor: colors.primary }}>{item.count}</span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">By Priority</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                {dashboardData.byPriority?.map((item, index) => (
                  <ListGroup.Item key={index} className="d-flex justify-content-between">
                    <span className="text-capitalize">{item.priority}</span>
                    <span className={`badge ${item.priority === 'high' ? 'bg-danger' : item.priority === 'medium' ? 'bg-warning' : ''}`} style={item.priority === 'low' ? { backgroundColor: colors.primary } : {}}>
                      {item.count}
                    </span>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Todos */}
      {dashboardData.recent && dashboardData.recent.length > 0 && (
        <Row className="mt-4">
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Todos</h5>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  {dashboardData.recent.map((todo) => (
                    <ListGroup.Item key={todo.id} className="d-flex justify-content-between align-items-center">
                      <div>
                        <span className={todo.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}>
                          {todo.title}
                        </span>
                        <br />
                        <small className="text-muted">
                          {new Date(todo.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      <span className={`badge ${todo.status === 'completed' ? 'bg-success' : ''}`} style={todo.status === 'completed' ? {} : { backgroundColor: colors.primary }}>
                        {todo.status}
                      </span>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Dashboard;
