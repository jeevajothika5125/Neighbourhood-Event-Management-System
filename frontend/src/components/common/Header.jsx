import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [, forceUpdate] = useState({});

  React.useEffect(() => {
    const handleProfileUpdate = () => {
      forceUpdate({}); // Force re-render
    };
    
    const handleUserDataUpdate = () => {
      forceUpdate({}); // Force re-render
    };
    
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, []);

  
  // Show simple header on homepage
  if (location.pathname === '/') {
    return (
      <header className="home-header">
        <div className="home-header-container">
          <div className="home-logo">
            🏠 Neighbourhood Hub
          </div>
        </div>
        <style jsx>{`
          .home-header {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #60a5fa 0%, #f472b6 100%);
            padding: 0.5rem 0;
            box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
            z-index: 100;
          }

          .home-header-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .home-logo {
            font-size: 2rem;
            font-weight: 700;
            color: white;
            text-align: center;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
        `}</style>
      </header>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getProfilePath = () => {
    if (!user?.role) return '/profile';
    switch (user.role.toLowerCase()) {
      case 'admin':
        return '/admin/profile';
      case 'organizer':
        return '/organizer/profile';
      case 'participant':
        return '/participant/profile';
      default:
        return '/profile';
    }
  };

  return (
    <header className="header">
      <div className="header-container">
       <div className="home-logo">
            🏠 Neighbourhood Hub
          </div>

        <nav className="nav">
          {isAuthenticated && (
            <div className="user-menu">
              <Link to={getProfilePath()} className="profile-link">Profile</Link>
              <span className="user-name">{user?.username || 'User'}!</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </div>
          )}
        </nav>


      </div>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #60a5fa 0%, #f472b6 100%);
          box-shadow: 0 2px 10px rgba(59, 130, 246, 0.2);
          z-index: 100;
        }

        .header-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .home-logo {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .nav {
          display: flex;
          align-items: center;
        }

        .profile-link {
          color: white;
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          transition: all 0.2s ease;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .profile-link:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .user-menu {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-name {
          color: white;
          font-weight: 500;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .logout-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .logout-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        @media (max-width: 768px) {
          .user-menu {
            gap: 0.5rem;
          }

          .user-name {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;