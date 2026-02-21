import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminProfile = () => {
  const { user, setUserData } = useAuth();
  const [editing, setEditing] = useState({ username: false });
  const [editValues, setEditValues] = useState({ username: '' });

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
      
      // Get current user from database
      const getUserResponse = await fetch(`http://localhost:8080/api/users/username/${encodeURIComponent(user.username)}`);
      
      if (!getUserResponse.ok) {
        alert('❌ User not found in database');
        return;
      }
      
      const dbUser = await getUserResponse.json();
      
      // Update username in database
      const updateData = {
        username: newUsername,
        email: dbUser.email,
        password: dbUser.password
      };
      
      const updateResponse = await fetch(`http://localhost:8080/api/users/${dbUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });
      
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

  return (
    <div className="admin-profile">
      <div className="profile-header">
        <h1>Admin Profile</h1>
        <div className="profile-info">
          <h2>{user?.username}</h2>
          <p>{user?.email}</p>
          <span className="role-badge">Administrator</span>
        </div>
      </div>

      <div className="profile-sections">
        <div className="section">
          <h3>Account Information</h3>
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
                <span>{user?.username}</span>
                <button onClick={() => startEdit('username')} className="edit-btn">✎</button>
              </div>
            )}
          </div>
          <div className="info-item">
            <label>Email:</label>
            <span>{user?.email}</span>
          </div>
          <div className="info-item">
            <label>Role:</label>
            <span>Administrator</span>
          </div>
        </div>

        <div className="section">
          <h3>Admin Settings</h3>
          <Link to="/profile/edit" state={{ from: '/admin/profile' }} className="btn">Change Password</Link>
          <Link to="/admin/notifications" className="btn">Notification Settings</Link>
        </div>
      </div>

      <style jsx>{`
        .admin-profile {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }
        .profile-header {
          text-align: center;
          margin-bottom: 2rem;
        }
        .profile-header h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }
        .profile-info h2 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .role-badge {
          background: rgba(236, 72, 153, 0.3);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }
        .profile-sections {
          max-width: 800px;
          margin: 0 auto;
          display: grid;
          gap: 2rem;
        }
        .section {
          background: rgba(255,255,255,0.1);
          padding: 2rem;
          border-radius: 15px;
        }
        .section h3 {
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        .info-item {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          margin-bottom: 1rem;
          border-radius: 10px;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          margin-right: 1rem;
          margin-bottom: 1rem;
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
        }
      `}</style>
    </div>
  );
};

export default AdminProfile;