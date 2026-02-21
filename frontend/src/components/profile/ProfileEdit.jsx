import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { validateEmail, validateRequired } from '../../utils/validators';
import { updateUserStorage } from '../../utils/userStorage';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileEdit = () => {
  const { user, setUserData } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('password');
  const [previousPage, setPreviousPage] = useState('');
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    emailVisible: false,
    phoneVisible: false,
    dataSharing: false,
    marketingEmails: true
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.username)) {
      newErrors.username = 'Username is required';
    }
    
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    return newErrors;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!validateRequired(formData.currentPassword)) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!validateRequired(formData.newPassword)) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    return newErrors;
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validateProfileForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const updateData = {
        ...user,
        username: formData.username,
        email: formData.email,
        id: user?.id || 1
      };
      
      // Update localStorage
      updateUserStorage(user.email, updateData);
      
      console.log('ProfileEdit: Updating user data', updateData);
      
      // Update AuthContext with new data (this updates both profile and footer)
      setUserData(updateData);
      
      showSuccess('Profile updated successfully!');
      alert('✅ Profile updated successfully!');
      
      // Trigger a custom event to notify other components
      console.log('ProfileEdit: Dispatching profileUpdated event');
      window.dispatchEvent(new CustomEvent('profileUpdated', { detail: updateData }));
      
      // Navigate to role-specific profile page
      const getProfilePath = () => {
        switch (updateData.role?.toLowerCase()) {
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
      
      setTimeout(() => {
        window.location.href = getProfilePath();
      }, 1000);
      
    } catch (error) {
      console.error('Error updating profile:', error);
      showError('Failed to update profile');
      alert('❌ Failed to update profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Determine previous page based on user role or referrer
    const referrer = location.state?.from || document.referrer;
    const roleBasedPath = {
      'admin': '/admin/profile',
      'organizer': '/organizer/profile', 
      'participant': '/participant/profile'
    }[user?.role?.toLowerCase()] || '/profile';
    
    setPreviousPage(roleBasedPath);
  }, [user?.role, location.state]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validatePasswordForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      // Update password in MySQL database
      const response = await fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: formData.newPassword
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update password');
      }

      const updatedUser = await response.json();
      
      // Update localStorage
      updateUserStorage(user.email, updatedUser);
      
      // Update AuthContext
      setUserData(updatedUser);
      
      showSuccess('Password updated successfully!');
      
      // Navigate back to previous page after 1 second
      setTimeout(() => {
        navigate(previousPage);
      }, 1000);
      
    } catch (error) {
      console.error('Error updating password:', error);
      showError('Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    const updatedUser = {
      ...user,
      privacySettings: privacySettings
    };
    updateUserStorage(user.email, updatedUser);
    setUserData(updatedUser);
    showSuccess('Privacy settings updated successfully!');
    alert('Privacy settings updated successfully!');
  };

  return (
    <div className="profile-edit">
      <div className="profile-edit-header">
        <h1>Edit Profile</h1>
        <button onClick={() => navigate(previousPage)} className="btn btn-secondary">← Back to Profile</button>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn active`}
        >
          Change Password
        </button>
      </div>

      <div className="tab-content">
        <form onSubmit={handlePasswordSubmit} className="password-form">
          <h3>Change Password</h3>
          
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className={errors.currentPassword ? 'error' : ''}
            />
            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className={errors.newPassword ? 'error' : ''}
            />
            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary">
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>
      
      <style jsx>{`
        .profile-edit {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .profile-edit-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }

        .profile-edit-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .profile-tabs {
          display: flex;
          max-width: 800px;
          margin: 0 auto 2rem;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 0.5rem;
        }

        .tab-btn {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          color: white;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          box-shadow: 0 4px 15px rgba(236,72,153,0.3);
        }

        .tab-btn:hover:not(.active) {
          background: rgba(255,255,255,0.1);
        }

        .tab-content {
          max-width: 800px;
          margin: 0 auto;
        }

        .profile-form,
        .password-form,
        .privacy-form {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
        }

        .profile-form h3,
        .password-form h3,
        .privacy-form h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .privacy-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .privacy-section:last-child {
          border-bottom: none;
        }

        .privacy-section h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #fce7f3;
        }

        .radio-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .radio-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .radio-item:hover {
          background: rgba(255,255,255,0.15);
        }

        .radio-item input {
          transform: scale(1.2);
        }

        .toggle-group {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .toggle-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .toggle-slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(255,255,255,0.3);
          transition: 0.4s;
          border-radius: 34px;
        }

        .toggle-slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: 0.4s;
          border-radius: 50%;
        }

        input:checked + .toggle-slider {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
        }

        input:checked + .toggle-slider:before {
          transform: translateX(26px);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #fce7f3;
          font-size: 1rem;
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
          background: rgba(255,255,255,0.15);
        }

        .form-group input.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239,68,68,0.2);
        }

        .disabled-input {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-group small {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.8rem;
          opacity: 0.7;
          color: #fce7f3;
        }

        .error-message {
          color: #fca5a5;
          font-size: 0.875rem;
          margin-top: 0.25rem;
          display: block;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          text-decoration: none;
          display: inline-block;
        }

        .btn-primary {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          box-shadow: 0 8px 20px rgba(236,72,153,0.3);
          margin-top: 1rem;
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(236,72,153,0.4);
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.2);
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .profile-edit {
            padding: 1rem;
          }

          .profile-edit-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .profile-edit-header h1 {
            font-size: 2rem;
          }

          .profile-tabs {
            flex-direction: column;
            gap: 0.5rem;
          }

          .profile-form,
          .password-form {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileEdit;