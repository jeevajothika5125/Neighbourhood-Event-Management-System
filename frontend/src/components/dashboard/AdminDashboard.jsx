import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import eventService from '../../services/EventService';

const AdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);

  useEffect(() => {
    fetchEvents();
    
    // Listen for registration events
    const handleRegistrationUpdate = () => {
      fetchEvents();
    };
    
    window.addEventListener('eventRegistration', handleRegistrationUpdate);
    window.addEventListener('eventCancellation', handleRegistrationUpdate);
    
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchEvents, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('eventRegistration', handleRegistrationUpdate);
      window.removeEventListener('eventCancellation', handleRegistrationUpdate);
    };
  }, []);

  const fetchEvents = async () => {
    try {
      // Fetch from database
      const dbEvents = await eventService.getAllEvents();
      const dbPendingEvents = await eventService.getPendingEvents();
      
      // Also get from localStorage for compatibility
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const storedRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      
      // Combine database and localStorage events
      const allEvents = [...dbEvents, ...storedEvents];
      const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id || e.title === event.title)
      );
      
      setEvents(uniqueEvents);
      setPendingEvents(dbPendingEvents.length > 0 ? dbPendingEvents : storedEvents.filter(event => event.status === 'PENDING'));
      setTotalRegistrations(storedRegistrations.length);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // Fallback to localStorage
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const storedRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      setEvents(storedEvents);
      setPendingEvents(storedEvents.filter(event => event.status === 'PENDING'));
      setTotalRegistrations(storedRegistrations.length);
    }
  };

  const handleEventAction = async (eventId, action) => {
    try {
      // Update in database
      await eventService.updateEventStatus(eventId, action);
      
      // Also update localStorage for compatibility
      const updatedEvents = events.map(event => 
        event.id === eventId 
          ? { ...event, status: action, approvedAt: new Date().toISOString() }
          : event
      );
      
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      // Refresh events from database
      await fetchEvents();
      
      alert(`Event ${action.toLowerCase()} successfully!`);
    } catch (error) {
      console.error('Failed to update event status:', error);
      alert('Failed to update event status. Please try again.');
    }
  };

  const stats = [
    { title: 'Total Events', value: events.length.toString(), icon: '📅', color: '#3b82f6' },
    { title: 'Pending Approval', value: pendingEvents.length.toString(), icon: '⏳', color: '#f59e0b' },
    { title: 'Approved Events', value: events.filter(e => e.status === 'APPROVED').length.toString(), icon: '✅', color: '#10b981' },
    { title: 'Total Registrations', value: totalRegistrations.toString(), icon: '👥', color: '#8b5cf6' },
  ];

  const recentActivities = [
    { action: 'New user registered', user: 'John Doe', time: '2 minutes ago' },
    { action: 'Event created', user: 'Jane Smith', time: '5 minutes ago' },
    { action: 'Payment processed', user: 'Mike Johnson', time: '10 minutes ago' },
    { action: 'Event cancelled', user: 'Sarah Wilson', time: '15 minutes ago' },
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>👨‍💼 Admin Dashboard</h1>
        <p>Welcome back! Here's what's happening with your platform today.</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Quick Actions */}
        <div className="dashboard-card">
          <h2>🚀 Quick Actions</h2>
          <div className="action-buttons">
            <Link to="/users" className="action-btn">
              <span className="action-icon">👥</span>
              Manage Users
            </Link>
            <Link to="/admin/events" className="action-btn">
              <span className="action-icon">📅</span>
              View All Events
            </Link>
            <Link to="/analytics" className="action-btn">
              <span className="action-icon">📊</span>
              Analytics
            </Link>
            <Link to="/settings" className="action-btn">
              <span className="action-icon">⚙️</span>
              System Settings
            </Link>
          </div>
        </div>

        {/* Pending Events for Approval */}
        <div className="dashboard-card">
          <h2>⏳ Pending Event Approvals</h2>
          <div className="pending-events">
            {pendingEvents.length === 0 ? (
              <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>No pending events</p>
            ) : (
              pendingEvents.map(event => (
                <div key={event.id} className="pending-event">
                  <div className="event-info">
                    <h4>{event.title}</h4>
                    <p>by {event.organizerName}</p>
                    <p>{event.date} • {event.location}</p>
                  </div>
                  <div className="event-actions">
                    <button 
                      onClick={() => handleEventAction(event.id, 'APPROVED')}
                      className="approve-btn"
                    >
                      ✅ Approve
                    </button>
                    <button 
                      onClick={() => handleEventAction(event.id, 'REJECTED')}
                      className="reject-btn"
                    >
                      ❌ Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>


      </div>

      <style jsx>{`
        .dashboard-container {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          margin-bottom: 0.5rem;
        }

        .dashboard-header p {
          font-size: 1.2rem;
          opacity: 0.9;
          color: white;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(236,72,153,0.3);
        }

        .stat-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          color: white;
        }

        .stat-content h3 {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
          margin: 0;
        }

        .stat-content p {
          color: rgba(255,255,255,0.8);
          margin: 0;
          font-size: 0.875rem;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
        }

        .dashboard-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .dashboard-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(59,130,246,0.2);
        }

        .dashboard-card h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin-bottom: 1.5rem;
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 1rem;
        }

        .action-btn {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          text-decoration: none;
          color: white;
          font-weight: 500;
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .action-btn:hover {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(236,72,153,0.3);
        }

        .action-icon {
          font-size: 1.5rem;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          background: rgba(255,255,255,0.2);
        }

        .activity-action {
          font-weight: 500;
          color: white;
          margin: 0;
        }

        .activity-user {
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        .activity-time {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.6);
        }



        .pending-events {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-height: 400px;
          overflow-y: auto;
        }

        .pending-event {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          border-left: 4px solid #f59e0b;
        }

        .event-info h4 {
          margin: 0 0 0.25rem 0;
          color: white;
          font-weight: 600;
        }

        .event-info p {
          margin: 0;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.8);
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
        }

        .approve-btn, .reject-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 50px;
          font-size: 0.875rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .approve-btn {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
          box-shadow: 0 4px 15px rgba(16,185,129,0.3);
        }

        .approve-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(16,185,129,0.4);
        }

        .reject-btn {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239,68,68,0.3);
        }

        .reject-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239,68,68,0.4);
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;