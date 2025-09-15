import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Badge, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { 
  Trophy, 
  Star, 
  Award, 
  Bullseye, 
  CheckCircle,
  Fire,
  LightningFill
} from 'react-bootstrap-icons';
import { todoAPI } from '../services/api';

const Rewards = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    calculateAchievements();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await todoAPI.getDashboardData();
      setDashboardData(data);
    } catch (err) {
      setError('Failed to load rewards data');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateAchievements = () => {
    const newAchievements = [
      {
        id: 'first_todo',
        title: 'Getting Started',
        description: 'Create your first todo',
        icon: Star,
        condition: (data) => data.total >= 1,
        reward: 10,
        color: 'primary'
      },
      {
        id: 'completion_master',
        title: 'Completion Master',
        description: 'Complete 10 todos',
        icon: CheckCircle,
        condition: (data) => data.completed >= 10,
        reward: 50,
        color: 'success'
      },
      {
        id: 'productivity_guru',
        title: 'Productivity Guru',
        description: 'Complete 50 todos',
        icon: Trophy,
        condition: (data) => data.completed >= 50,
        reward: 100,
        color: 'warning'
      },
      {
        id: 'streak_keeper',
        title: 'Streak Keeper',
        description: 'Complete 5 todos in a week',
        icon: Fire,
        condition: (data) => data.thisWeek >= 5,
        reward: 25,
        color: 'danger'
      },
      {
        id: 'speed_demon',
        title: 'Speed Demon',
        description: 'Complete 20 todos in a month',
        icon: LightningFill,
        condition: (data) => data.thisMonth >= 20,
        reward: 75,
        color: 'info'
      },
      {
        id: 'perfectionist',
        title: 'Perfectionist',
        description: 'Achieve 100% completion rate',
        icon: Award,
        condition: (data) => data.total > 0 && data.completed === data.total,
        reward: 200,
        color: 'success'
      }
    ];

    setAchievements(newAchievements);
  };

  const getTotalPoints = () => {
    if (!dashboardData) return 0;
    return achievements
      .filter(achievement => achievement.condition(dashboardData))
      .reduce((total, achievement) => total + achievement.reward, 0);
  };

  const getCompletedAchievements = () => {
    if (!dashboardData) return [];
    return achievements.filter(achievement => achievement.condition(dashboardData));
  };

  const getCompletionRate = () => {
    if (!dashboardData) return 0;
    return dashboardData.total > 0 ? Math.round((dashboardData.completed / dashboardData.total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="text-center mt-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading rewards...</p>
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
        <p>No rewards data available.</p>
      </Alert>
    );
  }

  const completedAchievements = getCompletedAchievements();
  const totalPoints = getTotalPoints();
  const completionRate = getCompletionRate();

  return (
    <div className="mt-4">
      <h2 className="mb-4">
        <Trophy className="me-2" />
        Rewards & Achievements
      </h2>

      {/* Points Summary */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="text-center h-100 bg-gradient" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white'}}>
            <Card.Body>
              <Card.Title>
                <Trophy size={40} />
              </Card.Title>
              <Card.Text className="h2">{totalPoints}</Card.Text>
              <Card.Text>Total Points</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="text-success">
                <CheckCircle size={40} />
              </Card.Title>
              <Card.Text className="h2">{completedAchievements.length}</Card.Text>
              <Card.Text>Achievements Unlocked</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="text-center h-100">
            <Card.Body>
              <Card.Title className="text-primary">
                <Bullseye size={40} />
              </Card.Title>
              <Card.Text className="h2">{completionRate}%</Card.Text>
              <Card.Text>Completion Rate</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Progress to Next Level */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Progress to Next Level</h5>
            </Card.Header>
            <Card.Body>
              <ProgressBar 
                now={completionRate} 
                label={`${completionRate}%`}
                variant="success"
                className="mb-2"
              />
              <small className="text-muted">
                Keep completing todos to unlock more achievements!
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Achievements Grid */}
      <Row>
        <Col>
          <h4 className="mb-3">Achievements</h4>
          <Row>
            {achievements.map((achievement) => {
              const IconComponent = achievement.icon;
              const isCompleted = achievement.condition(dashboardData);
              
              return (
                <Col md={6} lg={4} key={achievement.id} className="mb-3">
                  <Card className={`h-100 ${isCompleted ? 'border-success' : 'border-secondary'}`}>
                    <Card.Body className="text-center">
                      <Card.Title className={`text-${achievement.color}`}>
                        <IconComponent size={30} />
                      </Card.Title>
                      <Card.Title className="h6">{achievement.title}</Card.Title>
                      <Card.Text className="small text-muted">
                        {achievement.description}
                      </Card.Text>
                      <Badge 
                        bg={isCompleted ? 'success' : 'secondary'}
                        className="mt-2"
                      >
                        {isCompleted ? 'Unlocked' : 'Locked'}
                      </Badge>
                      <div className="mt-2">
                        <small className="text-muted">
                          Reward: {achievement.reward} points
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>

      {/* Motivational Message */}
      <Row className="mt-4">
        <Col>
          <Alert variant="info" className="text-center">
            <Alert.Heading>
              {completedAchievements.length === achievements.length ? '🏆 Congratulations!' : 'Keep Going!'}
            </Alert.Heading>
            <p>
              {completedAchievements.length === achievements.length 
                ? 'You\'ve unlocked all achievements! You\'re a true productivity master!'
                : `You've completed ${completedAchievements.length} out of ${achievements.length} achievements. Keep up the great work!`
              }
            </p>
          </Alert>
        </Col>
      </Row>
    </div>
  );
};

export default Rewards;
