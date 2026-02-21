import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    if (location.pathname === '/') {
      const handleScroll = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setShowFooter(scrollTop > 300);
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [location.pathname]);
  
  // Simple footer for homepage
  if (location.pathname === '/') {
    return (
      <footer className={`home-footer ${showFooter ? 'footer-visible' : 'footer-hidden'}`}>
        <div className="home-footer-container">
          <div className="home-footer-content">
            <div className="footer-logo">
              🏠 Neighbourhood Hub
            </div>
            <p className="footer-tagline">Connecting Communities, One Event at a Time</p>
            <div className="footer-links">
              <a href="/participant-login">Join as Resident</a>
              <a href="/organizer-login">Become Organizer</a>
              <a href="/admin-login">Admin Access</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Neighbourhood Hub. Bringing communities together.</p>
          </div>
        </div>
        
        <style jsx>{`
          .home-footer {
            background: linear-gradient(135deg, #1e40af 0%, #7c2d12 100%);
            padding: 2rem 0 1rem;
            margin: 0;
            display: none;
          }

          .footer-visible {
            display: block;
          }

          .footer-hidden {
            display: none;
          }

          .home-footer-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2rem;
          }

          .home-footer-content {
            text-align: center;
            margin-bottom: 2rem;
          }

          .footer-logo {
            font-size: 2rem;
            font-weight: 700;
            color: white;
            margin-bottom: 1rem;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }

          .footer-tagline {
            color: #f3f4f6;
            font-size: 1.1rem;
            margin-bottom: 2rem;
          }

          .footer-links {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
          }

          .footer-links a {
            color: white;
            text-decoration: none;
            font-weight: 500;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.2s ease;
          }

          .footer-links a:hover {
            background: rgba(255, 255, 255, 0.2);
            color: #f3f4f6;
          }

          .footer-bottom {
            text-align: center;
            padding-top: 2rem;
            border-top: 1px solid rgba(255, 255, 255, 0.3);
            color: #f3f4f6;
            font-size: 0.9rem;
          }

          @media (max-width: 768px) {
            .footer-links {
              flex-direction: column;
              gap: 1rem;
            }
          }
        `}</style>
      </footer>
    );
  }
  
  // Get role-specific links
  const getQuickLinks = () => {
    if (location.pathname.includes('participant')) {
      return [
        { href: '/participant-dashboard', label: 'Home' },
        { href: '/events/calendar', label: 'Calendar' },
        { href: '/profile', label: 'Profile' }
      ];
    } else if (location.pathname.includes('organizer')) {
      return [
        { href: '/organizer-dashboard', label: 'Home' },
        { href: '/profile', label: 'Profile' },
        { href: '/events', label: 'Created Events' }
      ];
    } else if (location.pathname.includes('admin')) {
      return [
        { href: '/admin-dashboard', label: 'Home' },
        { href: '/profile', label: 'Profile' },
        { href: '/events', label: 'Approved Events' }
      ];
    }
    return [
      { href: '/', label: 'Home' },
      { href: '/profile', label: 'Profile' }
    ];
  };

  const quickLinks = getQuickLinks();

  // Regular footer for other pages
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Neighbourhood Hub</h3>
            <p>Your neighbourhood event management solution.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              {quickLinks.map((link, index) => (
                <li key={index}><a href={link.href}>{link.label}</a></li>
              ))}
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Community</h4>
            <p>Building stronger neighbourhoods</p>
            <p>One event at a time</p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Neighbourhood Hub. All rights reserved.</p>
        </div>
      </div>
      
      <style jsx>{`
        .footer {
          background: linear-gradient(135deg, #1e40af 0%, #7c2d12 100%);
          color: white;
          padding: 3rem 0 1rem;
          margin-top: auto;
        }

        .footer-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .footer-section h3 {
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: white;
        }

        .footer-section h4 {
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #f3f4f6;
        }

        .footer-section p {
          color: #d1d5db;
          line-height: 1.6;
          margin-bottom: 0.5rem;
        }

        .footer-section ul {
          list-style: none;
          padding: 0;
        }

        .footer-section li {
          margin-bottom: 0.5rem;
        }

        .footer-section a {
          color: #d1d5db;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-section a:hover {
          color: white;
        }

        .footer-bottom {
          text-align: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.3);
          color: #d1d5db;
          font-size: 0.9rem;
        }

        @media (max-width: 768px) {
          .footer-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;