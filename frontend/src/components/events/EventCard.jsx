import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventRegistrationService from '../../services/eventRegistrationService';

const EventCard = ({ event }) => {
  const { user, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(event);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationCount, setRegistrationCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    
    setLoading(true);
    try {
      const registrationData = {
        username: user.username,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.date,
        eventTime: event.time || '00:00',
        eventLocation: event.location,
        eventCategory: event.category || 'General',
        eventDescription: event.description,
        organizerUsername: event.organizerName
      };
      
      console.log('Registering for event:', registrationData);
      const result = await eventRegistrationService.registerForEvent(registrationData);
      console.log('Registration result:', result);
      
      setIsRegistered(true);
      setRegistrationCount(prev => prev + 1);
      alert('Successfully registered for the event!');
    } catch (error) {
      console.error('Registration failed:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnregister = async () => {
    if (!window.confirm('Are you sure you want to unregister from this event?')) {
      return;
    }
    
    setLoading(true);
    try {
      await eventRegistrationService.unregisterFromEvent(user.username, event.id);
      setIsRegistered(false);
      setRegistrationCount(prev => prev - 1);
      alert('Successfully unregistered from the event!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    window.location.href = `/event-details/${event.id}`;
  };

  const canEdit = user?.role === 'Admin' || 
    (user?.role === 'Organizer' && event.organizerName === user.username);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(event);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = () => {
    const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
    const updatedEvents = storedEvents.map(e => 
      e.id === event.id ? editForm : e
    );
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    
    Object.assign(event, editForm);
    
    setIsEditing(false);
    alert('Event updated successfully!');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(event);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      const storedEvents = JSON.parse(localStorage.getItem('events') || '[]');
      const updatedEvents = storedEvents.filter(e => e.id !== event.id);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      
      alert('Event deleted successfully!');
      window.location.reload();
    }
  };

  useEffect(() => {
    const fetchRegistrationData = async () => {
      console.log('Fetching registration data for event:', event.id, 'user:', user?.username);
      
      if (isAuthenticated && user) {
        try {
          const registered = await eventRegistrationService.checkRegistration(user.username, event.id);
          console.log('Registration status:', registered);
          setIsRegistered(registered);
        } catch (error) {
          console.error('Failed to check registration:', error);
        }
      }
      
      try {
        const count = await eventRegistrationService.getEventRegistrationCount(event.id);
        console.log('Registration count:', count);
        setRegistrationCount(count);
      } catch (error) {
        console.error('Failed to fetch registration count:', error);
      }
    };
    
    fetchRegistrationData();
  }, [event.id, isAuthenticated, user]);

  return (
    <div className="event-card">
      <div className="event-header">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editForm.title}
            onChange={handleEditChange}
            className="edit-title"
            placeholder="Event Title"
          />
        ) : (
          <h3 className="event-title">{event.title}</h3>
        )}
        <span className={`event-status status-${event.status?.toLowerCase()}`}>
          {event.status || 'PENDING'}
        </span>
      </div>
      
      <div className="event-details">
        <p className="event-date">
          <span className="icon">📅</span>
          <strong>Date:</strong> 
          {isEditing ? (
            <input
              type="date"
              name="date"
              value={editForm.date}
              onChange={handleEditChange}
              className="edit-input"
            />
          ) : (
            event.date
          )}
        </p>
        <p className="event-location">
          <span className="icon">📍</span>
          <strong>Location:</strong> 
          {isEditing ? (
            <input
              type="text"
              name="location"
              value={editForm.location}
              onChange={handleEditChange}
              className="edit-input"
              placeholder="Location"
            />
          ) : (
            event.location
          )}
        </p>
        <p className="event-organizer">
          <span className="icon">👤</span>
          <strong>Organizer:</strong> {event.organizerName}
        </p>
        <p className="event-contact">
          <span className="icon">📞</span>
          <strong>Contact:</strong> 
          {isEditing ? (
            <input
              type="tel"
              name="contactNumber"
              value={editForm.contactNumber}
              onChange={handleEditChange}
              className="edit-input"
              placeholder="Contact Number"
            />
          ) : (
            event.contactNumber
          )}
        </p>
        <p className="event-registrations">
          <span className="icon">👥</span>
          <strong>Registrations:</strong> {registrationCount}
        </p>
      </div>

      <div className="event-description">
        {isEditing ? (
          <textarea
            name="description"
            value={editForm.description}
            onChange={handleEditChange}
            className="edit-textarea"
            placeholder="Event Description"
            rows="3"
          />
        ) : (
          <p>{event.description}</p>
        )}
      </div>

      <div className="event-actions">
        {user?.role === 'PARTICIPANT' && event.status === 'APPROVED' && (
          isRegistered ? (
            <button onClick={handleUnregister} className="btn btn-warning" disabled={loading}>
              {loading ? 'Processing...' : 'Unregister'}
            </button>
          ) : (
            <button onClick={handleRegister} className="btn btn-success" disabled={loading}>
              {loading ? 'Registering...' : 'Register for Event'}
            </button>
          )
        )}
        
        {canEdit && (
          isEditing ? (
            <>
              <button onClick={handleSave} className="btn btn-success">
                Save
              </button>
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={handleEdit} className="btn btn-primary">
                Edit Event
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete Event
              </button>
            </>
          )
        )}
      </div>
      
      <style jsx>{`
        .event-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 1.5rem;
          transition: all 0.3s ease;
          color: white;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(236,72,153,0.3);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .event-title {
          font-size: 1.3rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin: 0;
          flex: 1;
        }

        .event-status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status-approved {
          background: rgba(5, 232, 88, 0.95);
          color: white !important;
        }

        .status-pending {
          background: rgba(235, 172, 15, 1);
          color: white !important;
        }

        .status-rejected {
          background: rgba(206, 56, 56, 0.95);
          color: #f9ededff;
        }

        .event-details {
          margin-bottom: 1rem;
        }

        .event-details p {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
          color: white;
        }

        .icon {
          font-size: 1rem;
        }

        .event-description {
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }

        .event-description p {
          margin: 0;
          line-height: 1.5;
          color: rgba(255,255,255,0.9);
        }

        .event-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 0.9rem;
          min-width: 100px;
          flex: 1;
        }

        .edit-title {
          width: 100%;
          padding: 0.5rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .edit-input {
          padding: 0.25rem 0.5rem;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 5px;
          background: rgba(255,255,255,0.1);
          color: white;
          font-size: 0.8rem;
          margin-left: 0.5rem;
          width: 120px;
        }

        .edit-textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: white;
          resize: vertical;
          font-family: inherit;
        }

        .edit-title::placeholder,
        .edit-input::placeholder,
        .edit-textarea::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .edit-title:focus,
        .edit-input:focus,
        .edit-textarea:focus {
          outline: none;
          border-color: rgba(236,72,153,0.6);
          box-shadow: 0 0 0 2px rgba(236,72,153,0.2);
        }

        .btn-primary {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          box-shadow: 0 4px 15px rgba(236,72,153,0.3);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(236,72,153,0.4);
        }

        .btn-success {
          background: linear-gradient(45deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 4px 15px rgba(34,197,94,0.3);
        }

        .btn-success:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(34,197,94,0.4);
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

        .btn-danger {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          color: white;
          box-shadow: 0 4px 15px rgba(239,68,68,0.3);
        }

        .btn-danger:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239,68,68,0.4);
        }

        .btn-warning {
          background: linear-gradient(45deg, #f59e0b, #d97706);
          color: white;
          box-shadow: 0 4px 15px rgba(245,158,11,0.3);
        }

        .btn-warning:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(245,158,11,0.4);
        }

        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .event-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .event-actions {
            flex-direction: column;
          }

          .btn {
            flex: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EventCard;