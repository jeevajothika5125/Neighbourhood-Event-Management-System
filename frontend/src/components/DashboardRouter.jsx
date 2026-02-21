import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboard/AdminDashboard';
import OrganizerDashboard from './dashboard/OrganizerDashboard';
import ResidentDashboard from './dashboard/ResidentDashboard';

const DashboardRouter = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  switch (user?.role) {
    case 'Admin':
      return <AdminDashboard />;
    case 'Organizer':
      return <OrganizerDashboard />;
    case 'Participant':
      return <ResidentDashboard />;
    default:
      return (
        <div className="error-message">
          <h2>Access Denied</h2>
          <p>Invalid user role. Please contact administrator.</p>
        </div>
      );
  }
};

export default DashboardRouter;