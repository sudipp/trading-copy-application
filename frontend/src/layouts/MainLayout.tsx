import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationCenter from '../components/notifications/NotificationCenter';
import './MainLayout.css';

const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="main-layout">
      <nav className="navbar">
        <div className="nav-brand">
          <Link to="/dashboard">Trading Copy</Link>
        </div>
        <div className="nav-links">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/traders">Traders</Link>
          <Link to="/stocks">Stocks</Link>
          <NotificationCenter />
          <div className="user-menu">
            <span>{user?.name}</span>
            <button onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

