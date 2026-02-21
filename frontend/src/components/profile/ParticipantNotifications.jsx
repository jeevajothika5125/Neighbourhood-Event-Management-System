import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ParticipantNotifications = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    upcomingEventReminders: true,
    eventLocationChanges: true,
    earlyBirdDiscountAlerts: true,
    friendActivityNotifications: true,
    eventWaitlistUpdates: true,
    personalizedEventSuggestions: true,
    eventPhotoSharingAlerts: false,
    communityAnnouncementUpdates: false
  });

  const handleToggle = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notification-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, ...settings })
      });

      if (response.ok) {
        showSuccess('Notification settings saved successfully!');
        setTimeout(() => navigate('/participant/profile'), 1000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      showError('Failed to save notification settings');
    }
  };

  return (
    <div className="participant-notifications">
      <div className="notifications-header">
        <h1>Notification Settings</h1>
        <button onClick={() => navigate('/participant/profile')} className="btn btn-secondary">← Back</button>
      </div>

      <div className="notifications-content">
        <div className="settings-section">
          <h3>Personal Event Preferences</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Upcoming Event Reminders</h4>
              <p>24-hour reminders for registered events</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.upcomingEventReminders} onChange={() => handleToggle('upcomingEventReminders')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Event Location Changes</h4>
              <p>Venue or time change notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.eventLocationChanges} onChange={() => handleToggle('eventLocationChanges')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Early Bird Discount Alerts</h4>
              <p>Special pricing and discount notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.earlyBirdDiscountAlerts} onChange={() => handleToggle('earlyBirdDiscountAlerts')} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Social & Community Features</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Friend Activity Notifications</h4>
              <p>When friends register for events</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.friendActivityNotifications} onChange={() => handleToggle('friendActivityNotifications')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Event Waitlist Updates</h4>
              <p>Notifications when spots become available</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.eventWaitlistUpdates} onChange={() => handleToggle('eventWaitlistUpdates')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Personalized Event Suggestions</h4>
              <p>AI-powered event recommendations</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.personalizedEventSuggestions} onChange={() => handleToggle('personalizedEventSuggestions')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Community Announcement Updates</h4>
              <p>General community news and updates</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.communityAnnouncementUpdates} onChange={() => handleToggle('communityAnnouncementUpdates')} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary save-btn">Save Settings</button>
      </div>

      <style jsx>{`
        .participant-notifications {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }
        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        .notifications-content {
          max-width: 800px;
          margin: 0 auto;
        }
        .settings-section {
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          margin-bottom: 1rem;
        }
        .toggle {
          position: relative;
          display: inline-block;
          width: 60px;
          height: 34px;
        }
        .toggle input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #ccc;
          transition: .4s;
          border-radius: 34px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 26px;
          width: 26px;
          left: 4px;
          bottom: 4px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }
        input:checked + .slider {
          background-color: #22c55e;
        }
        input:checked + .slider:before {
          transform: translateX(26px);
        }
        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          border: none;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .btn-primary {
          background: linear-gradient(45deg, #22c55e, #3b82f6);
          color: white;
        }
        .btn-secondary {
          background: rgba(255,255,255,0.2);
          color: white;
        }
        .save-btn {
          width: 100%;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
};

export default ParticipantNotifications;