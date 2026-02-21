import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, isOrganizer } = useAuth();

  const menuItems = [
    { label: 'Dashboard', href: '/dashboard', roles: ['Admin', 'Organizer', 'Participant'] },
    { label: 'Events', href: '/events', roles: ['Admin', 'Organizer', 'Participant'] },
    { label: 'Create Event', href: '/events/create', roles: ['Admin', 'Organizer'] },
    { label: 'Manage Users', href: '/admin/users', roles: ['Admin'] },
    { label: 'Venues', href: '/venues', roles: ['Admin', 'Organizer'] },
    { label: 'Analytics', href: '/admin/analytics', roles: ['Admin'] },
    { label: 'Profile', href: '/profile', roles: ['Admin', 'Organizer', 'Participant'] }
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role)
  );

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header">
        <h3>Menu</h3>
        <button onClick={onClose} className="close-btn">&times;</button>
      </div>
      
      <nav className="sidebar-nav">
        {filteredMenuItems.map((item, index) => (
          <a 
            key={index} 
            href={item.href} 
            className="sidebar-link"
            onClick={onClose}
          >
            {item.label}
          </a>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="user-info">
          <p>{user?.username}</p>
          <small>{user?.role}</small>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;