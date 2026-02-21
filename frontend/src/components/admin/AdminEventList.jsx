import React, { useState, useEffect } from 'react';
import { usePagination } from '../../hooks/usePagination';
import EventCard from '../events/EventCard';

const AdminEventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const {
    currentPage,
    totalPages,
    paginatedData,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    hasNextPage,
    hasPreviousPage
  } = usePagination(events, 4);

  useEffect(() => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="loading-spinner">Loading events...</div>;

  return (
    <div className="admin-event-list-container">
      <div className="admin-event-list-header">
        <h2>All Events</h2>
        <p>Manage all events in the system</p>
      </div>

      <div className="events-grid">
        {paginatedData.length > 0 ? (
          paginatedData.map(event => (
            <EventCard key={event.eventId} event={event} />
          ))
        ) : (
          <div className="no-events">
            <p>No events found.</p>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={goToPreviousPage} 
            disabled={!hasPreviousPage}
            className="btn btn-secondary"
          >
            Previous
          </button>
          
          <span className="page-info">
            Page {currentPage} of {totalPages}
          </span>
          
          <button 
            onClick={goToNextPage} 
            disabled={!hasNextPage}
            className="btn btn-secondary"
          >
            Next
          </button>
        </div>
      )}
      
      <div className="back-button-container">
        <a href="/admin-dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </a>
      </div>
      
      <style jsx>{`
        .admin-event-list-container {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .admin-event-list-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .admin-event-list-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          margin-bottom: 0.5rem;
        }

        .admin-event-list-header p {
          font-size: 1.1rem;
          color: rgba(255,255,255,0.8);
          margin: 0;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .no-events {
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          padding: 3rem;
          text-align: center;
        }

        .no-events p {
          font-size: 1.2rem;
          color: white;
          margin: 0;
          opacity: 0.8;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin: 2rem 0;
        }

        .page-info {
          color: white;
          font-weight: 600;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .btn {
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          text-decoration: none;
          display: inline-block;
          font-size: 0.9rem;
        }

        .btn-secondary {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          box-shadow: 0 4px 15px rgba(236,72,153,0.3);
        }

        .btn-secondary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(236,72,153,0.4);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
          font-size: 1.2rem;
          color: white;
          background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
        }

        .back-button-container {
          display: flex;
          justify-content: center;
          margin-top: 3rem;
        }

        @media (max-width: 768px) {
          .admin-event-list-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .events-grid {
            grid-template-columns: 1fr;
          }

          .pagination {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminEventList;