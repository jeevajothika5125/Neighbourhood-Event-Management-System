import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import EventCard from '../events/EventCard';
import EventList from '../events/EventList';
import eventRegistrationService from '../../services/eventRegistrationService';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [eventStats, setEventStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    totalRegistrations: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    fetchOrganizerData();
    
    // Listen for registration events
    const handleRegistrationUpdate = () => {
      fetchOrganizerData();
    };
    
    window.addEventListener('eventRegistration', handleRegistrationUpdate);
    window.addEventListener('eventCancellation', handleRegistrationUpdate);
    
    // Refresh data every 5 seconds for real-time updates
    const interval = setInterval(fetchOrganizerData, 5000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('eventRegistration', handleRegistrationUpdate);
      window.removeEventListener('eventCancellation', handleRegistrationUpdate);
    };
  }, [user]);

  const fetchOrganizerData = async () => {
    try {
      const storedEvents = localStorage.getItem('events');
      const allEvents = storedEvents ? JSON.parse(storedEvents) : [];
      
      // Filter events created by this organizer
      const organizerEvents = allEvents.filter(event => 
        event.organizerName === user?.username
      );
      
      setMyEvents(organizerEvents);

      // Get registration count from database
      let totalRegistrations = 0;
      try {
        totalRegistrations = await eventRegistrationService.getOrganizerRegistrationCount(user?.username);
      } catch (error) {
        console.error('Failed to fetch registration count from database:', error);
        // Fallback to localStorage
        const storedRegistrations = localStorage.getItem('eventRegistrations');
        const allRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
        totalRegistrations = organizerEvents.reduce((sum, event) => {
          const eventRegistrations = allRegistrations.filter(reg => reg.eventId === event.id);
          return sum + eventRegistrations.length;
        }, 0);
      }
      
      // Calculate stats
      const stats = {
        total: organizerEvents.length,
        pending: organizerEvents.filter(e => e.status === 'PENDING').length,
        approved: organizerEvents.filter(e => e.status === 'APPROVED').length,
        rejected: organizerEvents.filter(e => e.status === 'REJECTED').length,
        totalRegistrations: totalRegistrations
      };
      
      setEventStats(stats);
    } catch (error) {
      console.error('Failed to fetch organizer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading-spinner">Loading dashboard...</div>;

  return (
    <div className="organizer-dashboard">
      <div className="dashboard-header">
        <h1>Organizer Dashboard</h1>
        <p>Welcome back, {user?.username}! Manage your events here.</p>
      </div>

     

      {activeTab === 'dashboard' && (
        <>
          <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-number">{eventStats.total}</div>
          <div className="stat-label">Total Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{eventStats.pending}</div>
          <div className="stat-label">Pending Approval</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{eventStats.approved}</div>
          <div className="stat-label">Approved Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{eventStats.rejected}</div>
          <div className="stat-label">Rejected Events</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{eventStats.totalRegistrations}</div>
          <div className="stat-label">Joined Events</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <h3>My Events</h3>
          </div>
          
          {myEvents.length > 0 ? (
            <div className="events-grid">
              {myEvents.slice(0, 6).map(event => (
                <EventCard key={event.eventId} event={event} />
              ))}
            </div>
          ) : (
            <div className="no-events">
              <p>You haven't created any events yet.</p>
              <a href="/events/create" className="btn btn-primary">Create Your First Event</a>
            </div>
          )}
          
          {myEvents.length > 6 && (
            <a href="/organizer/events" className="view-all-link">View All My Events →</a>
          )}
        </div>

        <div className="dashboard-section" id="recent-activity">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {myEvents
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="activity-item">
                  <div className="activity-info">
                    <h4>{event.title}</h4>
                    <p>Created on {new Date(event.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status status-${event.status?.toLowerCase()}`}>
                    {event.status}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

          <div className="quick-actions">
            <h3>Quick Actions</h3>
            <div className="action-buttons">
              <button onClick={() => setActiveTab('eventlist')} className="btn btn-secondary">Event List</button>
              <a href="/events/create" className="btn btn-secondary">Create Event</a>
              <a href="/venues" className="btn btn-secondary">View Venues</a>
              
            </div>
          </div>
        </>
      )}

      {activeTab === 'eventlist' && (
        <div className="eventlist-container">
          <EventList />
        </div>
      )}
      
      <style jsx>{`
        .organizer-dashboard {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .dashboard-tabs {
          display: flex;
          max-width: 400px;
          margin: 0 auto 2rem;
          background: rgba(255,255,255,0.1);
          border-radius: 15px;
          padding: 0.5rem;
        }

        .tab-btn {
          flex: 1;
          padding: 1rem 2rem;
          border: none;
          background: transparent;
          color: white;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .tab-btn.active {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          box-shadow: 0 4px 15px rgba(236,72,153,0.3);
        }

        .tab-btn:hover:not(.active) {
          background: rgba(255,255,255,0.1);
        }

        .eventlist-container {
          background: transparent;
        }

        .dashboard-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .dashboard-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
        }

        .dashboard-header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(236,72,153,0.3);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.4);
        }

        .stat-label {
          font-size: 1rem;
          opacity: 0.8;
        }

        .dashboard-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .dashboard-section {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .section-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .no-events {
          text-align: center;
          padding: 3rem;
          opacity: 0.8;
        }

        .no-events p {
          margin-bottom: 1.5rem;
          font-size: 1.1rem;
        }

        .activity-list {
          space-y: 1rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .activity-info h4 {
          font-size: 1.1rem;
          margin-bottom: 0.25rem;
          color: white;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .activity-info p {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-pending {
          background: rgba(251, 191, 36, 0.3);
          color: #fbbf24;
        }

        .status-approved {
          background: rgba(34, 197, 94, 0.3);
          color: #22c55e;
        }

        .quick-actions {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .quick-actions h3 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          text-align: center;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .action-buttons {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .btn {
          display: inline-block;
          padding: 1rem 1.5rem;
          border-radius: 50px;
          text-decoration: none;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: 2px solid transparent;
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

        .view-all-link {
          display: block;
          text-align: center;
          margin-top: 1.5rem;
          color: white;
          text-decoration: none;
          font-weight: 500;
          opacity: 0.8;
        }

        .view-all-link:hover {
          opacity: 1;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 50vh;
          font-size: 1.2rem;
          color: white;
        }

        @media (max-width: 768px) {
          .organizer-dashboard {
            padding: 1rem;
          }

          .dashboard-content {
            grid-template-columns: 1fr;
          }

          .dashboard-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .action-buttons {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default OrganizerDashboard;