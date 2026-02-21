import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '3rem',
        textAlign: 'center',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        maxWidth: '500px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>Neighborhood Event Hub</h1>
        <p style={{
          fontSize: '1.1rem',
          color: '#6b7280',
          marginBottom: '2.5rem',
          lineHeight: '1.6'
        }}>Choose your role to get started with event management.</p>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <Link to="/admin-login" style={{
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '2rem 1rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'transform 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
             onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '2rem' }}>⚙️</span>
            <span>Admin Login</span>
          </Link>
          <Link to="/organizer-login" style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            color: 'white',
            padding: '2rem 1rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'transform 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
             onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '2rem' }}>🎯</span>
            <span>Organizer Login</span>
          </Link>
          <Link to="/participant-login" style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            padding: '2rem 1rem',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'transform 0.2s ease',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }} onMouseOver={(e) => e.target.style.transform = 'translateY(-4px)'}
             onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}>
            <span style={{ fontSize: '2rem' }}>👤</span>
            <span>Participant Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;