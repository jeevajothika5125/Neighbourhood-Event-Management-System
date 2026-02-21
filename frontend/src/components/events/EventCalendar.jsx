import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import eventRegistrationService from '../../services/eventRegistrationService';

const EventCalendar = () => {
  const { user } = useAuth();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showDateEvents, setShowDateEvents] = useState(false);
  const [viewMode, setViewMode] = useState('week');
  const [loading, setLoading] = useState(true);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const timeSlots = ['9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const getWeekDates = () => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date);
    }
    return weekDates;
  };

  const getEventsForDateTime = (date, time) => {
    return joinedEvents.filter(event => {
      const eventDate = new Date(event.date);
      const eventTime = event.time?.split(' - ')[0] || event.time;
      return (
        eventDate.toDateString() === date.toDateString() &&
        eventTime === time
      );
    });
  };

  const getEventsForDate = (date) => {
    return joinedEvents.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getWeekRange = () => {
    const weekDates = getWeekDates();
    const start = weekDates[0];
    const end = weekDates[6];
    return `${start.getDate()} ${monthNames[start.getMonth()].slice(0, 3)} - ${end.getDate()} ${monthNames[end.getMonth()].slice(0, 3)}, ${end.getFullYear()}`;
  };

  const getEventEmoji = (type) => {
    const emojis = {
      'Music': '🎵',
      'Community': '🏘️', 
      'Food': '🍽️',
      'Art': '🎨',
      'Wellness': '🧘',
      'Education': '📚',
      'Creative': '✨'
    };
    return emojis[type] || '📅';
  };

  useEffect(() => {
    const fetchAllEvents = async () => {
      if (user?.username) {
        try {
          setLoading(true);
          
          // Fetch user registrations
          const registrations = await eventRegistrationService.getUserRegistrations(user.username);
          
          // Fetch all events from localStorage
          const storedEvents = localStorage.getItem('events');
          const allEvents = storedEvents ? JSON.parse(storedEvents) : [];
          
          // Get registration and cancellation data
          const storedRegistrations = localStorage.getItem('eventRegistrations');
          const localRegistrations = storedRegistrations ? JSON.parse(storedRegistrations) : [];
          const userRegistrations = localRegistrations.filter(reg => reg.userId === user.username);
          const cancelledEventIds = userRegistrations.filter(reg => reg.cancelled).map(reg => reg.eventId);
          const registeredEventIds = userRegistrations.map(reg => reg.eventId);
          
          // Combine registered events with all events data
          const events = registrations.map(reg => {
            const eventDetails = allEvents.find(event => event.id === reg.eventId) || {};
            return {
              id: reg.eventId,
              title: reg.eventTitle || eventDetails.title,
              date: reg.eventDate || eventDetails.date,
              time: reg.eventTime || eventDetails.time,
              location: reg.eventLocation || eventDetails.location,
              type: reg.eventCategory || eventDetails.category,
              description: reg.eventDescription || eventDetails.description,
              organizerName: reg.organizerUsername || eventDetails.organizerName,
              status: cancelledEventIds.includes(reg.eventId) ? 'Cancelled' : 'Confirmed',
              isRegistered: true
            };
          });
          
          // Add all events (including outdated ones) for display
          const allEventsForDisplay = allEvents.map(event => ({
            ...event,
            id: event.id,
            title: event.title,
            date: event.date,
            time: event.time,
            location: event.location,
            type: event.category,
            description: event.description,
            organizerName: event.organizerName,
            status: registeredEventIds.includes(event.id) ? 
              (cancelledEventIds.includes(event.id) ? 'Cancelled' : 'Registered') : 'Available',
            isRegistered: registeredEventIds.includes(event.id)
          }));
          
          setJoinedEvents(allEventsForDisplay);
        } catch (error) {
          console.error('Failed to fetch events:', error);
          // Fallback to localStorage events only
          const storedEvents = localStorage.getItem('events');
          const allEvents = storedEvents ? JSON.parse(storedEvents) : [];
          setJoinedEvents(allEvents.map(event => ({ ...event, type: event.category, status: 'Available' })));
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchAllEvents();
    
    // Listen for event updates
    const handleEventUpdate = () => {
      fetchAllEvents();
    };
    
    window.addEventListener('eventCreated', handleEventUpdate);
    window.addEventListener('eventRegistration', handleEventUpdate);
    window.addEventListener('eventCancelled', handleEventUpdate);
    
    return () => {
      window.removeEventListener('eventCreated', handleEventUpdate);
      window.removeEventListener('eventRegistration', handleEventUpdate);
      window.removeEventListener('eventCancelled', handleEventUpdate);
    };
  }, [user]);

  return (
    <div className="calendar-container">
      <div className="main-calendar">
        {/* Header */}
        <div className="calendar-header">
          <h1>Event Calendar</h1>
        </div>

        {/* Navigation */}
        <div className="calendar-nav">
          <div className="date-navigation">
            <button className="nav-btn" onClick={() => navigateWeek(-1)}>‹</button>
            <span className="date-range">{getWeekRange()}</span>
            <button className="nav-btn" onClick={() => navigateWeek(1)}>›</button>
            <button className="today-btn" onClick={goToToday}>Today</button>
          </div>
          <div className="view-controls">
            <input type="date" className="date-picker" value={currentDate.toISOString().split('T')[0]} onChange={(e) => setCurrentDate(new Date(e.target.value))} />
            <button className={`view-btn ${viewMode === 'month' ? 'active' : ''}`} onClick={() => setViewMode('month')}>Month</button>
            <button className={`view-btn ${viewMode === 'week' ? 'active' : ''}`} onClick={() => setViewMode('week')}>Week</button>
            <button className={`view-btn ${viewMode === 'day' ? 'active' : ''}`} onClick={() => setViewMode('day')}>Day</button>
          </div>
        </div>

        {/* Weekly Calendar View */}
        <div className="weekly-calendar">
          <div className="calendar-grid">
            {/* Time column */}
            <div className="time-column">
              <div className="time-header"></div>
              {timeSlots.map(time => (
                <div key={time} className="time-slot">{time}</div>
              ))}
            </div>
            
            {/* Day columns */}
            {getWeekDates().map((date, dayIndex) => (
              <div key={dayIndex} className="day-column">
                <div className="day-header">
                  <div className="day-name">{dayNames[dayIndex]}</div>
                  <div className="day-date">{date.getDate()} {monthNames[date.getMonth()].slice(0, 3)}</div>
                </div>
                
                {timeSlots.map(time => {
                  const events = getEventsForDateTime(date, time);
                  return (
                    <div key={time} className="time-cell" onClick={() => {
                      const dayEvents = getEventsForDate(date);
                      setSelectedDate({ date, events: dayEvents });
                      setShowDateEvents(true);
                    }}>
                      {events.map((event, index) => {
                        const eventDate = new Date(event.date);
                        const isOutdated = eventDate < new Date();
                        return (
                          <div
                            key={event.id}
                            className={`calendar-event ${event.status?.toLowerCase()} ${isOutdated ? 'outdated' : ''}`}
                            onClick={() => setSelectedEvent(event)}
                            style={{ 
                              backgroundColor: getEventColor(event.type),
                              borderColor: getEventColor(event.type).replace('0.2', '0.4'),
                              animationDelay: `${index * 0.1}s`
                            }}
                          >
                            <div className="event-title" onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}>{event.title}</div>
                            <div className="event-details">
                              {event.location && <span>📍{event.location}</span>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
                
                {/* Day Events Summary */}
                <div className="day-events-summary">
                  {getEventsForDate(date).slice(0, 3).map((event, index) => {
                    const eventDate = new Date(event.date);
                    const isOutdated = eventDate < new Date();
                    return (
                      <div
                        key={event.id}
                        className={`day-event-item ${event.status?.toLowerCase()} ${isOutdated ? 'outdated' : ''}`}
                        onClick={() => setSelectedEvent(event)}
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="day-event-time">{event.time}</div>
                        <div className="day-event-title">{event.title}</div>
                      </div>
                    );
                  })}
                  {getEventsForDate(date).length > 3 && (
                    <div className="more-events">+{getEventsForDate(date).length - 3} more</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="right-sidebar">
        <h3>Upcoming Events</h3>
        <div className="sidebar-events">
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : joinedEvents.length > 0 ? (
            joinedEvents
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 10)
              .map(event => {
                const eventDate = new Date(event.date);
                const isOutdated = eventDate < new Date();
                return (
                  <div key={event.id} className={`sidebar-event ${event.status?.toLowerCase()} ${isOutdated ? 'outdated' : ''}`} onClick={() => setSelectedEvent(event)}>
                    <div className="event-date">
                      <span className="icon">📅</span>
                      {eventDate.toLocaleDateString('en-US', { 
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="event-title">
                      {event.status === 'Cancelled' && <span className="cancelled-icon">❌ </span>}
                      {event.title} {getEventEmoji(event.type)}
                    </div>
                    <div className="event-time">
                      <span className="icon">🕐</span>
                      {event.time}
                    </div>
                    <div className="event-location">
                      <span className="icon">📍</span>
                      {event.location}
                    </div>
                    <div className="event-status">
                      <span className={`status-badge ${event.status?.toLowerCase()}`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                );
              })
          ) : (
            <div className="no-events">No events scheduled</div>
          )}
        </div>
      </div>

      {/* Event Popup */}
      {selectedEvent && (
        <div className="popup-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="event-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>{selectedEvent.title}</h3>
              <button className="close-btn" onClick={() => setSelectedEvent(null)}>×</button>
            </div>
            <div className="popup-content">
              <div className="popup-item">
                <span className="popup-icon">📅</span>
                <span>Time: {selectedEvent.time}</span>
              </div>
              <div className="popup-item">
                <span className="popup-icon">📍</span>
                <span>Location: {selectedEvent.location}</span>
              </div>
              <div className="popup-item">
                <span className="popup-icon">⏰</span>
                <span>Reminder: 30 min before start</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Date Events Popup */}
      {showDateEvents && selectedDate && (
        <div className="popup-overlay" onClick={() => setShowDateEvents(false)}>
          <div className="event-popup" onClick={e => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Events on {selectedDate.date.toLocaleDateString()}</h3>
              <button className="close-btn" onClick={() => setShowDateEvents(false)}>×</button>
            </div>
            <div className="popup-content">
              {selectedDate.events.length > 0 ? (
                selectedDate.events.map(event => (
                  <div key={event.id} className="popup-item" onClick={() => {
                    setSelectedEvent(event);
                    setShowDateEvents(false);
                  }}>
                    <span className="popup-icon">{getEventEmoji(event.type)}</span>
                    <div>
                      <div style={{fontWeight: 600}}>{event.title}</div>
                      <div style={{fontSize: '0.875rem', opacity: 0.8}}>{event.time} • {event.location}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="popup-item">
                  <span className="popup-icon">📅</span>
                  <span>No events available on this day</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .calendar-container {
          padding: 2rem;
          background: linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%);
          min-height: 100vh;
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
        }

        .main-calendar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .calendar-header {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1rem 0;
          margin-bottom: 2rem;
        }

        .calendar-header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          margin: 0;
        }

        .calendar-nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .date-navigation {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .nav-btn {
          background: linear-gradient(135deg, #f9a8d4 0%, #3b82f6 100%);
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 15px rgba(236, 72, 153, 0.4);
        }

        .date-range {
          font-size: 1.2rem;
          font-weight: 600;
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          min-width: 250px;
          text-align: center;
        }

        .today-btn {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          text-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }

        .today-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
          transform: translateY(-2px);
        }

        .view-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .date-picker {
          padding: 0.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 6px;
          font-size: 0.875rem;
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .view-btn {
          padding: 0.5rem 1rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .view-btn:first-of-type {
          border-radius: 6px 0 0 6px;
        }

        .view-btn:last-of-type {
          border-radius: 0 6px 6px 0;
        }

        .view-btn.active {
          background: linear-gradient(45deg, #ec4899, #3b82f6);
          color: white;
          border-color: rgba(255, 255, 255, 0.5);
        }

        .weekly-calendar {
          flex: 1;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%);
          backdrop-filter: blur(15px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .calendar-grid {
          display: grid;
          grid-template-columns: 80px repeat(7, 1fr);
          height: 600px;
        }

        .time-column {
          border-right: 1px solid rgba(255, 255, 255, 0.2);
        }

        .time-header {
          height: 60px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .time-slot {
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          color: white;
          font-weight: 500;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .day-column {
          border-right: 1px solid rgba(255, 255, 255, 0.2);
        }

        .day-column:last-child {
          border-right: none;
        }

        .day-header {
          height: 60px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
        }

        .day-events-summary {
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          max-height: 200px;
          overflow-y: auto;
        }

        .day-event-item {
          background: rgba(255, 255, 255, 0.15);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          opacity: 0;
          transform: translateY(5px);
          animation: slideInDayEvent 0.4s ease-out forwards;
        }

        @keyframes slideInDayEvent {
          0% {
            opacity: 0;
            transform: translateY(5px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .day-event-item:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .day-event-item.outdated {
          opacity: 0.6;
        }

        .day-event-item.cancelled {
          background: rgba(239, 68, 68, 0.2);
          text-decoration: line-through;
        }

        .day-event-item.registered {
          background: rgba(34, 197, 94, 0.2);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .day-event-time {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
          margin-bottom: 0.25rem;
        }

        .day-event-title {
          font-size: 0.75rem;
          color: white;
          font-weight: 600;
          line-height: 1.2;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .more-events {
          font-size: 0.7rem;
          color: rgba(255, 255, 255, 0.7);
          text-align: center;
          padding: 0.25rem;
          font-style: italic;
        }

        .day-name {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          font-weight: 500;
        }

        .day-date {
          font-size: 0.875rem;
          color: white;
          font-weight: 600;
        }

        .time-cell {
          height: 60px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          position: relative;
          padding: 2px;
          transition: background-color 0.2s ease;
        }

        .time-cell:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .calendar-event {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 4px 8px;
          border-radius: 8px;
          font-size: 0.75rem;
          cursor: pointer;
          margin-bottom: 2px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          opacity: 0;
          transform: translateY(10px) scale(0.95);
          animation: slideInEvent 0.5s ease-out forwards;
          position: relative;
          overflow: hidden;
        }

        @keyframes slideInEvent {
          0% {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .calendar-event::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .calendar-event:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.6);
          z-index: 10;
        }

        .calendar-event:hover::before {
          left: 100%;
        }

        .calendar-event:active {
          transform: translateY(-1px) scale(0.98);
          transition: all 0.1s ease;
        }

        .calendar-event.outdated {
          opacity: 0.6;
          background: rgba(156, 163, 175, 0.3);
        }

        .calendar-event.outdated:hover {
          opacity: 0.8;
          transform: translateY(-2px) scale(1.01);
        }

        .calendar-event.cancelled {
          background: rgba(239, 68, 68, 0.3);
          text-decoration: line-through;
        }

        .calendar-event.cancelled:hover {
          background: rgba(239, 68, 68, 0.4);
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.3);
        }

        .calendar-event.registered {
          background: rgba(34, 197, 94, 0.3);
          border-color: rgba(34, 197, 94, 0.5);
        }

        .calendar-event.registered:hover {
          background: rgba(34, 197, 94, 0.4);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.3);
        }

        .calendar-event .event-title {
          font-weight: 500;
          line-height: 1.2;
          cursor: pointer;
          transition: all 0.3s ease;
          padding: 2px 4px;
          border-radius: 4px;
          position: relative;
        }

        .calendar-event .event-title:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          box-shadow: 0 2px 8px rgba(255, 255, 255, 0.2);
        }

        .calendar-event .event-title:active {
          transform: scale(0.98);
          transition: all 0.1s ease;
        }

        .calendar-event .event-details {
          font-size: 0.625rem;
          opacity: 0.9;
          margin-top: 2px;
        }

        .right-sidebar {
          background: linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(236,72,153,0.2) 100%);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.5);
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 15px 50px rgba(0, 0, 0, 0.3);
          max-height: 85vh;
          overflow-y: auto;
        }

        .right-sidebar h3 {
          color: white;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0 0 1.5rem 0;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3);
          padding-bottom: 1rem;
        }

        .sidebar-events {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .sidebar-event {
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(236,72,153,0.1));
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
          position: relative;
          overflow: hidden;
        }

        .sidebar-event::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #ec4899, #db2777);
          opacity: 0.8;
        }

        .sidebar-event:hover {
          transform: translateX(5px);
          background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(236,72,153,0.15));
          border-color: rgba(255, 255, 255, 0.5);
          box-shadow: 0 8px 24px rgba(236, 72, 153, 0.25);
        }

        .sidebar-event.outdated {
          opacity: 0.7;
        }

        .sidebar-event.cancelled::before {
          background: linear-gradient(to bottom, #ef4444, #dc2626);
        }

        .event-date {
          font-size: 0.9rem;
          color: #fce7f3;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(236, 72, 153, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 12px;
          margin-bottom: 0.75rem;
        }

        .event-title {
          font-weight: 700;
          color: white;
          font-size: 1.1rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          line-height: 1.4;
          margin-bottom: 0.75rem;
        }

        .event-time, .event-location {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.95);
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .event-status {
          margin-top: 0.75rem;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .status-badge.confirmed, .status-badge.registered {
          background: rgba(34, 197, 94, 0.3);
          color: #86efac;
        }

        .status-badge.cancelled {
          background: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .status-badge.available {
          background: rgba(59, 130, 246, 0.3);
          color: #93c5fd;
        }

        .icon {
          opacity: 0.9;
        }

        .event-popup {
          background: linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(59, 130, 246, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%);
          backdrop-filter: blur(20px);
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 24px;
          padding: 2rem;
          min-width: 500px;
          max-width: 90vw;
          box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
          animation: popupSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          transform-origin: center;
        }

        @keyframes popupSlideIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeInOverlay 0.3s ease-out;
        }

        @keyframes fadeInOverlay {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }

        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        }

        .popup-header h3 {
          margin: 0;
          color: white;
          font-size: 1.5rem;
          font-weight: 700;
          text-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }

        .popup-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.1);
          border: none;
          color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          transition: all 0.2s ease;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.1);
        }

        .popup-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          color: white;
        }

        .popup-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1rem;
          color: white;
          background: rgba(255, 255, 255, 0.1);
          padding: 1rem;
          border-radius: 12px;
          transition: all 0.2s ease;
        }

        .popup-item:hover {
          background: rgba(255, 255, 255, 0.15);
          transform: translateX(5px);
        }

        .popup-icon {
          font-size: 1rem;
        }

        .popup-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 255, 255, 0.2);
        }

        .popup-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.3);
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 12px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .popup-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .cancel-btn {
          background: linear-gradient(45deg, #ef4444, #dc2626);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .cancel-btn:hover {
          background: linear-gradient(45deg, #dc2626, #b91c1c);
        }

        .loading, .no-events {
          text-align: center;
          color: white;
          padding: 2rem;
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .calendar-container {
            grid-template-columns: 1fr;
            padding: 1rem;
          }

          .calendar-nav {
            flex-direction: column;
            gap: 1rem;
          }

          .view-controls {
            flex-wrap: wrap;
          }

          .calendar-grid {
            grid-template-columns: 60px repeat(7, 1fr);
            font-size: 0.75rem;
          }

          .time-slot {
            height: 40px;
          }

          .time-cell {
            height: 40px;
          }

          .day-header {
            height: 40px;
          }
        }
      `}</style>
    </div>
  );
};

const getEventColor = (type) => {
  const colors = {
    'Music': '#ec4899',
    'Community': '#f97316', 
    'Food': '#eab308',
    'Art': '#8b5cf6',
    'Wellness': '#06b6d4',
    'Education': '#10b981',
    'Creative': '#ef4444'
  };
  return colors[type] || '#3b82f6';
};

export default EventCalendar;