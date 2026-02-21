import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { NotificationProvider } from './context/NotificationContext';
import { EventsProvider } from './context/EventsContext';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import HomePage from './components/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AdminLogin from './components/auth/AdminLogin';
import OrganizerLogin from './components/auth/OrganizerLogin';
import ParticipantLogin from './components/auth/ParticipantLogin';
import AdminRegister from './components/auth/AdminRegister';
import OrganizerRegister from './components/auth/OrganizerRegister';
import ParticipantRegister from './components/auth/ParticipantRegister';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import DashboardRouter from './components/DashboardRouter';
import EventList from './components/events/EventList';
import EventDetails from './components/events/EventDetails';
import EventForm from './components/events/EventForm';
import EventCalendar from './components/events/EventCalendar';
import ProfileView from './components/profile/ProfileView';
import ProfileEdit from './components/profile/ProfileEdit';
import NotificationSettings from './components/profile/NotificationSettings';
import AdminProfile from './components/profile/AdminProfile';
import OrganizerProfile from './components/profile/OrganizerProfile';
import ParticipantProfile from './components/profile/ParticipantProfile';
import AdminNotifications from './components/profile/AdminNotifications';
import OrganizerNotifications from './components/profile/OrganizerNotifications';
import ParticipantNotifications from './components/profile/ParticipantNotifications';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/home.css';
import AdminDashboard from './components/dashboard/AdminDashboard';
import OrganizerDashboard from './components/dashboard/OrganizerDashboard';
import ResidentDashboard from './components/dashboard/ResidentDashboard';
import ViewVenues from './components/venues/ViewVenues';
import ManageUsers from './components/admin/ManageUsers';
import Analytics from './components/admin/Analytics';
import SystemSettings from './components/admin/SystemSettings';
import AdminEventList from './components/admin/AdminEventList';

// Layout wrapper component
const Layout = ({ children, showHeader = true, showFooter = true }) => {
  return (
    <div className="App">
      {showHeader && <Header />}
      <main className="main-content">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};



function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <EventsProvider>
          <EventProvider>
            <Router>
            <Routes>
              {/* Public routes without header/footer */}
              <Route path="/" element={
                <Layout>
                  <HomePage />
                </Layout>
              } />
              
              
              <Route path="/admin-login" element={
                <Layout showHeader={false} showFooter={false}>
                  <AdminLogin />
                </Layout>
              } />
              
              <Route path="/organizer-login" element={
                <Layout showHeader={false} showFooter={false}>
                  <OrganizerLogin />
                </Layout>
              } />
              
              <Route path="/participant-login" element={
                <Layout showHeader={false} showFooter={false}>
                  <ParticipantLogin />
                </Layout>
              } />
              
              <Route path="/admin-register" element={
                <Layout showHeader={false} showFooter={false}>
                  <AdminRegister />
                </Layout>
              } />
              
              <Route path="/organizer-register" element={
                <Layout showHeader={false} showFooter={false}>
                  <OrganizerRegister />
                </Layout>
              } />
              
              <Route path="/participant-register" element={
                <Layout showHeader={false} showFooter={false}>
                  <ParticipantRegister />
                </Layout>
              } />
              
              <Route path="/forgot-password" element={
                <Layout showHeader={false} showFooter={false}>
                  <ForgotPassword />
                </Layout>
              } />
              
              <Route path="/reset-password" element={
                <Layout showHeader={false} showFooter={false}>
                  <ResetPassword />
                </Layout>
              } />

              {/* Protected routes with header/footer */}
              <Route path="/dashboard" element={
                <Layout>
                  <DashboardRouter />
                </Layout>
              } />
              
              <Route path="/admin-dashboard" element={
                <Layout>
                  <AdminDashboard />
                </Layout>
              } />
              
              <Route path="/organizer-dashboard" element={
                <Layout>
                  <OrganizerDashboard />
                </Layout>
              } />
              
              <Route path="/participant-dashboard" element={
                <Layout>
                  <ResidentDashboard />
                </Layout>
              } />


              <Route path="/events" element={
                <Layout>
                  <EventList />
                </Layout>
              } />

              <Route path="/events/create" element={
                <Layout>
                  <EventForm />
                </Layout>
              } />

              <Route path="/events/:id" element={
                <Layout>
                  <EventDetails />
                </Layout>
              } />

              <Route path="/event-details" element={
                <Layout>
                  <EventDetails />
                </Layout>
              } />

              <Route path="/events/:id/edit" element={
                <Layout>
                  <EventForm isEdit={true} />
                </Layout>
              } />

              <Route path="/events/calendar" element={
                <Layout>
                  <EventCalendar />
                </Layout>
              } />

              <Route path="/profile" element={
                <Layout>
                  <ProfileView />
                </Layout>
              } />

              <Route path="/profile/edit" element={
                <Layout>
                  <ProfileEdit />
                </Layout>
              } />

              <Route path="/profile/notifications" element={
                <Layout>
                  <NotificationSettings />
                </Layout>
              } />

              <Route path="/admin/profile" element={
                <Layout>
                  <AdminProfile />
                </Layout>
              } />

              <Route path="/organizer/profile" element={
                <Layout>
                  <OrganizerProfile />
                </Layout>
              } />

              <Route path="/participant/profile" element={
                <Layout>
                  <ParticipantProfile />
                </Layout>
              } />

              <Route path="/admin/notifications" element={
                <Layout>
                  <AdminNotifications />
                </Layout>
              } />

              <Route path="/organizer/notifications" element={
                <Layout>
                  <OrganizerNotifications />
                </Layout>
              } />

              <Route path="/participant/notifications" element={
                <Layout>
                  <ParticipantNotifications />
                </Layout>
              } />

              <Route path="/venues" element={
                <Layout>
                  <ViewVenues />
                </Layout>
              } />

              <Route path="/users" element={
                <Layout>
                  <ManageUsers />
                </Layout>
              } />

              <Route path="/analytics" element={
                <Layout>
                  <Analytics />
                </Layout>
              } />

              <Route path="/settings" element={
                <Layout>
                  <SystemSettings />
                </Layout>
              } />

              <Route path="/admin/events" element={
                <Layout>
                  <AdminEventList />
                </Layout>
              } />

              {/* Fallback route */}
              <Route path="*" element={
                <Layout>
                  <div className="error-page">
                    <h1>404 - Page Not Found</h1>
                    <p>The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn btn-primary">Go Home</a>
                  </div>
                </Layout>
              } />
            </Routes>
            </Router>
          </EventProvider>
        </EventsProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;