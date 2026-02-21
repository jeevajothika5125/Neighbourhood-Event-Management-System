import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!role) {
      alert('Please select a role first!');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Role:', role, 'Form Data:', formData);

    if (role === 'Admin') {
      navigate('/admin-dashboard');
    } else if (role === 'Organizer') {
      navigate('/organizer-dashboard');
    } else {
      navigate('/participant-dashboard');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Register</h2>

        {/* Role Selection */}
        <div className="role-selection">
          <label>
            <input
              type="radio"
              name="role"
              value="Admin"
              checked={role === 'Admin'}
              onChange={(e) => setRole(e.target.value)}
            />
            Admin
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Organizer"
              checked={role === 'Organizer'}
              onChange={(e) => setRole(e.target.value)}
            />
            Organizer
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="Participant"
              checked={role === 'Participant'}
              onChange={(e) => setRole(e.target.value)}
            />
            Participant
          </label>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
          <button type="submit">Register</button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem;
        }

        .auth-card {
          background: white;
          border-radius: 16px;
          padding: 3rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 400px;
          width: 100%;
        }

        .auth-card h2 {
          text-align: center;
          margin-bottom: 2rem;
          color: #1f2937;
        }

        .role-selection {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .role-selection label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
        }

        .auth-card form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-card input[type="text"],
        .auth-card input[type="email"],
        .auth-card input[type="password"] {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          font-size: 1rem;
        }

        .auth-card button {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          cursor: pointer;
          font-weight: 600;
        }

        .auth-card p {
          text-align: center;
          margin-top: 1rem;
          color: #6b7280;
        }

        .auth-card a {
          color: #667eea;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
};

export default RegisterForm;