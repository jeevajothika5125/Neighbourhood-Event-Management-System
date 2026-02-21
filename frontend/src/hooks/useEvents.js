import { useState, useEffect } from 'react';
import { eventService } from '../services/EventService';

export const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await eventService.getAllEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prev => [...prev, newEvent]);
      return newEvent;
    } catch (err) {
      throw err;
    }
  };

  const updateEvent = async (id, eventData) => {
    try {
      const updatedEvent = await eventService.updateEvent(id, eventData);
      setEvents(prev => prev.map(event => 
        event.eventId === id ? updatedEvent : event
      ));
      return updatedEvent;
    } catch (err) {
      throw err;
    }
  };

  const deleteEvent = async (id) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prev => prev.filter(event => event.eventId !== id));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEvent,
    deleteEvent
  };
};