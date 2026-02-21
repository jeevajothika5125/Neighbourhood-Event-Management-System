import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';

const NotificationSettings = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    eventReminders: true,
    eventUpdates: true,
    registrationConfirmations: true,
    marketingEmails: false,
    smsNotifications: false,
    pushNotifications: true,
    weeklyDigest: true
  });
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (settingName) => {
    setSettings(prev => ({
      ...prev,
      [settingName]: !prev[settingName]
    }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const userId = user?.id || 1; // Use user ID or default to 1
      console.log('Saving settings for user:', userId);
      console.log('Settings:', settings);
      
      const response = await fetch(`/api/profile/${userId}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings)
      });
      
      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);
      
      if (data.success) {
        showSuccess(data.message);
        alert('✅ ' + data.message);
      } else {
        showError(data.message || 'Failed to update notification settings');
        alert('❌ ' + (data.message || 'Failed to save settings'));
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      showError('Failed to update notification settings');
      alert('❌ Error saving settings: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const notificationCategories = [
    {
      title: 'Email Notifications',
      description: 'Receive notifications via email',
      settings: [
        {
          key: 'emailNotifications',
          label: 'Enable Email Notifications',
          description: 'Master switch for all email notifications'
        },
        {
          key: 'eventReminders',
          label: 'Event Reminders',
          description: 'Get reminded about upcoming events you\'re registered for'
        },
        {
          key: 'eventUpdates',
          label: 'Event Updates',
          description: 'Receive updates when event details change'
        },
        {
          key: 'registrationConfirmations',
          label: 'Registration Confirmations',
          description: 'Get confirmation emails when you register for events'
        },
        {
          key: 'weeklyDigest',
          label: 'Weekly Digest',
          description: 'Receive a weekly summary of upcoming events'
        }
      ]
    },
    {
      title: 'Marketing & Promotions',
      description: 'Promotional content and marketing emails',
      settings: [
        {
          key: 'marketingEmails',
          label: 'Marketing Emails',
          description: 'Receive promotional emails about new features and events'
        }
      ]
    },
    {
      title: 'Mobile Notifications',
      description: 'Notifications on your mobile device',
      settings: [
        {
          key: 'pushNotifications',
          label: 'Push Notifications',
          description: 'Receive push notifications on your mobile device'
        },
        {
          key: 'smsNotifications',
          label: 'SMS Notifications',
          description: 'Receive important updates via SMS'
        }
      ]
    }
  ];

  return (
    <div className="notification-settings">
      <div className="settings-header">
        <h1>Notification Settings</h1>
        <p>Manage how you receive notifications and updates</p>
        <a href="/profile" className="btn btn-secondary">← Back to Profile</a>
      </div>

      <div className="settings-content">
        {notificationCategories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="settings-category">
            <div className="category-header">
              <h3>{category.title}</h3>
              <p>{category.description}</p>
            </div>
            
            <div className="settings-list">
              {category.settings.map((setting, settingIndex) => (
                <div key={settingIndex} className="setting-item">
                  <div className="setting-info">
                    <h4>{setting.label}</h4>
                    <p>{setting.description}</p>
                  </div>
                  <div className="setting-control">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={settings[setting.key]}
                        onChange={() => handleSettingChange(setting.key)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="settings-category">
          <div className="category-header">
            <h3>Notification Frequency</h3>
            <p>Choose how often you want to receive notifications</p>
          </div>
          
          <div className="frequency-options">
            <div className="frequency-item">
              <input type="radio" id="immediate" name="frequency" value="immediate" defaultChecked />
              <label htmlFor="immediate">
                <strong>Immediate</strong>
                <span>Receive notifications as they happen</span>
              </label>
            </div>
            
            <div className="frequency-item">
              <input type="radio" id="daily" name="frequency" value="daily" />
              <label htmlFor="daily">
                <strong>Daily Digest</strong>
                <span>Receive a daily summary of notifications</span>
              </label>
            </div>
            
            <div className="frequency-item">
              <input type="radio" id="weekly" name="frequency" value="weekly" />
              <label htmlFor="weekly">
                <strong>Weekly Digest</strong>
                <span>Receive a weekly summary of notifications</span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-actions">
          <button 
            onClick={handleSaveSettings} 
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </button>
          
          <button 
            onClick={() => window.history.back()}
            className="btn btn-secondary"
          >
            Back 
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .notification-settings {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .settings-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .settings-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .settings-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .settings-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .settings-category {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
        }

        .category-header {
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .category-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .category-header p {
          opacity: 0.8;
          font-size: 1rem;
        }

        .settings-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          transition: all 0.3s ease;
        }

        .setting-item:hover {
          background: rgba(255,255,255,0.15);
        }

        .setting-info {
          flex: 1;
        }

        .setting-info h4 {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: white;
        }

        .setting-info p {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .setting-control {
          margin-left: 1rem;
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

        .frequency-options {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .frequency-item {
          display: flex;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .frequency-item:hover {
          background: rgba(255,255,255,0.15);
        }

        .frequency-item input {
          margin-right: 1rem;
          transform: scale(1.2);
        }

        .frequency-item label {
          display: flex;
          flex-direction: column;
          cursor: pointer;
        }

        .frequency-item label strong {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: white;
        }

        .frequency-item label span {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .settings-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
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
        }

        .btn-primary {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          box-shadow: 0 8px 20px rgba(236,72,153,0.3);
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
          .notification-settings {
            padding: 1rem;
          }

          .settings-category {
            padding: 1.5rem;
          }

          .setting-item {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .setting-control {
            margin-left: 0;
          }

          .settings-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default NotificationSettings;