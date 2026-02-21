import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ParticipantLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const user = await login(credentials.username, credentials.password, 'Participant');
      if (user) {
        navigate('/participant-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-layout">
        <div className="auth-card">
          <div className="role-header">
            <div className="role-badge participant">
              <span className="role-icon">👤</span>
              <span className="role-text">Participant Portal</span>
            </div>
            <h2>Welcome Back! 🎉</h2>
            <p>Ready to discover amazing events?</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="username"
                placeholder="Enter your username"
                value={credentials.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="login-btn participant-btn" disabled={loading}>
              {loading ? '🔄 Signing you in...' : '🚀 Join the Fun!'}
            </button>
          </form>
          
          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password? 🔑</Link>
            <Link to="/participant-register">New here? Create account ✨</Link>
            <Link to="/">← Back to Home</Link>
          </div>
        </div>

        <div className="app-info">
          <div className="info-content">
            <div className="app-logo">🎪</div>
            <h3>Neighbourhood Hub</h3>
            <p className="app-tagline">Your Gateway to Neighbourhood Events</p>
            
            <div className="features-list">
              <div className="feature">
                <span className="feature-icon">🎯</span>
                <div>
                  <h4>Discover Local Events</h4>
                  <p>Find exciting neighbourhood events happening around you</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">📅</span>
                <div>
                  <h4>Easy Registration</h4>
                  <p>Join events with just one click and get instant confirmations</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">👥</span>
                <div>
                  <h4>Connect with Neighbours</h4>
                  <p>Meet like-minded neighbours and build lasting community connections</p>
                </div>
              </div>
              <div className="feature">
                <span className="feature-icon">🏆</span>
                <div>
                  <h4>Track Your Involvement</h4>
                  <p>Keep track of attended events and your neighbourhood participation</p>
                </div>
              </div>
            </div>
            
            <div className="stats">
              <div className="stat">
                <span className="stat-number">1000+</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Events Monthly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .auth-container::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(236, 72, 153, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .role-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 1.5rem;
          box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
        }

        .role-icon {
          font-size: 1.2rem;
        }

        .role-header h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 2rem;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .role-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .auth-card form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          z-index: 1;
        }

        .auth-card input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
        }

        .auth-card input:focus {
          outline: none;
          border-color: #ec4899;
          box-shadow: 0 0 20px rgba(236, 72, 153, 0.2);
          background: white;
        }

        .login-btn {
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(236, 72, 153, 0.3);
        }

        .login-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(236, 72, 153, 0.4);
        }

        .login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
        }

        .auth-links {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-links a {
          color: #ec4899;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .auth-links a:hover {
          color: #3b82f6;
          transform: translateY(-1px);
        }

        .error-message {
          background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
          color: #dc2626;
          padding: 1rem;
          border-radius: 12px;
          font-size: 0.875rem;
          text-align: center;
          border: 1px solid #fca5a5;
        }

        .app-info {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .info-content {
          text-align: center;
        }

        .app-logo {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .info-content h3 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #fff 0%, #fce7f3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .app-tagline {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .features-list {
          text-align: left;
          margin-bottom: 2rem;
        }

        .feature {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .feature:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }

        .feature-icon {
          font-size: 1.5rem;
          margin-top: 0.2rem;
        }

        .feature h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .feature p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .stats {
          display: flex;
          justify-content: space-around;
          margin-top: 2rem;
        }

        .stat {
          text-align: center;
        }

        .stat-number {
          display: block;
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(135deg, #fff 0%, #fce7f3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .auth-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .auth-container {
            padding: 1rem;
          }
          
          .auth-card, .app-info {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ParticipantLogin;