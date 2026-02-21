import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const OrganizerRegister = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    countryCode: '+91',
    contactNumber: '',
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 6;
    const hasNumber = /\d/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return minLength && hasNumber && hasLetter && hasSpecial;
  };

  const validateMobile = (countryCode, number) => {
    const patterns = {
      '+91': /^[6-9]\d{9}$/,
      '+1': /^\d{10}$/,
      '+44': /^\d{10,11}$/,
      '+86': /^1[3-9]\d{9}$/,
      '+81': /^\d{10,11}$/,
      '+49': /^\d{10,12}$/,
      '+33': /^\d{9,10}$/,
      '+61': /^\d{9}$/
    };
    return patterns[countryCode]?.test(number) || false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    if (!validatePassword(formData.password)) {
      setError('Password must be at least 6 characters with numbers, letters, and special characters');
      setLoading(false);
      return;
    }
    
    if (!validateMobile(formData.countryCode, formData.contactNumber)) {
      setError('Please enter a valid mobile number for the selected country');
      setLoading(false);
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      setLoading(false);
      return;
    }
    
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        contactNumber: formData.countryCode + formData.contactNumber,
        password: formData.password,
        role: 'ORGANIZER'
      };
      
      const user = await register(userData);
      if (user) {
        navigate('/organizer-dashboard');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-layout">
        <div className="auth-card">
          <div className="role-header">
            <div className="role-badge organizer">
              <span className="role-icon">🎯</span>
              <span className="role-text">Become an Organizer</span>
            </div>
            <h2>Create Magic! 🎆</h2>
            <p>Join our community of event creators</p>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input
                type="text"
                name="username"
                placeholder="Choose organizer name"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                name="email"
                placeholder="Your email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group phone-group">
              <span className="input-icon">📱</span>
              <select
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
                className="country-select"
                required
              >
                <option value="+91">🇮🇳 +91</option>
                <option value="+1">🇺🇸 +1</option>
                <option value="+44">🇬🇧 +44</option>
                <option value="+86">🇨🇳 +86</option>
                <option value="+81">🇯🇵 +81</option>
                <option value="+49">🇩🇪 +49</option>
                <option value="+33">🇫🇷 +33</option>
                <option value="+61">🇦🇺 +61</option>
              </select>
              <input
                type="tel"
                name="contactNumber"
                placeholder="Mobile number"
                value={formData.contactNumber}
                onChange={handleChange}
                className="phone-input"
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                name="password"
                placeholder="Create secure password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="input-group">
              <span className="input-icon">✓</span>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="register-btn organizer-btn" disabled={loading}>
              {loading ? '🔄 Creating Account...' : '🎉 Start Organizing!'}
            </button>
          </form>
          
          <div className="auth-links">
            <Link to="/forgot-password">Forgot Password? 🔑</Link>
            <Link to="/organizer-login">Already organizing? Sign in 🚀</Link>
            <Link to="/">← Back to Home</Link>
          </div>
        </div>

        <div className="app-info">
          <div className="info-content">
            <div className="app-logo">🌍</div>
            <h3>Neighbourhood Event Creator</h3>
            <p className="app-tagline">Turn Community Ideas Into Local Experiences</p>
            
            <div className="organizer-benefits">
              <div className="benefit">
                <span className="benefit-icon">🎨</span>
                <div>
                  <h4>Community Creative Freedom</h4>
                  <p>Design unique neighbourhood events that reflect your community vision</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">📈</span>
                <div>
                  <h4>Community Growth Analytics</h4>
                  <p>Track your neighbourhood event success and grow your local organizing skills</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">🌎</span>
                <div>
                  <h4>Neighbourhood Impact</h4>
                  <p>Make a difference by bringing your local community together</p>
                </div>
              </div>
              <div className="benefit">
                <span className="benefit-icon">💰</span>
                <div>
                  <h4>Community Monetization</h4>
                  <p>Turn your community passion into local profit with neighbourhood ticketing</p>
                </div>
              </div>
            </div>
            
            <div className="organizer-testimonial">
              <p>"🎆 Neighbourhood Hub gave me the tools to turn my small workshop idea into a thriving neighbourhood program!"</p>
              <span>- Alex, Community Organizer</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .auth-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 50%, #be185d 100%);
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }

        .auth-container::before {
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

        .auth-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          max-width: 1200px;
          width: 100%;
          position: relative;
          z-index: 2;
        }

        .auth-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          box-shadow: 0 25px 50px rgba(59, 130, 246, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .role-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .role-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
          color: white;
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          font-weight: 600;
          margin-bottom: 1.5rem;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .role-icon {
          font-size: 1.2rem;
        }

        .role-header h2 {
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 2rem;
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .role-header p {
          color: #6b7280;
          font-size: 1rem;
        }

        .auth-card form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .input-group {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.2rem;
          z-index: 1;
        }

        .auth-card input {
          width: 100%;
          padding: 1rem 1rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          transition: all 0.3s ease;
          background: rgba(255, 255, 255, 0.8);
        }

        .auth-card input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
          background: white;
        }

        .register-btn {
          padding: 1rem;
          border: none;
          border-radius: 12px;
          font-size: 1.1rem;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
        }

        .register-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(59, 130, 246, 0.4);
        }

        .register-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .error-message {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #dc2626;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.9rem;
          text-align: center;
        }

        .auth-links {
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .auth-links a {
          color: #3b82f6;
          text-decoration: none;
          font-weight: 500;
          transition: all 0.2s ease;
        }

        .auth-links a:hover {
          color: #ec4899;
          transform: translateY(-1px);
        }

        .app-info {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem;
          border: 2px solid rgba(255, 255, 255, 0.2);
          color: white;
        }

        .info-content {
          text-align: center;
        }

        .app-logo {
          font-size: 4rem;
          margin-bottom: 1rem;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }

        .info-content h3 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #fff 0%, #fce7f3 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .app-tagline {
          font-size: 1.2rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .organizer-benefits {
          text-align: left;
          margin-bottom: 2rem;
        }

        .benefit {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .benefit:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateX(5px);
        }

        .benefit-icon {
          font-size: 1.5rem;
          margin-top: 0.2rem;
        }

        .benefit h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
        }

        .benefit p {
          margin: 0;
          opacity: 0.8;
          font-size: 0.9rem;
        }

        .organizer-testimonial {
          background: rgba(255, 255, 255, 0.1);
          padding: 1.5rem;
          border-radius: 12px;
          border-left: 4px solid rgba(255, 255, 255, 0.5);
        }

        .organizer-testimonial p {
          margin: 0 0 1rem 0;
          font-style: italic;
          opacity: 0.9;
        }

        .organizer-testimonial span {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .phone-group {
          display: flex;
          gap: 0.5rem;
        }

        .country-select {
          width: 120px;
          padding: 1rem 0.5rem 1rem 3rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .phone-input {
          flex: 1;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 12px;
          font-size: 1rem;
          background: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .country-select:focus, .phone-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
          background: white;
        }

        @media (max-width: 768px) {
          .auth-layout {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .auth-container {
            padding: 1rem;
          }
          
          .auth-card, .app-info {
            padding: 2rem;
          }

          .phone-group {
            flex-direction: column;
          }

          .country-select {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default OrganizerRegister;