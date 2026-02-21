import React, { createContext, useContext, useState, useEffect } from 'react';
import eventService from '../services/EventService';

const EventContext = createContext();

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getApprovedEvents();
      setEvents(eventsData);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const result = await eventService.createEvent(eventData);
      if (result.success) {
        setEvents(prev => [...prev, result.event]);
        return result.event;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      throw err;
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const result = await eventService.updateEventStatus(id, eventData.status);
      if (result.success) {
        setEvents(prev => prev.map(event => 
          event.id === id ? result.event : event
        ));
        return result.event;
      } else {
        throw new Error(result.message);
      }
    } catch (err) {
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      // For now, just remove from local state
      setEvents(prev => prev.filter(event => event.id !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};