import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';

const ProfileView = () => {
  const { user, setUserData } = useAuth();
  const [editing, setEditing] = useState({ username: false, email: false });
  const [editValues, setEditValues] = useState({ username: '', email: '' });
  const [stats, setStats] = useState({
    eventsCreated: 0,
    totalRegistrations: 0,
    eventsRegistered: 0,
    eventsAttended: 0
  });

  const fetchUserStats = useCallback(() => {
    if (!user) return;
    try {
      const storedEvents = localStorage.getItem('events');
      const allEvents = storedEvents ? JSON.parse(storedEvents) : [];
      if (user.role === 'Organizer') {
        const organizerEvents = allEvents.filter(event => event.organizerName === user.username);
        const storedRegistrations = localStorage.getItem('eventRegistrations');
        const allRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
        const totalRegistrations = organizerEvents.reduce((sum, event) => {
          const eventRegistrations = allRegistrations.filter(reg => reg.eventId === event.id);
          return sum + eventRegistrations.length;
        }, 0);
        setStats({
          eventsCreated: organizerEvents.length,
          totalRegistrations: totalRegistrations,
          eventsRegistered: 0,
          eventsAttended: 0
        });
      } else if (user.role === 'Participant') {
        // Get participant registration data
        const storedRegistrations = localStorage.getItem('eventRegistrations');
        const allRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
        const userRegistrations = allRegistrations.filter(reg => reg.userId === user.username);
        setStats({
          eventsCreated: 0,
          totalRegistrations: 0,
          eventsRegistered: userRegistrations.length,
          eventsAttended: userRegistrations.filter(reg => reg.attended).length
        });
      }
    } catch (error) {
      console.error('Failed to fetch user stats:', error);
    }
  }, [user]);

  const startEdit = (field) => {
    setEditValues({ ...editValues, [field]: user[field] });
    setEditing({ ...editing, [field]: true });
  };

  const cancelEdit = (field) => {
    setEditing({ ...editing, [field]: false });
    setEditValues({ ...editValues, [field]: '' });
  };

  const saveEdit = async (field) => {
    try {
      const updatedUser = { ...user, [field]: editValues[field] };
      
      // Save to database
      const response = await fetch(`/api/user/${user.id || 1}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUser)
      });
      
      if (response.ok) {
        setUserData(updatedUser);
        setEditing({ ...editing, [field]: false });
        alert('✅ Profile updated successfully!');
      } else {
        alert('❌ Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('❌ Error updating profile');
    }
  };

  useEffect(() => {
    fetchUserStats();
    }, [fetchUserStats]);

  if (!user) {
    return <div className="error-message">Please log in to view your profile.</div>;
  }

  return (
    <div className="profile-view">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="user-role">{user.role}</p>
          <p className="user-email">{user.email}</p>
        </div>
        <div className="profile-actions">
          <a href="/profile/edit" className="btn btn-primary">Edit Profile</a>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h3>Account Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Username:</label>
              {editing.username ? (
                <div className="edit-field">
                  <input 
                    type="text" 
                    value={editValues.username} 
                    onChange={(e) => setEditValues({...editValues, username: e.target.value})}
                    className="edit-input"
                  />
                  <button onClick={() => saveEdit('username')} className="save-btn">✓</button>
                  <button onClick={() => cancelEdit('username')} className="cancel-btn">✗</button>
                </div>
              ) : (
                <div className="display-field">
                  <span>{user.username}</span>
                  <button onClick={() => startEdit('username')} className="edit-btn">✎</button>
                </div>
              )}
            </div>
            <div className="info-item">
              <label>Email:</label>
              {editing.email ? (
                <div className="edit-field">
                  <input 
                    type="email" 
                    value={editValues.email} 
                    onChange={(e) => setEditValues({...editValues, email: e.target.value})}
                    className="edit-input"
                  />
                  <button onClick={() => saveEdit('email')} className="save-btn">✓</button>
                  <button onClick={() => cancelEdit('email')} className="cancel-btn">✗</button>
                </div>
              ) : (
                <div className="display-field">
                  <span>{user.email}</span>
                  <button onClick={() => startEdit('email')} className="edit-btn">✎</button>
                </div>
              )}
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span className={`role-badge role-${user.role?.toLowerCase()}`}>
                {user.role}
              </span>
            </div>
            
          </div>
        </div>

        <div className="profile-section">
          <h3>Account Settings</h3>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Password</h4>
                <p>Change your account password</p>
              </div>
              <a href="/profile/edit" className="btn btn-secondary">
                Change Password
              </a>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Notifications</h4>
                <p>Manage your notification preferences</p>
              </div>
              <a href="/profile/notifications" className="btn btn-secondary">
                Manage Notifications
              </a>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Privacy</h4>
                <p>Control your privacy settings</p>
              </div>
              <a href="/profile/edit" className="btn btn-secondary">
                Privacy Settings
              </a>
            </div>
          </div>
        </div>

        {user.role === 'Organizer' && (
          <div className="profile-section">
            <h3>Organizer Information</h3>
            <div className="organizer-stats">
              <div className="stat-item">
                <span className="stat-label">Events Created:</span>
                <span className="stat-value">{stats.eventsCreated}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Registrations:</span>
                <span className="stat-value">{stats.totalRegistrations}</span>
              </div>
            </div>
          </div>
        )}

        {user.role === 'Participant' && (
          <div className="profile-section">
            <h3>Participation History</h3>
            <div className="participation-stats">
              <div className="stat-item">
                <span className="stat-label">Events Registered:</span>
                <span className="stat-value">{stats.eventsRegistered}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Events Attended:</span>
                <span className="stat-value">{stats.eventsAttended}</span>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .profile-view {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .profile-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .profile-avatar {
          flex-shrink: 0;
        }

        .avatar-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .profile-info {
          flex: 1;
        }

        .profile-info h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .user-role {
          font-size: 1.1rem;
          font-weight: 600;
          color: #fce7f3;
          margin-bottom: 0.25rem;
        }

        .user-email {
          font-size: 1rem;
          opacity: 0.8;
        }

        .profile-content {
          display: grid;
          gap: 2rem;
        }

        .profile-section {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .profile-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .info-item label {
          font-weight: 600;
          color: #fce7f3;
        }

        .info-item span {
          color: white;
        }

        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .role-participant {
          background: rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .role-organizer {
          background: rgba(59, 130, 246, 0.3);
          color: #3b82f6;
        }

        .role-admin {
          background: rgba(236, 72, 153, 0.3);
          color: #ec4899;
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

        .organizer-stats,
        .participation-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .stat-label {
          font-weight: 600;
          color: #fce7f3;
        }

        .stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: white;
        }

        .btn {
          display: inline-block;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          cursor: pointer;
        }

        .btn-primary {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          box-shadow: 0 8px 20px rgba(236,72,153,0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(236,72,153,0.4);
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

        .error-message {
          color: #fca5a5;
          text-align: center;
          padding: 2rem;
          font-size: 1.1rem;
        }

        @media (max-width: 768px) {
          .profile-view {
            padding: 1rem;
          }

          .profile-header {
            flex-direction: column;
            text-align: center;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .setting-item {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ProfileView;