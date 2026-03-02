import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../authSlice";
import toast from 'react-hot-toast';
import { FaUserMd, FaSignOutAlt, FaStethoscope } from 'react-icons/fa';
import '../styles/Dashboard.css';

const DoctorDashboard = () => {
  const dispatch = useDispatch();

const { user } =
useSelector(state => state.auth);
  const navigate = useNavigate();

  const handleLogout = () => {

    dispatch(logout());
   
    navigate('/');
   
    toast.success('Logged out successfully');
   
   };

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <img src="/curelex-logo.jpeg" alt="CureLex" className="dashboard-logo" />
        <button onClick={handleLogout} className="logout-btn">
          <FaSignOutAlt /> Logout
        </button>
      </nav>

      <div className="dashboard-container">
        <div className="welcome-section">
          <h1>Welcome, Dr. {user?.doctorName}! 👨‍⚕️</h1>
          <p>Your CureLex doctor portal</p>
        </div>

        <div className="doctor-info-card">
          <h3><FaUserMd /> Doctor Profile</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Doctor ID:</span>
              <span className="info-value">{user?.doctorId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Specialization:</span>
              <span className="info-value">{user?.specialization}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{user?.email}</span>
            </div>
          </div>
        </div>

        <div className="coming-soon-card">
          <FaStethoscope size={60} />
          <h2>Doctor Features Coming Soon</h2>
          <p>We're working on exciting features for doctors including:</p>
          <ul>
            <li>📅 Appointment Management</li>
            <li>👥 Patient Management</li>
            <li>💊 Prescription Creation</li>
            <li>📊 Analytics Dashboard</li>
            <li>💬 Patient Consultation</li>
          </ul>
          <p className="stay-tuned">Stay tuned for updates!</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;