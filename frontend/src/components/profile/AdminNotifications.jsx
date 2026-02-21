import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const AdminNotifications = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    systemFailureAlerts: true,
    databaseBackupNotifications: true,
    userAccountSuspensions: true,
    platformMaintenanceAlerts: true,
    serverPerformanceWarnings: true,
    dataBreachAlerts: true,
    adminLoginAttempts: true,
    systemResourceUsage: false
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
        showSuccess('Admin notification settings saved successfully!');
        setTimeout(() => navigate('/admin/profile'), 1000);
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      showError('Failed to save notification settings');
    }
  };

  return (
    <div className="admin-notifications">
      <div className="notifications-header">
        <h1>Admin Notification Settings</h1>
        <button onClick={() => navigate('/admin/profile')} className="btn btn-secondary">← Back</button>
      </div>

      <div className="notifications-content">
        <div className="settings-section">
          <h3>System Administration Alerts</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>System Failure Alerts</h4>
              <p>Critical system downtime notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.systemFailureAlerts} onChange={() => handleToggle('systemFailureAlerts')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Database Backup Notifications</h4>
              <p>Daily backup status reports</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.databaseBackupNotifications} onChange={() => handleToggle('databaseBackupNotifications')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Platform Maintenance Alerts</h4>
              <p>Scheduled maintenance notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.platformMaintenanceAlerts} onChange={() => handleToggle('platformMaintenanceAlerts')} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="settings-section">
          <h3>Security & Monitoring</h3>
          <div className="setting-item">
            <div className="setting-info">
              <h4>User Account Suspensions</h4>
              <p>Notifications when accounts are suspended</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.userAccountSuspensions} onChange={() => handleToggle('userAccountSuspensions')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Data Breach Alerts</h4>
              <p>Immediate security breach notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.dataBreachAlerts} onChange={() => handleToggle('dataBreachAlerts')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Admin Login Attempts</h4>
              <p>Failed admin login notifications</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.adminLoginAttempts} onChange={() => handleToggle('adminLoginAttempts')} />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <div className="setting-info">
              <h4>Server Performance Warnings</h4>
              <p>High CPU/memory usage alerts</p>
            </div>
            <label className="toggle">
              <input type="checkbox" checked={settings.serverPerformanceWarnings} onChange={() => handleToggle('serverPerformanceWarnings')} />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <button onClick={handleSave} className="btn btn-primary save-btn">Save Settings</button>
      </div>

      <style jsx>{`
        .admin-notifications {
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
          background-color: #ec4899;
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

export default AdminNotifications;