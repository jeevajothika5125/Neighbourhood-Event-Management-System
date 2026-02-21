import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../../services/authService';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    const result = await authService.resetPassword(token, password);
    
    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        navigate('/participant-login');
      }, 2000);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-form">
        <h2>🔒 Reset Password</h2>
        <p>Enter your new password below.</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
              minLength="6"
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
              minLength="6"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {message && (
            <div className="success-message">
              {message}
              <br />
              Redirecting to login...
            </div>
          )}

          <button type="submit" disabled={loading || !token} className="submit-btn">
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .reset-password-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .reset-password-form {
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

        .reset-password-form h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .reset-password-form p {
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
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(236,72,153,0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default ResetPassword;