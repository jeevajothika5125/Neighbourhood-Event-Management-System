import React, { useState, useEffect } from 'react';
import { usePagination } from '../../hooks/usePagination';
import EventCard from './EventCard';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  
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

  const handleEdit = (event) => {
    setEditingId(event.id);
    setEditForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location
    });
  };

  const handleSave = (eventId) => {
    const updatedEvents = events.map(event => 
      event.id === eventId ? { ...event, ...editForm } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updatedEvents = events.filter(event => event.id !== eventId);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm({});
  };

  if (loading) return <div className="loading-spinner">Loading events...</div>;

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h2>Events</h2>
      </div>

      <div className="events-grid">
        {paginatedData.length > 0 ? (
          paginatedData.map(event => (
            <div key={event.id} className="event-item">
              {editingId === event.id ? (
                <div className="edit-form">
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                    placeholder="Event Title"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    placeholder="Description"
                  />
                  <input
                    type="date"
                    value={editForm.date}
                    onChange={(e) => setEditForm({...editForm, date: e.target.value})}
                  />
                  <input
                    type="time"
                    value={editForm.time}
                    onChange={(e) => setEditForm({...editForm, time: e.target.value})}
                  />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    placeholder="Location"
                  />
                  <div className="edit-actions">
                    <button onClick={() => handleSave(event.id)} className="btn-save">Save</button>
                    <button onClick={handleCancel} className="btn-cancel">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="event-display">
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                  <div className="event-details">
                    <span>📅 {event.date}</span>
                    <span>🕐 {event.time}</span>
                    <span>📍 {event.location}</span>
                    <span className={`status ${event.status?.toLowerCase()}`}>{event.status}</span>
                  </div>
                  <div className="event-actions">
                    <button onClick={() => handleEdit(event)} className="btn-edit">Edit</button>
                    <button onClick={() => handleDelete(event.id)} className="btn-delete">Delete</button>
                  </div>
                </div>
              )}
            </div>
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
        <a href="/organizer-dashboard" className="btn btn-secondary">
          ← Back to Dashboard
        </a>
      </div>
      
      <style jsx>{`
        .event-list-container {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .event-list-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .event-list-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          margin-bottom: 0.5rem;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .event-item {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .event-item:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(236,72,153,0.3);
        }

        .event-display h3 {
          color: white;
          margin-bottom: 1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .event-display p {
          color: rgba(255,255,255,0.9);
          margin-bottom: 1rem;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
          margin-top: 0.5rem;
        }

        .status.approved { background: rgba(34, 197, 94, 0.3); color: #22c55e; }
        .status.pending { background: rgba(251, 191, 36, 0.3); color: #fbbf24; }
        .status.rejected { background: rgba(239, 68, 68, 0.3); color: #ef4444; }

        .event-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-edit, .btn-delete, .btn-save, .btn-cancel {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.8rem;
        }

        .btn-edit {
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          color: white;
        }

        .btn-delete {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
        }

        .btn-save {
          background: linear-gradient(45deg, #10b981, #059669);
          color: white;
        }

        .btn-cancel {
          background: linear-gradient(45deg, #6b7280, #4b5563);
          color: white;
        }

        .btn-edit:hover, .btn-delete:hover, .btn-save:hover, .btn-cancel:hover {
          transform: translateY(-2px);
        }

        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .edit-form input, .edit-form textarea {
          padding: 0.75rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 0.9rem;
        }

        .edit-form input::placeholder, .edit-form textarea::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .edit-form input:focus, .edit-form textarea:focus {
          outline: none;
          border-color: rgba(236,72,153,0.5);
          background: rgba(255,255,255,0.15);
        }

        .edit-actions {
          display: flex;
          gap: 0.5rem;
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
          .event-list-header {
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

export default EventList;