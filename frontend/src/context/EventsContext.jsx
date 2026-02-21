import React, { createContext, useContext, useState, useEffect } from 'react';
import eventRegistrationService from '../services/eventRegistrationService';

const EventsContext = createContext();

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventsProvider');
  }
  return context;
};

export const EventsProvider = ({ children }) => {
  const [myEvents, setMyEvents] = useState([]);
  const [user, setUser] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Load user's events when user changes
  useEffect(() => {
    if (user?.username) {
      loadUserEvents(user.username);
    }
  }, [user]);

  const loadUserEvents = async (username) => {
    try {
      // Load from database
      const registrations = await eventRegistrationService.getUserRegistrations(username);
      const dbEvents = registrations.map(reg => ({
        id: reg.eventId,
        title: reg.eventTitle,
        date: reg.eventDate,
        time: reg.eventTime,
        location: reg.eventLocation,
        type: reg.eventCategory,
        description: reg.eventDescription,
        organizerName: reg.organizerUsername,
        status: 'Confirmed'
      })).filter(event => event.title && event.date);

      // Load from localStorage for compatibility
      const localRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      const userLocalEvents = localRegistrations
        .filter(reg => reg.userId === username)
        .map(reg => ({
          id: reg.eventId,
          title: reg.eventTitle,
          date: new Date().toISOString().split('T')[0], // Default date
          status: 'Confirmed',
          type: 'General'
        }));

      // Combine and deduplicate
      const allEvents = [...dbEvents, ...userLocalEvents];
      const uniqueEvents = allEvents.filter((event, index, self) => 
        index === self.findIndex(e => e.id === event.id)
      );

      setMyEvents(uniqueEvents);
    } catch (error) {
      console.error('Failed to load user events:', error);
      // Fallback to localStorage only
      const localRegistrations = JSON.parse(localStorage.getItem('eventRegistrations') || '[]');
      const userEvents = localRegistrations
        .filter(reg => reg.userId === username)
        .map(reg => ({
          id: reg.eventId,
          title: reg.eventTitle,
          date: new Date().toISOString().split('T')[0],
          status: 'Confirmed',
          type: 'General'
        }));
      setMyEvents(userEvents);
    }
  };

  const addEvent = (event) => {
    if (!myEvents.find(e => e.id === event.id)) {
      setMyEvents(prev => [...prev, event]);
    }
  };

  const removeEvent = (eventId) => {
    setMyEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const isEventJoined = (eventId) => {
    return myEvents.some(event => event.id === eventId);
  };

  const value = {
    myEvents,
    addEvent,
    removeEvent,
    isEventJoined,
    setMyEvents,
    loadUserEvents
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};

export default EventsContext;