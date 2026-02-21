import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEvents } from '../../context/EventsContext';
import { useAuth } from '../../context/AuthContext';
import eventRegistrationService from '../../services/eventRegistrationService';
import eventService from '../../services/EventService';
import reviewService from '../../services/reviewService';

const ResidentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showSearch, setShowSearch] = useState(false);
  const { myEvents, addEvent, removeEvent, isEventJoined, loadUserEvents } = useEvents();
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackEvent, setFeedbackEvent] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [upcomingEvents, setUpcomingEvents] = useState([]);

  const handleJoinEvent = async (eventId) => {
    const event = upcomingEvents.find(e => e.id === eventId);
    if (event && !isEventJoined(eventId)) {
      try {
        if (!event.title || !event.date) {
          throw new Error('Event is missing required details');
        }

        // Register in database with complete event details
        const registrationData = {
          username: user.username,
          eventId: event.id,
          eventTitle: event.title,
          eventDate: event.date,
          eventTime: event.time,
          eventLocation: event.location,
          eventCategory: event.category,
          eventDescription: event.description,
          organizerUsername: event.organizerName
        };
        
        // Remove any undefined values
        Object.keys(registrationData).forEach(key => 
          registrationData[key] === undefined && delete registrationData[key]
        );
        
        console.log('Registering for event:', registrationData);
        const result = await eventRegistrationService.registerForEvent(registrationData);
        console.log('Registration result:', result);
        
        // Add to user's events using the exact data from upcoming events
        const newEvent = {
          id: event.id,
          title: event.title,
          date: event.date,
          status: 'Confirmed',
          type: event.category,
          time: event.time,
          location: event.location,
          description: event.description,
          organizerName: event.organizerName
        };
        addEvent(newEvent);
        
        // Also store in localStorage for compatibility
        const storedRegistrations = localStorage.getItem('eventRegistrations');
        const allRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
        
        const registration = {
          id: Date.now().toString(),
          eventId: event.id,
          userId: user.username,
          eventTitle: event.title,
          organizerName: event.organizerName,
          registeredAt: new Date().toISOString(),
          attended: false
        };
        
        allRegistrations.push(registration);
        localStorage.setItem('eventRegistrations', JSON.stringify(allRegistrations));
        
        // Refresh user events to update context
        await loadUserEvents(user.username);
        
        // Trigger registration update event
        window.dispatchEvent(new CustomEvent('eventRegistration'));
        
        alert('Successfully joined event! Check "My Events" tab.');
      } catch (error) {
        console.error('Registration failed:', error);
        alert(error.message || 'Failed to join event. Please try again.');
      }
    } else {
      alert('You are already registered for this event!');
    }
  };

  const handleShowFeedback = (event) => {
    setFeedbackEvent(event);
    setShowFeedback(true);
  };

  const handleSubmitFeedback = async () => {
    const reviewData = {
      username: user.username,
      eventId: String(feedbackEvent.id),
      eventTitle: feedbackEvent.title,
      rating: feedback.rating,
      comment: feedback.comment || ''
    };
    
    await reviewService.submitReview(reviewData);
    alert(`Thank you for your ${feedback.rating}-star review!`);
    setShowFeedback(false);
    setFeedback({ rating: 5, comment: '' });
    setFeedbackEvent(null);
  };

  const handleCancelEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to cancel this event registration?')) {
      try {
        // Remove from database
        await eventRegistrationService.unregisterFromEvent(user.username, eventId);
        
        // Remove from user's events (local state)
        removeEvent(eventId);
        
        // Remove from localStorage registrations
        const storedRegistrations = localStorage.getItem('eventRegistrations');
        const allRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
        const updatedRegistrations = allRegistrations.filter(reg => !(reg.eventId === eventId && reg.userId === user.username));
        localStorage.setItem('eventRegistrations', JSON.stringify(updatedRegistrations));
        
        // Refresh user events to update context
        await loadUserEvents(user.username);
        
        // Trigger cancellation update event
        window.dispatchEvent(new CustomEvent('eventCancellation'));
        
        alert('Event registration cancelled successfully.');
      } catch (error) {
        console.error('Cancellation failed:', error);
        alert(error.message || 'Failed to cancel registration. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
    
    // Refresh events every 5 seconds for real-time updates
    const interval = setInterval(fetchApprovedEvents, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchApprovedEvents = async () => {
    try {
      // Fetch from database
      const dbEvents = await eventService.getApprovedEvents();
      
      // Also get from localStorage for compatibility
      const storedEvents = localStorage.getItem('events');
      const localEvents = storedEvents ? JSON.parse(storedEvents) : [];
      const localApprovedEvents = localEvents.filter(event => event.status === 'APPROVED');
      
      // Combine and deduplicate events
      const allEvents = [...dbEvents, ...localApprovedEvents];
      const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id || e.title === event.title)
      );
      
      // Filter out past events, those from 2024, and incomplete events
      const currentDate = new Date();
      const filteredEvents = uniqueEvents.filter(event => {
        if (!event.title || !event.date || !event.time || !event.location) return false;
        const eventDate = new Date(event.date);
        return eventDate >= currentDate && eventDate.getFullYear() > 2024;
      });

      // Filter events that the user hasn't joined
      const nonJoinedEvents = filteredEvents.filter(event => !isEventJoined(event.id));
      
      const approvedEvents = nonJoinedEvents.map(event => ({
        id: event.id,
        title: event.title,
        date: event.date,
        time: event.time,
        location: event.location,
        category: event.category,
        description: event.description,
        attendees: event.attendees || 0,
        image: getCategoryIcon(event.category || 'General'),
        organizerName: event.organizerName
      })).filter(event => event.title && event.date && event.time && event.location);
      
      setUpcomingEvents(approvedEvents);
    } catch (error) {
      console.error('Failed to fetch approved events:', error);
      // Fallback to localStorage only
      const storedEvents = localStorage.getItem('events');
      const allEvents = storedEvents ? JSON.parse(storedEvents) : [];
      const approvedEvents = allEvents
        .filter(event => event.status === 'APPROVED')
        .map(event => ({
          id: event.id,
          title: event.title,
          date: event.date,
          time: event.time || '12:00 PM',
          location: event.location,
          category: event.category || 'Community',
          attendees: Math.floor(Math.random() * 200) + 10,
          image: getCategoryIcon(event.category || 'Community'),
          organizerName: event.organizerName
        }));
      setUpcomingEvents(approvedEvents);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      'Music': '🎵',
      'Community': '🌱',
      'Food': '🍕',
      'Art': '🎨',
      'Sports': '⚽',
      'Education': '📚',
      'Technology': '💻',
      'Health': '🏥'
    };
    return icons[category] || '🎉';
  };

  const stats = [
    { label: 'Events Attended', value: '24', icon: '🎉', color: '#3b82f6', trend: '+12%' },
    { label: 'Hours Participated', value: '156', icon: '⏰', color: '#10b981', trend: '+8%' },
    { label: 'New Connections', value: '47', icon: '👥', color: '#f59e0b', trend: '+25%' },
    { label: 'Favorite Categories', value: '5', icon: '❤️', color: '#ef4444', trend: '+2' },
  ];

  return (
    <div className="participant-dashboard">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <div className="welcome-text">
            <h1>Welcome back, {user?.username || 'User'}! 👋</h1>
            <p>Ready to discover amazing events in your community?</p>
          </div>
          <div className="hero-actions">
            <button className="cta-button primary" onClick={() => setShowSearch(true)}>
              <span className="button-icon">🔍</span>
              Discover Events
            </button>
            <button className="cta-button secondary" onClick={() => navigate('/events/calendar')}>
              <span className="button-icon">📅</span>
              My Calendar
            </button>
          </div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">🎪</div>
          <div className="floating-card card-2">🎭</div>
          <div className="floating-card card-3">🎨</div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card" style={{ '--delay': `${index * 0.1}s` }}>
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
              <div className="stat-trend">{stat.trend}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <span className="tab-icon">📊</span>
          Overview
        </button>
        <button 
          className={`tab-button ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          <span className="tab-icon">🎉</span>
          Upcoming Events
        </button>
        <button 
          className={`tab-button ${activeTab === 'my-events' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-events')}
        >
          <span className="tab-icon">📋</span>
          My Events
        </button>
      </div>

      {/* Search Modal */}
      {showSearch && (
        <div className="search-modal" onClick={() => setShowSearch(false)}>
          <div className="search-content" onClick={e => e.stopPropagation()}>
            <div className="search-header">
              <h3>🔍 Discover Events</h3>
              <button className="close-btn" onClick={() => setShowSearch(false)}>×</button>
            </div>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search events by name, location, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="search-results">
              {upcomingEvents
                .filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                               event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                               event.category.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter(event => !isEventJoined(event.id))
                .map(event => (
                  <div key={event.id} className="search-result-item">
                    <div className="result-icon">{event.image}</div>
                    <div className="result-info">
                      <h4>{event.title}</h4>
                      <p>{event.location} • {event.date}</p>
                    </div>
                    <button className="result-join-btn" onClick={() => handleJoinEvent(event.id)}>Join</button>
                  </div>
                ))}
              {searchQuery && upcomingEvents.filter(event => 
                (event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                event.category.toLowerCase().includes(searchQuery.toLowerCase())) &&
                !isEventJoined(event.id)
              ).length === 0 && (
                <div className="no-results">
                  <p>No events found matching "<strong>{searchQuery}</strong>"</p>
                  <p>Try searching with different keywords</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="content-area">
        {activeTab === 'overview' && (
          <div className="overview-content">
            <div className="quick-actions">
              <h3 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Quick Actions</h3>
              <div className="action-grid">
                <div className="action-card">
                  <div className="action-icon">📅</div>
                  <h4 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>My Calendar</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>View your scheduled events</p>
                  <button className="action-btn" onClick={() => navigate('/events/calendar')}>View Calendar</button>
                </div>
                <div className="action-card">
                  <div className="action-icon">⭐</div>
                  <h4 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Rate Events</h4>
                  <p style={{ color: 'rgba(255, 255, 255, 0.9)', textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}>Share your experience with others</p>
                  <button className="action-btn" onClick={() => setActiveTab('my-events')}>Review</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="events-content">
            <div className="events-header">
              <h3 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>Upcoming Events Near You</h3>
              <div className="filter-buttons">
                {['All', 'Music', 'Food', 'Art', 'Community'].map(category => (
                  <button 
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div className="events-grid">
              {upcomingEvents
                .filter(event => selectedCategory === 'All' || event.category === selectedCategory)
                .filter(event => event.title.toLowerCase().includes(searchQuery.toLowerCase()))
                .filter(event => !isEventJoined(event.id))
                .map((event, index) => (
                  <div key={event.id} className="event-card" style={{ '--delay': `${index * 0.1}s` }}>
                    <div className="event-image">{event.image}</div>
                    <div className="event-content">
                      <div className="event-category">{event.category}</div>
                      <h4 className="event-title">{event.title}</h4>
                      <div className="event-details">
                        <div className="event-date">📅 {event.date}</div>
                        <div className="event-time">🕐 {event.time}</div>
                        <div className="event-location">📍 {event.location}</div>
                      </div>
                      <div className="event-footer">
                        <div className="attendees">👥 {event.attendees} going</div>
                        <button 
                          className={`join-btn ${isEventJoined(event.id) ? 'joined' : ''}`}
                          onClick={() => handleJoinEvent(event.id)}
                        >
                          {isEventJoined(event.id) ? 'Joined ✓' : 'Join'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {activeTab === 'my-events' && (
          <div className="my-events-content">
            <h3 style={{ color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>My Registered Events ({myEvents.length})</h3>
            <div className="my-events-list">
              {myEvents.map((event, index) => (
                <div key={event.id} className="my-event-item" style={{ '--delay': `${index * 0.1}s` }}>
                  <div className="event-info">
                    <h4 className="event-title">{event.title}</h4>
                    <div className="event-datetime">
                      <span>
                        <span className="icon">📅</span>
                        {new Date(event.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span>
                        <span className="icon">🕐</span>
                        {event.time}
                      </span>
                    </div>
                    <div className="event-location">
                      <span className="icon">📍</span>
                      {event.location}
                    </div>
                    <div className="event-tags">
                      <span className={`status-badge ${event.status.toLowerCase()}`}>
                        {event.status}
                      </span>
                      <span className="event-type">
                        <span className="icon">🏷️</span>
                        {event.type}
                      </span>
                    </div>
                    <div className="event-organizer">
                      <span className="icon">👤</span>
                      Organized by {event.organizerName}
                    </div>
                  </div>
                  <div className="event-actions">
                    <div className="action-buttons">
                      {event.status === 'Confirmed' && (
                        <button className="feedback-btn" onClick={() => handleShowFeedback(event)}>
                          ⭐ Review
                        </button>
                      )}
                      <button className="cancel-btn" onClick={() => handleCancelEvent(event.id)}>
                        ❌ Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {myEvents.length === 0 && (
                <div className="no-events">
                  <p>No events registered yet</p>
                  <button className="browse-events-btn" onClick={() => setActiveTab('events')}>
                    Browse Events
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Feedback Modal */}
      {showFeedback && feedbackEvent && (
        <div className="feedback-modal" onClick={() => setShowFeedback(false)}>
          <div className="feedback-content" onClick={e => e.stopPropagation()}>
            <div className="feedback-header">
              <h3>⭐ Rate Event</h3>
              <button className="close-btn" onClick={() => setShowFeedback(false)}>×</button>
            </div>
            <div className="feedback-body">
              <h4>{feedbackEvent.title}</h4>
              <p>{feedbackEvent.date} • {feedbackEvent.type}</p>
              
              <div className="rating-section">
                <label>Rating:</label>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      className={`star ${feedback.rating >= star ? 'active' : ''}`}
                      onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                    >
                      ⭐
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="comment-section">
                <label>Your Review:</label>
                <textarea
                  value={feedback.comment}
                  onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Share your experience with this event..."
                  rows={4}
                />
              </div>
              
              <div className="feedback-actions">
                <button className="cancel-btn" onClick={() => setShowFeedback(false)}>Cancel</button>
                <button className="submit-btn" onClick={handleSubmitFeedback}>Submit Review</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .participant-dashboard {
          padding: 2rem;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          animation: fadeIn 0.6s ease-out;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          border-radius: 20px;
          padding: 3rem;
          margin-bottom: 2rem;
          color: white;
          position: relative;
          overflow: hidden;
        }

        .hero-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .hero-content {
          z-index: 2;
          position: relative;
        }

        .welcome-text h1 {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          animation: slideInLeft 0.8s ease-out;
        }

        .welcome-text p {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
          animation: slideInLeft 0.8s ease-out 0.2s both;
        }

        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          animation: slideInUp 0.8s ease-out 0.4s both;
        }

        @keyframes slideInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .cta-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .cta-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s ease;
        }

        .cta-button:hover::before {
          left: 100%;
        }

        .cta-button.primary {
          background: rgba(255,255,255,0.2);
          color: white;
          backdrop-filter: blur(10px);
        }

        .cta-button.primary:hover {
          background: rgba(255,255,255,0.3);
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }

        .cta-button.secondary {
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.3);
        }

        .cta-button.secondary:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-2px);
        }

        .hero-visual {
          position: relative;
          z-index: 2;
        }

        .floating-card {
          position: absolute;
          font-size: 3rem;
          animation: float 3s ease-in-out infinite;
        }

        .card-1 {
          top: -20px;
          right: 50px;
          animation-delay: 0s;
        }

        .card-2 {
          top: 40px;
          right: -20px;
          animation-delay: 1s;
        }

        .card-3 {
          top: 100px;
          right: 80px;
          animation-delay: 2s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
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
          border-radius: 16px;
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: slideInUp 0.6s ease-out var(--delay) both;
          position: relative;
          overflow: hidden;
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, #3b82f6, #10b981, #f59e0b, #ef4444);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .stat-card:hover::before {
          transform: scaleX(1);
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

        .stat-value {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.875rem;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .stat-trend {
          color: #10b981;
          font-size: 0.75rem;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .tab-navigation {
          display: flex;
          background: white;
          border-radius: 12px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: #6b7280;
        }

        .tab-button.active {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          color: white;
          transform: scale(1.02);
        }

        .tab-button:hover:not(.active) {
          background: #f3f4f6;
          color: #374151;
        }

        .content-area {
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: slideInUp 0.6s ease-out;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }

        .action-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(236,72,153,0.15) 100%);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .action-card:hover {
          transform: translateY(-5px);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 15px 30px rgba(236, 72, 153, 0.3);
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(236,72,153,0.2) 100%);
        }

        .action-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .action-btn {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          margin-top: 1rem;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(59, 130, 246, 0.3);
        }

        .events-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .filter-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          padding: 0.5rem 1rem;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn.active,
        .filter-btn:hover {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          color: white;
          border-color: #ec4899;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .event-card {
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(236,72,153,0.15) 100%);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          animation: slideInUp 0.6s ease-out var(--delay) both;
        }

        .event-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .event-image {
          height: 120px;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 3rem;
          color: white;
        }

        .event-content {
          padding: 1.5rem;
        }

        .event-category {
          background: #dbeafe;
          color: #1e40af;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          display: inline-block;
          margin-bottom: 0.75rem;
        }

        .event-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 1rem;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .event-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .attendees {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .join-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3);
        }

        .join-btn.joined {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          cursor: pointer;
        }

        .join-btn.joined:hover {
          background: linear-gradient(135deg, #059669 0%, #047857 100%);
        }

        .event-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .event-header h4 {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin: 0;
          font-size: 1.5rem;
          flex: 1;
          padding-right: 1rem;
        }

        .event-details {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .event-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          margin: 0 0 0.5rem 0;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .event-datetime {
          display: flex;
          gap: 1.5rem;
          color: rgba(255, 255, 255, 0.95);
          font-size: 0.9rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .event-datetime .icon {
          margin-right: 0.35rem;
          opacity: 0.9;
        }

        .event-location {
          color: rgba(255, 255, 255, 0.9);
          font-size: 0.9rem;
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
        }

        .event-location .icon {
          margin-right: 0.5rem;
          opacity: 0.9;
        }

        .event-tags {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 0.75rem;
        }

        .event-type {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.9);
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .event-organizer {
          color: rgba(255, 255, 255, 0.85);
          font-size: 0.85rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }

        .my-events-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .my-event-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(236,72,153,0.15) 100%);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          transition: all 0.3s ease;
          animation: slideInUp 0.6s ease-out var(--delay) both;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
        }

        .my-event-item .event-info {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .my-event-item .event-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin: 0;
        }

        .my-event-item .event-datetime {
          display: flex;
          gap: 1rem;
          color: rgba(255,255,255,0.9);
          font-size: 0.9rem;
          align-items: center;
        }

        .my-event-item .event-datetime span {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .my-event-item .event-datetime .icon {
          font-size: 1rem;
          opacity: 0.9;
        }

        .my-event-item:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(236,72,153,0.2) 100%);
          transform: translateX(5px);
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .event-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          align-items: flex-end;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.confirmed {
          background: #d1fae5;
          color: #065f46;
        }

        .status-badge.pending {
          background: #fef3c7;
          color: #92400e;
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .feedback-btn {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .feedback-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
        }

        .cancel-btn {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.75rem;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
        }

        .event-time, .event-location {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin: 0.25rem 0;
        }

        .no-events {
          text-align: center;
          padding: 3rem;
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .browse-events-btn {
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          margin-top: 1rem;
          transition: all 0.2s ease;
        }

        .browse-events-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(59, 130, 246, 0.3);
        }

        .search-modal, .feedback-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.9);
          backdrop-filter: blur(10px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }

        .search-content, .feedback-content {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          max-width: 600px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
          animation: slideUp 0.3s ease;
        }

        .feedback-content {
          max-width: 450px;
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
        }

        .search-header, .feedback-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          color:pink;
        }

        .feedback-header {
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .feedback-header h3 {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #6b7280;
          padding: 0.5rem;
          border-radius: 50%;
          transition: background 0.2s ease;
        }

        .close-btn:hover {
          background: #f3f4f6;
        }

        .search-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          margin-bottom: 1.5rem;
          transition: border-color 0.2s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .search-results {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .search-result-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .search-result-item:hover {
          background: #f1f5f9;
          transform: translateX(5px);
        }

        .result-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .result-info {
          flex: 1;
        }

        .result-info h4 {
          margin: 0 0 0.25rem 0;
          color: #1f2937;
        }

        .result-info p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .result-join-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .result-join-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3);
        }

        .no-results {
          text-align: center;
          padding: 2rem;
          color: #6b7280;
        }

        .feedback-body h4 {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin-bottom: 0.5rem;
        }

        .feedback-body p {
          color: rgba(255, 255, 255, 0.9);
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin-bottom: 2rem;
        }

        .rating-section {
          margin-bottom: 1.5rem;
        }

        .rating-section label {
          display: block;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin-bottom: 0.5rem;
        }

        .star-rating {
          display: flex;
          gap: 0.25rem;
        }

        .star {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          opacity: 0.3;
          transition: all 0.2s ease;
        }

        .star.active {
          opacity: 1;
          transform: scale(1.1);
        }

        .star:hover {
          transform: scale(1.2);
        }

        .comment-section {
          margin-bottom: 2rem;
        }

        .comment-section label {
          display: block;
          font-weight: 600;
          color: white;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
          margin-bottom: 0.5rem;
        }

        .comment-section textarea {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-family: inherit;
          resize: vertical;
          transition: border-color 0.2s ease;
        }

        .comment-section textarea:focus {
          outline: none;
          border-color: #3b82f6;
        }

        .feedback-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .cancel-btn {
          background: #f3f4f6;
          color: #374151;
          border: 1px solid #d1d5db;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .cancel-btn:hover {
          background: #e5e7eb;
        }

        .submit-btn {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 15px rgba(16, 185, 129, 0.3);
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          .participant-dashboard {
            padding: 1rem;
          }

          .hero-section {
            flex-direction: column;
            text-align: center;
            padding: 2rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .tab-navigation {
            flex-direction: column;
          }

          .events-header {
            flex-direction: column;
            gap: 1rem;
          }

          .search-content, .feedback-content {
            width: 95%;
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ResidentDashboard;