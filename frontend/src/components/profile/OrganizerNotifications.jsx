import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const OrganizerNotifications = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    eventSubmissionApprovals: true,
    venueBookingConfirmations: true,
    attendeeCapacityWarnings: true,
    eventCancellationRequests: true,
    sponsorshipInquiries: true,
    eventBudgetAlerts: true,
    equipmentRequestNotifications: true,
    eventFeedbackSummaries: false
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
        showSuccess('Organizer notification settings saved successfully!');
        setTimeout(() => navigate('/organizer/profile'), 1000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      showError('Failed to save notification settings');
    }
  };

  return (
    <div className="organizer-notifications">
      <div className="notifications-header">
        <h1>Organizer Notification Settings</h1>
        <button onClick={() => navigate('/organizer/profile')} className="btn btn-secondary">← Back</button>
      </div>

      <div className="notifications-content">
        <div className="settings-section">
          <h3>Event Management Notifications</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Event Submission Approvals</h4>
              <p>New event approval requests</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.eventSubmissionApprovals} onChange={() => handleToggle('eventSubmissionApprovals')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Venue Booking Confirmations</h4>
              <p>Venue availability and booking updates</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.venueBookingConfirmations} onChange={() => handleToggle('venueBookingConfirmations')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Attendee Capacity Warnings</h4>
              <p>Alerts when events reach capacity limits</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.attendeeCapacityWarnings} onChange={() => handleToggle('attendeeCapacityWarnings')} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Business Operations</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Event Cancellation Requests</h4>
              <p>Participant cancellation notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.eventCancellationRequests} onChange={() => handleToggle('eventCancellationRequests')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Sponsorship Inquiries</h4>
              <p>New sponsorship opportunity alerts</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.sponsorshipInquiries} onChange={() => handleToggle('sponsorshipInquiries')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Event Budget Alerts</h4>
              <p>Budget threshold and expense notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.eventBudgetAlerts} onChange={() => handleToggle('eventBudgetAlerts')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Equipment Request Notifications</h4>
              <p>AV and equipment booking requests</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.equipmentRequestNotifications} onChange={() => handleToggle('equipmentRequestNotifications')} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary save-btn">Save Settings</button>
      </div>

      <style jsx>{`
        .organizer-notifications {
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
          background-color: #3b82f6;
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

export default OrganizerNotifications;