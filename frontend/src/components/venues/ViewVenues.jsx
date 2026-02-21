import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewVenues = () => {
  const navigate = useNavigate();

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [message, setMessage] = useState('');

  const venues = [
    {
      id: 1,
      name: 'Community Center Hall',
      location: '123 Main Street, Downtown',
      capacity: 150,
      amenities: ['Projector', 'Sound System', 'Kitchen', 'Parking'],
      availability: 'Available',
      contact: '+1 (555) 123-4567',
      manager: 'John Smith',
      price: '$200/day'
    },
    {
      id: 2,
      name: 'Garden Pavilion',
      location: '456 Park Avenue, Central Park',
      capacity: 80,
      amenities: ['Outdoor Space', 'Tables', 'Chairs', 'Garden View'],
      availability: 'Available',
      contact: '+1 (555) 234-5678',
      manager: 'Sarah Johnson',
      price: '$150/day'
    },
    {
      id: 3,
      name: 'Conference Room A',
      location: '789 Business District, Suite 200',
      capacity: 50,
      amenities: ['WiFi', 'Whiteboard', 'AC', 'Coffee Machine'],
      availability: 'Booked',
      contact: '+1 (555) 345-6789',
      manager: 'Mike Wilson',
      price: '$100/day'
    },
    {
      id: 4,
      name: 'Sports Complex',
      location: '321 Athletic Way, Sports Center',
      capacity: 200,
      amenities: ['Gym Equipment', 'Locker Rooms', 'Parking', 'First Aid'],
      availability: 'Available',
      contact: '+1 (555) 456-7890',
      manager: 'Lisa Brown',
      price: '$300/day'
    }
  ];

  const handleSendMessage = (venue) => {
    setSelectedVenue(venue);
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    alert(`Message sent to ${selectedVenue.manager} at ${selectedVenue.name}:\n\n"${message}"`);
    setShowMessageModal(false);
    setMessage('');
    setSelectedVenue(null);
  };

  return (
    <div className="venues-container">
      <div className="venues-content">
        <div className="venues-header">
          <h1>Available Venues</h1>
          <p>Choose the perfect venue for your neighbourhood event</p>
        </div>

        <div className="venues-grid">
          {venues.map(venue => (
            <div key={venue.id} className="venue-card">
              <div className="venue-header">
                <h3>{venue.name}</h3>
                <span className={`status ${venue.availability.toLowerCase()}`}>
                  {venue.availability}
                </span>
              </div>
              
              <div className="venue-details">
                <div className="detail-item">
                  <span className="label">Location:</span>
                  <span className="value">{venue.location}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Capacity:</span>
                  <span className="value">{venue.capacity} people</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Contact:</span>
                  <span className="value">{venue.contact}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Manager:</span>
                  <span className="value">{venue.manager}</span>
                </div>
                
                <div className="detail-item">
                  <span className="label">Price:</span>
                  <span className="value">{venue.price}</span>
                </div>
                
                <div className="amenities">
                  <span className="label">Amenities:</span>
                  <div className="amenities-list">
                    {venue.amenities.map((amenity, index) => (
                      <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="venue-actions">
                <button 
                  onClick={() => handleSendMessage(venue)}
                  className="btn btn-primary"
                >
                  Send Message
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="back-button">
          <button 
            onClick={() => navigate('/organizer-dashboard')}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      {showMessageModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>Send Message to {selectedVenue?.manager}</h3>
              <button 
                onClick={() => setShowMessageModal(false)}
                className="close-btn"
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Venue:</strong> {selectedVenue?.name}</p>
              <p><strong>Contact:</strong> {selectedVenue?.contact}</p>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows="4"
                className="message-input"
              />
            </div>
            <div className="modal-actions">
              <button onClick={sendMessage} className="btn btn-primary">
                Send Message
              </button>
              <button 
                onClick={() => setShowMessageModal(false)} 
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .venues-container {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .venues-content {
          max-width: 1200px;
          margin: 0 auto;
        }

        .venues-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .venues-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .venues-header p {
          font-size: 1.2rem;
          opacity: 0.9;
        }

        .venues-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 3rem;
        }

        .venue-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          transition: all 0.3s ease;
        }

        .venue-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(236,72,153,0.3);
        }

        .venue-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .venue-header h3 {
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin: 0;
        }

        .status {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .status.available {
          background: rgba(2, 81, 31, 0.98);
          color: white;
        }

        .status.booked {
          background: rgba(241, 47, 47, 1);
          color: white;
        }

        .venue-details {
          margin-bottom: 2rem;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .label {
          font-weight: 600;
          color: #fce7f3;
        }

        .value {
          color: white;
        }

        .amenities {
          margin-top: 1rem;
        }

        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .amenity-tag {
          background: rgba(255,255,255,0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 15px;
          font-size: 0.8rem;
          color: white;
        }

        .venue-actions {
          text-align: center;
        }

        .back-button {
          text-align: center;
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

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 25px rgba(236,72,153,0.4);
        }

        .btn-primary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          max-width: 500px;
          width: 90%;
          color: #1f2937;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(0,0,0,0.1);
        }

        .modal-header h3 {
          margin: 0;
          color: #1f2937;
          font-size: 1.3rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
        }

        .modal-body {
          margin-bottom: 1.5rem;
        }

        .modal-body p {
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .message-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 10px;
          resize: vertical;
          font-family: inherit;
          margin-top: 1rem;
        }

        .message-input:focus {
          outline: none;
          border-color: #ec4899;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        @media (max-width: 768px) {
          .venues-container {
            padding: 1rem;
          }

          .venues-grid {
            grid-template-columns: 1fr;
          }

          .venue-header {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .venue-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ViewVenues;