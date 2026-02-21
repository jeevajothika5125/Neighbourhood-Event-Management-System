import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const ParticipantProfile = () => {
  const { user, setUserData } = useAuth();
  const [editing, setEditing] = useState({ username: false });
  const [editValues, setEditValues] = useState({ username: '' });
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    eventsAttended: 0
  });

  const fetchUserStats = useCallback(() => {
    if (!user) return;
    try {
      const storedRegistrations = localStorage.getItem('eventRegistrations');
      const allRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
      const userRegistrations = allRegistrations.filter(reg => reg.userId === user.username);
      setStats({
        eventsRegistered: userRegistrations.length,
        eventsAttended: userRegistrations.filter(reg => reg.attended).length
      });
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

  const saveEdit = async () => {
    try {
      const newUsername = editValues.username;
      console.log('Updating username from', user.username, 'to', newUsername);
      
      // Create user if not exists
      const createResponse = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: user.username,
          email: user.email,
          password: 'password123',
          role: 'PARTICIPANT'
        })
      });
      console.log('Create response status:', createResponse.status);
      
      // Get current user from database
      const getUserResponse = await fetch(`http://localhost:8080/api/users/username/${encodeURIComponent(user.username)}`);
      console.log('Get user response status:', getUserResponse.status);
      
      if (!getUserResponse.ok) {
        alert('❌ User not found in database');
        return;
      }
      
      const dbUser = await getUserResponse.json();
      console.log('Found user in DB:', dbUser);
      
      // Update username in database
      const updateData = {
        username: newUsername,
        email: dbUser.email,
        password: dbUser.password
      };
      console.log('Updating with data:', updateData);
      
      const updateResponse = await fetch(`http://localhost:8080/api/users/${dbUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
      console.log('Update response status:', updateResponse.status);
      
      if (updateResponse.ok) {
        const updatedUser = { ...user, username: newUsername };
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setEditing({ username: false });
        alert('✅ Username updated in database!');
      } else {
        const errorText = await updateResponse.text();
        console.error('Update failed:', errorText);
        alert('❌ Failed to update database: ' + updateResponse.status);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error: ' + error.message);
    }
  };

  useEffect(() => {
    fetchUserStats();
    
    const handleRegistrationUpdate = () => {
      fetchUserStats();
    };
    
    const handleProfileUpdate = () => {
      fetchUserStats();
    };
    
    const handleUserDataUpdate = () => {
      fetchUserStats();
    };
    
    window.addEventListener('eventRegistration', handleRegistrationUpdate);
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('userDataUpdated', handleUserDataUpdate);
    
    return () => {
      window.removeEventListener('eventRegistration', handleRegistrationUpdate);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('userDataUpdated', handleUserDataUpdate);
    };
  }, [fetchUserStats]);

  if (!user) {
    return <div className="error-message">Please log in to view your profile.</div>;
  }

  return (
    <div className="participant-profile">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        </div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p className="user-role">Participant</p>
          <p className="user-email">{user.email}</p>
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
                  <button onClick={saveEdit} className="save-btn">✓</button>
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
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Role:</label>
              <span className="role-badge role-participant">Participant</span>
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
              <Link to="/profile/edit" state={{ from: '/participant/profile' }} className="btn btn-secondary">Change Password</Link>
            </div>
            
            <div className="setting-item">
              <div className="setting-info">
                <h4>Notifications</h4>
                <p>Manage your notification preferences</p>
              </div>
              <Link to="/participant/notifications" className="btn btn-secondary">Manage Notifications</Link>
            </div>
            
        
          </div>
        </div>

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
      </div>
      
      <style jsx>{`
        .participant-profile {
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
          background: linear-gradient(45deg, #22c55e, #3b82f6);
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
        } rgba(0,0,0,0.3);
        }

        .user-role {
          font-size: 1.1rem;
          font-weight: 600;
          color: #dcfce7;
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
          color: #dcfce7;
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
          color: #dcfce7;
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
          background: linear-gradient(45deg, #22c55e, #3b82f6);
          color: white;
          box-shadow: 0 8px 20px rgba(34,197,94,0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(34,197,94,0.4);
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

        .edit-field {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .display-field {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .edit-input {
          flex: 1;
          padding: 0.5rem;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 5px;
          background: rgba(255,255,255,0.1);
          color: white;
        }

        .edit-btn, .save-btn, .cancel-btn {
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.3);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .save-btn {
          background: rgba(34, 197, 94, 0.3);
        }

        .cancel-btn {
          background: rgba(239, 68, 68, 0.3);
        }

        .edit-btn:hover, .save-btn:hover, .cancel-btn:hover {
          background: rgba(255,255,255,0.3);
        }3);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 3px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .save-btn {
          background: rgba(34, 197, 94, 0.3);
        }

        .cancel-btn {
          background: rgba(239, 68, 68, 0.3);
        }

        .edit-btn:hover, .save-btn:hover, .cancel-btn:hover {
          background: rgba(255,255,255,0.3);
        }

        @media (max-width: 768px) {
          .participant-profile {
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

export default ParticipantProfile;