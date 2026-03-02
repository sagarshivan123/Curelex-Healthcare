import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../authSlice";
import { getPatientDashboard } from '../services/api';
import toast from 'react-hot-toast';
import { FaUser, FaStethoscope, FaPrescription, FaCalendarCheck, FaSignOutAlt } from 'react-icons/fa';
import '../styles/Dashboard.css';

const PatientDashboard = () => {
  const dispatch = useDispatch();

const { user } =useSelector(state => state.auth);
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getPatientDashboard();
      setDashboardData(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };
  const handleLogout = () => {

    dispatch(logout());
   
    navigate('/');
   
    toast.success('Logged out successfully');
   
   };

  if (loading) {
    return <div className="loading-screen">Loading dashboard...</div>;
  }

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
          <h1>Hello, {user?.fullName}! 👋</h1>
          <p>Welcome to your CureLex health dashboard</p>
        </div>

        <div className="patient-info-card">
          <h3><FaUser /> Patient Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Patient ID:</span>
              <span className="info-value">{user?.patientId}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Age:</span>
              <span className="info-value">{dashboardData?.patient?.age} years</span>
            </div>
            <div className="info-item">
              <span className="info-label">Gender:</span>
              <span className="info-value">{dashboardData?.patient?.gender}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{dashboardData?.patient?.email}</span>
            </div>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-header">
              <FaStethoscope />
              <h3>Current Symptoms</h3>
            </div>
            <div className="card-content">
              {dashboardData?.currentSymptoms ? (
                <p>{dashboardData.currentSymptoms}</p>
              ) : (
                <p className="empty-state">No current symptoms recorded</p>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <FaPrescription />
              <h3>Past Prescriptions</h3>
            </div>
            <div className="card-content">
              {dashboardData?.pastPrescriptions?.length > 0 ? (
                <ul className="prescription-list">
                  {dashboardData.pastPrescriptions.map((prescription, index) => (
                    <li key={index}>
                      <div className="prescription-item">
                        <strong>{new Date(prescription.date).toLocaleDateString()}</strong>
                        <p>{prescription.diagnosis}</p>
                        <span className="prescription-text">{prescription.prescription}</span>
                        {prescription.doctor && (
                          <span className="doctor-name">By: Dr. {prescription.doctor.name}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">No past prescriptions</p>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <FaCalendarCheck />
              <h3>Past Follow-Ups</h3>
            </div>
            <div className="card-content">
              {dashboardData?.pastFollowUps?.length > 0 ? (
                <ul className="followup-list">
                  {dashboardData.pastFollowUps.map((followup, index) => (
                    <li key={index}>
                      <div className="followup-item">
                        <strong>{new Date(followup.date).toLocaleDateString()}</strong>
                        <p>{followup.diagnosis}</p>
                        {followup.doctor && (
                          <span className="doctor-name">Dr. {followup.doctor.name}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">No past follow-ups</p>
              )}
            </div>
          </div>

          <div className="dashboard-card">
            <div className="card-header">
              <FaCalendarCheck />
              <h3>Current Follow-Up Status</h3>
            </div>
            <div className="card-content">
              {dashboardData?.currentFollowUp?.length > 0 ? (
                <ul className="followup-list">
                  {dashboardData.currentFollowUp.map((followup, index) => (
                    <li key={index}>
                      <div className="followup-item">
                        <span className={`status-badge ${followup.followUpStatus.toLowerCase()}`}>
                          {followup.followUpStatus}
                        </span>
                        <strong>{followup.diagnosis}</strong>
                        {followup.followUpDate && (
                          <p>Follow-up Date: {new Date(followup.followUpDate).toLocaleDateString()}</p>
                        )}
                        {followup.doctor && (
                          <span className="doctor-name">Dr. {followup.doctor.name}</span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="empty-state">No pending follow-ups</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;