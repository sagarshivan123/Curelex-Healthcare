
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';

import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';



// ✅ Protected Route using Redux
const ProtectedRoute = ({ children, role }) => {

  const { token, userRole, loading } =
  useSelector(state => state.auth);

  const isAuthenticated = !!token;

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};


function App() {
  return (
      <Router>

        <Toaster position="top-right" />

        <Routes>

          <Route path="/" element={<HomePage />} />

          <Route path="/auth" element={<AuthPage />} />

          <Route
            path="/patient/dashboard"
            element={
              <ProtectedRoute role="patient">
                <PatientDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/doctor/dashboard"
            element={
              <ProtectedRoute role="doctor">
                <DoctorDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>

      </Router>
  );
}

export default App;