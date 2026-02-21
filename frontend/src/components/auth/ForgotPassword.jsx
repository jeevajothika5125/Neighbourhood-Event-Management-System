import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import authService from '../../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLink, setResetLink] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const result = await authService.sendPasswordResetLink(email);
    
    if (result.success) {
      setMessage(result.message);
      if (result.resetLink) {
        setResetLink(result.resetLink);
      }
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-form">
        <h2>🔑 Forgot Password</h2>
        <p>Enter your email address and we'll send you a link to reset your password.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && (
            <div className="success-message">
              {message}
              {resetLink && (
                <div className="reset-link">
                  <p>For testing purposes, use this link:</p>
                  <a href={resetLink} target="_blank" rel="noopener noreferrer">
                    Reset Password Link
                  </a>
                </div>
              )}
            </div>
          )}

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="auth-links">
          <Link to="/participant-login">← Back to Login</Link>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .forgot-password-form {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 3rem;
          width: 100%;
          max-width: 450px;
          color: white;
          text-align: center;
        }

        .forgot-password-form h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .forgot-password-form p {
          margin-bottom: 2rem;
          opacity: 0.9;
          line-height: 1.5;
        }

        .form-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #f0dcf0ff;
        }

        .form-group input {
          width: 100%;
          padding: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
        }

        .form-group input::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .form-group input:focus {
          outline: none;
          border-color: rgba(236,72,153,0.6);
          box-shadow: 0 0 0 3px rgba(236,72,153,0.2);
        }

        .error-message {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.5);
          color: #fecaca;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .success-message {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.5);
          color: #bbf7d0;
          padding: 0.75rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-size: 0.9rem;
        }

        .reset-link {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255,255,255,0.3);
        }

        .reset-link a {
          color: #60a5fa;
          text-decoration: underline;
          word-break: break-all;
        }

        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          border: none;
          border-radius: 50px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 1.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(236,72,153,0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .auth-links {
          text-align: center;
        }

        .auth-links a {
          color: white;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .auth-links a:hover {
          color: #f0dcf0ff;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;