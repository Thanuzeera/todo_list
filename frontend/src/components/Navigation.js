import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { 
  House, 
  Calendar, 
  CalendarWeek, 
  CalendarMonth, 
  BarChart, 
  Trophy,
  List,
  Sun,
  Moon
} from 'react-bootstrap-icons';
import { useTheme } from '../contexts/ThemeContext';

const Navigation = ({ activeView, onViewChange }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: House },
    { id: 'list', label: 'All Todos', icon: List },
    { id: 'today', label: 'Today', icon: Calendar },
    { id: 'thisweek', label: 'This Week', icon: CalendarWeek },
    { id: 'thismonth', label: 'This Month', icon: CalendarMonth },
    { id: 'rewards', label: 'Rewards', icon: Trophy },
  ];

  return (
    <Navbar style={{ backgroundColor: '#1e3a8a' }} variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand href="#" className="fw-bold">
          <Trophy className="me-2" />
          Todo App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <Nav.Link
                  key={item.id}
                  href="#"
                  active={activeView === item.id}
                  onClick={(e) => {
                    e.preventDefault();
                    onViewChange(item.id);
                  }}
                  className="d-flex align-items-center"
                >
                  <IconComponent className="me-1" size={16} />
                  {item.label}
                </Nav.Link>
              );
            })}
            <Nav.Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                toggleTheme();
              }}
              className="theme-toggle-btn d-flex align-items-center ms-2"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="me-1" size={16} /> : <Moon className="me-1" size={16} />}
              {isDarkMode ? 'Light' : 'Dark'}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
