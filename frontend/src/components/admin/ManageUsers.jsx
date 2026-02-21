import React, { useState, useEffect } from 'react';
import userService from '../../services/userService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // Fetch from database
      const dbUsers = await userService.getAllUsers();
      
      // Also get from localStorage for compatibility
      const storedUsers = localStorage.getItem('users');
      const localUsers = storedUsers ? JSON.parse(storedUsers) : [];
      
      // Combine and deduplicate users
      const allUsers = [...dbUsers, ...localUsers];
      const uniqueUsers = allUsers.filter((user, index, self) => 
        index === self.findIndex(u => u.username === user.username)
      );
      
      setUsers(uniqueUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      // Fallback to localStorage
      const storedUsers = localStorage.getItem('users');
      const allUsers = storedUsers ? JSON.parse(storedUsers) : [];
      setUsers(allUsers);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="manage-users">
      <div className="users-header">
        <h2>👥 Manage Users</h2>
        <p>All registered users in the system</p>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id || user.username}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge role-${user.role.toLowerCase()}`}>
                    {user.role}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {users.length === 0 && (
          <div className="no-users">
            <p>No users found.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .manage-users {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .users-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .users-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .users-table {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 1.5rem;
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
        }

        th, td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        th {
          font-weight: 600;
          color: #fce7f3;
          border-bottom: 2px solid rgba(255,255,255,0.2);
        }

        .role-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .role-admin {
          background: rgba(236, 72, 153, 0.3);
          color: white;
        }

        .role-organizer {
          background: rgba(59, 130, 246, 0.3);
          color: white;
        }

        .role-participant {
          background: rgba(34, 197, 94, 0.3);
          color: white;
        }

        .status-active {
          background: rgba(34, 197, 94, 0.3);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .no-users {
          text-align: center;
          padding: 3rem;
          color: rgba(255,255,255,0.8);
        }

        .loading {
          text-align: center;
          padding: 3rem;
          font-size: 1.2rem;
        }
      `}</style>
    </div>
  );
};

export default ManageUsers;