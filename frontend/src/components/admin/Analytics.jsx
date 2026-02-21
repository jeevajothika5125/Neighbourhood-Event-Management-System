import React, { useState, useEffect } from 'react';
import analyticsService from '../../services/analyticsService';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    totalEvents: 0,
    totalUsers: 0,
    totalRegistrations: 0,
    eventsByStatus: { approved: 0, pending: 0, rejected: 0 },
    usersByRole: { organizers: 0, participants: 0, admins: 0 },
    topOrganizers: [],
    recentActivity: []
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      // Fetch from database
      const stats = await analyticsService.getAnalyticsStats();
      const topOrganizers = await analyticsService.getTopOrganizers();
      
      if (stats) {
        const eventsByStatus = {
          approved: stats.approvedEvents || 0,
          pending: stats.pendingEvents || 0,
          rejected: (stats.totalEvents || 0) - (stats.approvedEvents || 0) - (stats.pendingEvents || 0)
        };

        const usersByRole = {
          organizers: stats.usersByRole?.ORGANIZER || 0,
          participants: stats.usersByRole?.PARTICIPANT || 0,
          admins: stats.usersByRole?.ADMIN || 0
        };

        const formattedTopOrganizers = topOrganizers.map(org => ({
          name: org.organizer,
          events: org.eventCount
        }));

        setAnalytics({
          totalEvents: stats.totalEvents || 0,
          totalUsers: stats.totalUsers || 0,
          totalRegistrations: stats.totalRegistrations || 0,
          eventsByStatus,
          usersByRole,
          topOrganizers: formattedTopOrganizers,
          recentActivity: []
        });
      } else {
        // Fallback to localStorage
        const events = JSON.parse(localStorage.getItem('events') || '[]');
        const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const registrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');

        const eventsByStatus = {
          approved: events.filter(e => e.status === 'APPROVED').length,
          pending: events.filter(e => e.status === 'PENDING').length,
          rejected: events.filter(e => e.status === 'REJECTED').length
        };

        const usersByRole = {
          organizers: users.filter(u => u.role === 'ORGANIZER').length,
          participants: users.filter(u => u.role === 'PARTICIPANT').length,
          admins: users.filter(u => u.role === 'ADMIN').length
        };

        const organizerStats = {};
        events.forEach(event => {
          if (organizerStats[event.organizerName]) {
            organizerStats[event.organizerName]++;
          } else {
            organizerStats[event.organizerName] = 1;
          }
        });

        const topOrganizers = Object.entries(organizerStats)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([name, count]) => ({ name, events: count }));

        setAnalytics({
          totalEvents: events.length,
          totalUsers: users.length,
          totalRegistrations: registrations.length,
          eventsByStatus,
          usersByRole,
          topOrganizers,
          recentActivity: []
        });
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h2>📊 Analytics Dashboard</h2>
        <p>System overview and statistics</p>
      </div>

      <div className="stats-grid">
       
        <div className="stat-card">
          <div className="stat-number">{analytics.totalUsers}</div>
          <div className="stat-label">Total Users</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-number">{analytics.eventsByStatus.approved}</div>
          <div className="stat-label">Approved Events</div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Events by Status</h3>
          <div className="chart-data">
            <div className="chart-item">
              <span className="chart-label">Approved</span>
              <div className="chart-bar">
                <div className="chart-fill approved" style={{width: `${(analytics.eventsByStatus.approved / analytics.totalEvents) * 100 || 0}%`}}></div>
              </div>
              <span className="chart-value">{analytics.eventsByStatus.approved}</span>
            </div>
            <div className="chart-item">
              <span className="chart-label">Pending</span>
              <div className="chart-bar">
                <div className="chart-fill pending" style={{width: `${(analytics.eventsByStatus.pending / analytics.totalEvents) * 100 || 0}%`}}></div>
              </div>
              <span className="chart-value">{analytics.eventsByStatus.pending}</span>
            </div>
            <div className="chart-item">
              <span className="chart-label">Rejected</span>
              <div className="chart-bar">
                <div className="chart-fill rejected" style={{width: `${(analytics.eventsByStatus.rejected / analytics.totalEvents) * 100 || 0}%`}}></div>
              </div>
              <span className="chart-value">{analytics.eventsByStatus.rejected}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Users by Role</h3>
          <div className="chart-data">
            <div className="chart-item">
              <span className="chart-label">Organizers</span>
              <div className="chart-bar">
                <div className="chart-fill organizer" style={{width: `${(analytics.usersByRole.organizers / analytics.totalUsers) * 100 || 0}%`}}></div>
              </div>
              <span className="chart-value">{analytics.usersByRole.organizers}</span>
            </div>
            <div className="chart-item">
              <span className="chart-label">Participants</span>
              <div className="chart-bar">
                <div className="chart-fill participant" style={{width: `${(analytics.usersByRole.participants / analytics.totalUsers) * 100 || 0}%`}}></div>
              </div>
              <span className="chart-value">{analytics.usersByRole.participants}</span>
            </div>
            <div className="chart-item">
              <span className="chart-label">Admins</span>
              <div className="chart-bar">
                <div className="chart-fill admin" style={{width: `${(analytics.usersByRole.admins / analytics.totalUsers) * 100 || 0}%`}}></div>
              </div>
              <span className="chart-value">{analytics.usersByRole.admins}</span>
            </div>
          </div>
        </div>

        <div className="analytics-card">
          <h3>Top Organizers</h3>
          <div className="top-list">
            {analytics.topOrganizers.map((organizer, index) => (
              <div key={organizer.name} className="top-item">
                <span className="rank">#{index + 1}</span>
                <span className="name">{organizer.name}</span>
                <span className="count">{organizer.events} events</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="back-button">
        <a href="/admin-dashboard" className="btn btn-secondary">← Back to Dashboard</a>
      </div>

      <style jsx>{`
        .analytics {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .analytics-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .analytics-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .stats-grid {
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

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .analytics-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 2rem;
        }

        .analytics-card h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-bottom: 1.5rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .chart-data {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chart-item {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .chart-label {
          min-width: 80px;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.9);
        }

        .chart-bar {
          flex: 1;
          height: 20px;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .chart-fill {
          height: 100%;
          border-radius: 10px;
          transition: width 0.3s ease;
        }

        .chart-fill.approved {
          background: linear-gradient(45deg, #22c55e, #16a34a);
        }

        .chart-fill.pending {
          background: linear-gradient(45deg, #f59e0b, #d97706);
        }

        .chart-fill.rejected {
          background: linear-gradient(45deg, #ef4444, #dc2626);
        }

        .chart-fill.organizer {
          background: linear-gradient(45deg, #3b82f6, #2563eb);
        }

        .chart-fill.participant {
          background: linear-gradient(45deg, #22c55e, #16a34a);
        }

        .chart-fill.admin {
          background: linear-gradient(45deg, #ec4899, #be185d);
        }

        .chart-value {
          min-width: 30px;
          text-align: right;
          font-weight: 600;
          color: white;
        }

        .top-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .top-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .rank {
          font-weight: 700;
          color: #fbbf24;
          min-width: 30px;
        }

        .name {
          flex: 1;
          color: white;
        }

        .count {
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }

        .back-button {
          text-align: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.3s ease;
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
      `}</style>
    </div>
  );
};

export default Analytics;