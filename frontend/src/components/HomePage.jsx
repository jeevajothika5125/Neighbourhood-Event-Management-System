import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1>NeighbourHood Event Management System</h1>
            <p className="hero-subtitle">
              Your comprehensive platform for organizing, managing, and participating in neighbourhood events
            </p>
            <p className="hero-description">
              Connect with your local community through seamless neighbourhood event management. 
              Whether you're an organizer creating memorable local experiences or a resident 
              discovering exciting neighbourhood events, we've got your community covered.
            </p>
          </div>
          
          <div className="hero-image">
            <div className="image-placeholder">
              <div className="event-icon">🎉</div>
              <div className="features-grid">
                <div className="feature-item">📅 Event Planning</div>
                <div className="feature-item">👥 User Management</div>
                <div className="feature-item">📊 Analytics</div>
                <div className="feature-item">🎯 Registration</div>
              </div>
            </div>
          </div>
        </div>

        <div className="role-selection">
          <h2>Choose Your Role</h2>
          <p>Select how you'd like to use our platform</p>
          
          <div className="role-cards">
            <div className="role-card">
              <div className="role-icon">👤</div>
              <h3>Participant</h3>
              <p>Discover and register for exciting events in your neighbourhood</p>
              <ul className="role-features">
                <li>Browse upcoming events</li>
                <li>Easy registration process</li>
                <li>Event reminders</li>
                <li>Personal dashboard</li>
              </ul>
              <a href="/participant-login" className="role-btn btn-participant">
                Join as Participant
              </a>
            </div>

            <div className="role-card">
              <div className="role-icon">🎯</div>
              <h3>Organizer</h3>
              <p>Create and manage neighbourhood events with powerful community tools</p>
              <ul className="role-features">
                <li>Create unlimited events</li>
                <li>Manage registrations</li>
                <li>Track attendance</li>
                <li>Analytics dashboard</li>
              </ul>
              <a href="/organizer-login" className="role-btn btn-organizer">
                Become Organizer
              </a>
            </div>

            <div className="role-card">
              <div className="role-icon">⚙️</div>
              <h3>Administrator</h3>
              <p>Full neighbourhood system control with advanced community management</p>
              <ul className="role-features">
                <li>User management</li>
                <li>System analytics</li>
                <li>Event approval</li>
                <li>Platform oversight</li>
              </ul>
              <a href="/admin-login" className="role-btn btn-admin">
                Admin Access
              </a>
            </div>
          </div>
        </div>

       
      </div>

      <div className="features-section">
        <div className="container">
          <h2>Why Choose Our Platform?</h2>
          <div className="features-grid-large">
            <div className="feature-card">
              <div className="feature-icon">🚀</div>
              <h3>Easy to Use</h3>
              <p>Intuitive interface designed for users of all technical levels</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔒</div>
              <h3>Secure & Reliable</h3>
              <p>Your data is protected with enterprise-grade security</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>Mobile Friendly</h3>
              <p>Access your events anywhere, anytime on any device</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Real-time Updates</h3>
              <p>Stay informed with instant notifications and updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;