import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import eventService from '../../services/EventService';
import categoryService from '../../services/categoryService';

const EventForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: '',
    contactNumber: '',
    organizerName: user?.username || ''
  });
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
    
    // Real-time category updates
    const interval = setInterval(fetchCategories, 3000);
    
    const handleCategoryUpdate = () => {
      fetchCategories();
    };
    
    window.addEventListener('categoryUpdated', handleCategoryUpdate);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('categoryUpdated', handleCategoryUpdate);
    };
  }, []);

  const fetchCategories = async () => {
    try {
      const dbCategories = await categoryService.getAllCategories();
      const categoryNames = dbCategories.map(cat => cat.name);
      setCategories(categoryNames);
      
      // Reset category if current selection is no longer available
      if (formData.category && !categoryNames.includes(formData.category)) {
        setFormData(prev => ({ ...prev, category: '' }));
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setCategories([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateEvent = async () => {
    // Validate required fields
    if (!formData.title || !formData.date || !formData.time || !formData.location || !formData.description) {
      alert('❌ Please fill in all required fields.');
      return;
    }

    // Validate date is not in the past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      alert('❌ Cannot create events for past dates. Please select a future date.');
      return;
    }
    
    try {
      const eventData = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        location: formData.location,
        category: formData.category || 'Community',
        contactNumber: formData.contactNumber,
        organizerName: user?.username || formData.organizerName
      };
      
      await eventService.createEvent(eventData);
      
      // Also save to localStorage for compatibility
      const localEventData = {
        id: Date.now().toString(),
        ...eventData,
        status: 'PENDING',
        createdAt: new Date().toISOString()
      };
      
      const existingEvents = JSON.parse(localStorage.getItem('events') || '[]');
      existingEvents.push(localEventData);
      localStorage.setItem('events', JSON.stringify(existingEvents));
      
      alert('✅ Event created successfully! Waiting for admin approval.');
      navigate('/organizer-dashboard');
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('❌ Failed to create event. Please try again.');
    }
  };

  return (
    <div className="event-form-container">
      <div className="event-info">
        <p>✨ Bring your neighbourhood together with amazing events!</p>
        <p>📝 Fill out the details below to create your event. All events require admin approval before going live.</p>
        <p>🎯 Make sure to provide clear and engaging descriptions to attract more participants.</p>
      </div>
      
      <div className="event-form">
        <h2>Create New Event</h2>
        
        <div className="form-group">
          <label>Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
          />
        </div>

        <div className="form-group">
          <label>Event Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="form-group">
          <label>Event Time *</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows="4"
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location"
          />
        </div>

        <div className="form-group">
          <label>Category *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select Category</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

       

        <div className="form-group">
          <label>Contact Number</label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="Enter contact number"
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            onClick={() => navigate('/organizer-dashboard')}
            className="btn btn-secondary"
          >
            Back to Dashboard
          </button>
          <button 
            type="button" 
            onClick={handleCreateEvent}
            className="btn btn-primary"
          >
            Create Event
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .event-form-container {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
        }

        .event-form {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          color: white;
        }

        .event-form h2 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 1rem;
          text-align: center;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .event-info {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          max-width: 600px;
          text-align: center;
        }

        .event-info p {
          margin: 0.8rem 0;
          font-size: 1.1rem;
          color: white;
          line-height: 1.6;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #f0dcf0ff;
          font-size: 1.1rem;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          width: 100%;
          padding: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          border-radius: 10px;
          background: rgba(255,255,255,0.1);
          color: black;
          font-size: 1.1rem;
          transition: all 0.3s ease;
        }

        .form-group input::placeholder,
        .form-group textarea::placeholder {
          color: rgba(255,255,255,0.6);
        }

        .form-group input:focus,
        .form-group textarea:focus,
        .form-group select:focus {
          outline: none;
          border-color: rgba(236,72,153,0.6);
          box-shadow: 0 0 0 3px rgba(236,72,153,0.2);
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
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
        }
      `}</style>
    </div>
  );
};

export default EventForm;