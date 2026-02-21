import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ViewEvent = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 4;

  useEffect(() => {
    fetchEvents();
    
    // Check if editing a specific event
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    if (editId) {
      const eventToEdit = JSON.parse(localStorage.getItem('events') || '[]').find(e => e.id === editId);
      if (eventToEdit) {
        setEditingEvent(editId);
        setEditForm(eventToEdit);
      }
    }
  }, []);

  const fetchEvents = () => {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  };

  const deleteEvent = (id) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    alert('Event deleted successfully!');
  };

  const handleEdit = (event) => {
    setEditingEvent(event.id);
    setEditForm(event);
  };

  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const saveEdit = () => {
    const updatedEvents = events.map(event => 
      event.id === editingEvent ? editForm : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEditingEvent(null);
    setEditForm({});
    alert('Event updated successfully!');
  };

  const cancelEdit = () => {
    setEditingEvent(null);
    setEditForm({});
  };

  // Pagination logic
  const totalPages = Math.ceil(events.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 50%, #be185d 100%)',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%)',
          backdropFilter: 'blur(15px)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '20px',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center',
          color: 'white'
        }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'white',
            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            marginBottom: '0.5rem'
          }}>Manage Events</h2>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/admin-dashboard" style={{
              color: 'rgba(255,255,255,0.8)',
              textDecoration: 'none',
              fontSize: '0.9rem'
            }}>← Back to Dashboard</Link>
            <Link to="/events/create" style={{
              background: 'linear-gradient(45deg, #ec4899, #3b82f6)',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '50px',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: '600',
              boxShadow: '0 8px 20px rgba(236,72,153,0.3)'
            }}>+ Add New Event</Link>
          </div>
        </div>
        
        {events.length === 0 ? (
          <div style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(59,130,246,0.1) 100%)',
            backdropFilter: 'blur(15px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '20px',
            padding: '3rem',
            textAlign: 'center',
            color: 'white'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>No events created yet. Create your first event!</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gap: '1.5rem',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))'
          }}>
            {currentEvents.map(event => (
              <div key={event.id} style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(236,72,153,0.1) 100%)',
                backdropFilter: 'blur(15px)',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '20px',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                color: 'white'
              }}>
                {editingEvent === event.id ? (
                  <div style={{ marginBottom: '1rem' }}>
                    <input
                      type="text"
                      name="title"
                      value={editForm.title || ''}
                      onChange={handleEditChange}
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        marginBottom: '0.5rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        fontSize: '1.1rem',
                        fontWeight: '600'
                      }}
                      placeholder="Event Title"
                    />
                    <textarea
                      name="description"
                      value={editForm.description || ''}
                      onChange={handleEditChange}
                      rows="3"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '8px',
                        resize: 'vertical'
                      }}
                      placeholder="Event Description"
                    />
                  </div>
                ) : (
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{
                      fontSize: '1.3rem',
                      fontWeight: '700',
                      color: 'white',
                      textShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      marginBottom: '0.5rem'
                    }}>{event.title}</h3>
                    <p style={{
                      color: 'rgba(255,255,255,0.9)',
                      lineHeight: '1.5',
                      marginBottom: '1rem'
                    }}>{event.description}</p>
                  </div>
                )}
                
                {editingEvent === event.id ? (
                  <div style={{
                    display: 'grid',
                    gap: '0.75rem',
                    marginBottom: '1.5rem'
                  }}>
                    <input
                      type="date"
                      name="date"
                      value={editForm.date || ''}
                      onChange={handleEditChange}
                      style={{
                        padding: '0.5rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                    <input
                      type="text"
                      name="location"
                      value={editForm.location || ''}
                      onChange={handleEditChange}
                      placeholder="Location"
                      style={{
                        padding: '0.5rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                    <input
                      type="tel"
                      name="contactNumber"
                      value={editForm.contactNumber || ''}
                      onChange={handleEditChange}
                      placeholder="Contact Number"
                      style={{
                        padding: '0.5rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '6px'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gap: '0.5rem',
                    marginBottom: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#4facfe', fontWeight: '500' }}>📅</span>
                      <span style={{ color: 'white', fontSize: '0.9rem' }}>{event.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#4facfe', fontWeight: '500' }}>📍</span>
                      <span style={{ color: 'white', fontSize: '0.9rem' }}>{event.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#4facfe', fontWeight: '500' }}>📞</span>
                      <span style={{ color: 'white', fontSize: '0.9rem' }}>{event.contactNumber}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#4facfe', fontWeight: '500' }}>👤</span>
                      <span style={{ color: 'white', fontSize: '0.9rem' }}>{event.organizerName}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#4facfe', fontWeight: '500' }}>📊</span>
                      <span style={{ 
                        color: 'white',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        background: event.status === 'APPROVED' ? 'rgba(5, 232, 88, 0.95)' : event.status === 'PENDING' ? 'rgba(235, 172, 15, 1)' : 'rgba(239, 68, 68, 0.95)',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px'
                      }}>{event.status}</span>
                    </div>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {editingEvent === event.id ? (
                    <>
                      <button onClick={saveEdit} style={{
                        background: '#10b981',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        flex: '1',
                        transition: 'background 0.2s ease'
                      }} onMouseOver={(e) => e.target.style.background = '#059669'}
                         onMouseOut={(e) => e.target.style.background = '#10b981'}>Save</button>
                      <button onClick={cancelEdit} style={{
                        background: '#6b7280',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        flex: '1',
                        transition: 'background 0.2s ease'
                      }} onMouseOver={(e) => e.target.style.background = '#4b5563'}
                         onMouseOut={(e) => e.target.style.background = '#6b7280'}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(event)} style={{
                        background: 'transparent',
                        color: '#4facfe',
                        padding: '0.5rem 1rem',
                        border: '2px solid #4facfe',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        flex: '1',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }} onMouseOver={(e) => {
                        e.target.style.background = '#4facfe';
                        e.target.style.color = 'white';
                      }} onMouseOut={(e) => {
                        e.target.style.background = 'transparent';
                        e.target.style.color = '#4facfe';
                      }}>Edit</button>
                      <button onClick={() => deleteEvent(event.id)} style={{
                        background: '#ef4444',
                        color: 'white',
                        padding: '0.5rem 1rem',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        flex: '1',
                        transition: 'background 0.2s ease'
                      }} onMouseOver={(e) => e.target.style.background = '#dc2626'}
                         onMouseOut={(e) => e.target.style.background = '#ef4444'}>Delete</button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Pagination Controls */}
        {events.length > eventsPerPage && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem',
            padding: '1rem'
          }}>
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              style={{
                background: currentPage === 1 ? 'rgba(255,255,255,0.3)' : 'linear-gradient(45deg, #ec4899, #3b82f6)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                opacity: currentPage === 1 ? 0.5 : 1,
                transition: 'all 0.3s ease',
                boxShadow: currentPage === 1 ? 'none' : '0 4px 15px rgba(236,72,153,0.3)'
              }}
            >
              Previous
            </button>
            
            <span style={{
              color: 'white',
              fontWeight: '600',
              fontSize: '1rem',
              textShadow: '0 1px 3px rgba(0,0,0,0.3)'
            }}>
              Page {currentPage} of {totalPages}
            </span>
            
            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              style={{
                background: currentPage === totalPages ? 'rgba(255,255,255,0.3)' : 'linear-gradient(45deg, #ec4899, #3b82f6)',
                color: 'white',
                padding: '0.75rem 1.5rem',
                border: 'none',
                borderRadius: '25px',
                fontSize: '0.9rem',
                fontWeight: '600',
                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                opacity: currentPage === totalPages ? 0.5 : 1,
                transition: 'all 0.3s ease',
                boxShadow: currentPage === totalPages ? 'none' : '0 4px 15px rgba(236,72,153,0.3)'
              }}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewEvent;