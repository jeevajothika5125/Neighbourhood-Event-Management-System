import React, { useState, useEffect } from 'react';
import eventRegistrationService from '../services/eventRegistrationService';

const TestBackend = () => {
  const [status, setStatus] = useState('Testing...');
  const [registrations, setRegistrations] = useState([]);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      // Test the new test endpoint
      const response = await fetch('http://localhost:8080/api/event-registrations/test');
      
      if (response.ok) {
        const data = await response.json();
        setStatus(`✅ Backend is running. Total registrations: ${data.totalRegistrations}`);
        
        // Also test getting user registrations
        const userResponse = await fetch('http://localhost:8080/api/event-registrations/user/testuser');
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setRegistrations(userData);
        }
      } else {
        setStatus(`❌ Backend responded with status: ${response.status}`);
      }
    } catch (error) {
      setStatus(`❌ Backend connection failed: ${error.message}`);
      console.error('Backend test failed:', error);
    }
  };

  const testRegistration = async () => {
    try {
      const testData = {
        username: 'testuser',
        eventId: 999,
        eventTitle: 'Test Event',
        eventDate: '2024-12-25',
        eventTime: '10:00',
        eventLocation: 'Test Location',
        eventCategory: 'Test',
        eventDescription: 'Test Description',
        organizerUsername: 'testorganizer'
      };

      const result = await eventRegistrationService.registerForEvent(testData);
      console.log('Test registration result:', result);
      setStatus('✅ Test registration successful');
      
      // Refresh registrations
      testBackendConnection();
    } catch (error) {
      setStatus(`❌ Test registration failed: ${error.message}`);
      console.error('Test registration failed:', error);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f5f5', margin: '2rem', borderRadius: '8px' }}>
      <h2>Backend Connection Test</h2>
      <p><strong>Status:</strong> {status}</p>
      
      <button onClick={testBackendConnection} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
        Test Connection
      </button>
      
      <button onClick={testRegistration} style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
        Test Registration
      </button>
      
      <button onClick={() => window.open('http://localhost:8080/api/event-registrations/test', '_blank')} 
              style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}>
        Open Test Endpoint
      </button>
      
      <h3>Current Registrations:</h3>
      <pre style={{ background: '#fff', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {JSON.stringify(registrations, null, 2)}
      </pre>
    </div>
  );
};

export default TestBackend;