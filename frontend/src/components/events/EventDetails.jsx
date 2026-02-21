import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EventDetails = () => {
  const navigate = useNavigate();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    // Load event data from localStorage
    const savedEvent = localStorage.getItem('createdEvent');
    if (savedEvent) {
      setEventData(JSON.parse(savedEvent));
    }
  }, []);

  if (!eventData) {
    return (
      <div className="event-details-container">
        <div className="event-details-card">
          <div className="no-event">
            <h2>No Event Created Yet</h2>
            <p>Please create an event first to see the details here.</p>
            <button 
              onClick={() => navigate('/events/create')}
              className="btn btn-primary"
            >
              Create Event
            </button>
          </div>
        </div>
        <style jsx>{`
          .event-details-container {
            background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
            min-height: 100vh;
            padding: 2rem;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .event-details-card {
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
            backdrop-filter: blur(15px);
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            color: white;
          }
          .no-event h2 {
            font-size: 2rem;
            margin-bottom: 1rem;
            color: white;
          }
          .no-event p {
            font-size: 1.1rem;
            margin-bottom: 2rem;
            opacity: 0.8;
          }
          .btn {
            padding: 1rem 2rem;
            border-radius: 50px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            background: linear-gradient(45deg, #ec4899, #3b82f6);
            color: white;
            transition: all 0.3s ease;
          }
          .btn:hover {
            transform: translateY(-2px);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="event-details-container">
      <div className="event-details-card">
        <div className="event-header">
          <h1>{eventData.eventName}</h1>
          <span className="event-status">Approved</span>
        </div>

        <div className="event-content">
          <div className="event-info-grid">
            <div className="info-item">
              <div className="info-label">Organizer</div>
              <div className="info-value">{eventData.organizerName}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Date</div>
              <div className="info-value">{new Date(eventData.eventDate).toLocaleDateString()}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Time</div>
              <div className="info-value">{eventData.eventTime}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Location</div>
              <div className="info-value">{eventData.location}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Contact</div>
              <div className="info-value">{eventData.contactNumber}</div>
            </div>
          </div>

          <div className="description-section">
            <h3>Event Description</h3>
            <p>{eventData.description}</p>
          </div>

          <div className="action-buttons">
            <button 
              onClick={() => navigate('/organizer-dashboard')}
              className="btn btn-secondary"
            >
              Back to Dashboard
            </button>
            <button 
              onClick={() => navigate('/events/1/edit')}
              className="btn btn-primary"
            >
              Edit Event
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .event-details-container {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .event-details-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          max-width: 800px;
          color: white;
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .event-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin: 0;
        }

        .event-status {
          background: rgba(34, 197, 94, 0.3);
          color: #22c55e;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .event-content {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .event-info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          background: rgba(255,255,255,0.1);
          padding: 1.5rem;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .info-label {
          font-size: 0.9rem;
          color: #fce7f3;
          font-weight: 600;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 1.1rem;
          color: white;
          font-weight: 500;
          text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }

        .description-section {
          background: rgba(255,255,255,0.1);
          padding: 2rem;
          border-radius: 15px;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .description-section h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          margin-bottom: 1rem;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .description-section p {
          font-size: 1.1rem;
          line-height: 1.6;
          color: white;
          opacity: 0.9;
        }

        .action-buttons {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 1rem;
        }

        .btn {
          padding: 1rem 2rem;
          border-radius: 50px;
          font-weight: 600;
          text-align: center;
          transition: all 0.3s ease;
          border: none;
          cursor: pointer;
          font-size: 1rem;
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

        @media (max-width: 768px) {
          .event-details-container {
            padding: 1rem;
          }

          .event-details-card {
            padding: 1.5rem;
          }

          .event-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .event-header h1 {
            font-size: 2rem;
          }

          .event-info-grid {
            grid-template-columns: 1fr;
          }

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default EventDetails;