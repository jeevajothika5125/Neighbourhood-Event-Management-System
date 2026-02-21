import React, { useState, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';

const EmailVerification = () => {
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  const { showSuccess, showError } = useNotification();

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (verificationCode.length !== 6) {
      showError('Please enter a valid 6-digit verification code');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      showSuccess('Email verified successfully!');
      window.location.href = '/dashboard';
    } catch (error) {
      showError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResending(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess('Verification code resent to your email');
    } catch (error) {
      showError('Failed to resend verification code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="email-verification-container">
      <div className="verification-form">
        <h2>Verify Your Email</h2>
        <p>We've sent a 6-digit verification code to your email address.</p>
        
        <form onSubmit={handleVerify}>
          <div className="form-group">
            <label htmlFor="verificationCode">Verification Code</label>
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Enter 6-digit code"
              maxLength="6"
              className="verification-input"
            />
          </div>

          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="resend-section">
          <p>Didn't receive the code?</p>
          <button 
            onClick={handleResendCode} 
            disabled={resending}
            className="resend-btn"
          >
            {resending ? 'Resending...' : 'Resend Code'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;