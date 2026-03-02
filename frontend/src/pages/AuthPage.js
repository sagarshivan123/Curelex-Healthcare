
import React, { useState ,useEffect} from 'react';
import { useNavigate, useSearchParams,useNavigationType } from 'react-router-dom';
import { login,logout } from '../authSlice';
import { useDispatch,useSelector } from "react-redux";
import toast from 'react-hot-toast';
import { patientSignup, patientSignin, doctorSignup, doctorSignin, patientForgotPassword } from '../services/api';
import { FaUser, FaUserMd, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaIdCard, FaHospital, FaStethoscope } from 'react-icons/fa';
import '../styles/AuthPage.css';


const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'patient';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [authMode, setAuthMode] = useState('signin');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigationType = useNavigationType();


  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (navigationType === "POP" && token) {
      dispatch(logout());
    }
  }, [navigationType, token, dispatch]);

  // Patient form states
  const [patientData, setPatientData] = useState({
    fullName: '',
    age: '',
    gender: '',
    mobileNumber: '',
    email: '',
    address: '',
    emergencyContact: '',
    aadhaarNumber: '',
    password: '',
    confirmPassword: ''
  });

  // Doctor form states
  const [doctorData, setDoctorData] = useState({
    doctorName: '',
    age: '',
    gender: '',
    specialization: '',
    medicalRegistrationNumber: '',
    registrationState: '',
    currentPracticeHospital: '',
    yearsOfExperience: '',
    totalPatientsTreated: '',
    email: '',
    mobileNumber: '',
    professionalPhoto: null,
    registrationCertificate: null
  });

  // Signin states
  const [signinData, setSigninData] = useState({
    email: '',
    password: ''
  });

  const handlePatientChange = (e) => {
    setPatientData({ ...patientData, [e.target.name]: e.target.value });
  };

  const handleDoctorChange = (e) => {
    if (e.target.type === 'file') {
      setDoctorData({ ...doctorData, [e.target.name]: e.target.files[0] });
    } else {
      setDoctorData({ ...doctorData, [e.target.name]: e.target.value });
    }
  };

  const handleSigninChange = (e) => {
    setSigninData({ ...signinData, [e.target.name]: e.target.value });
  };

  const handlePatientSignup = async (e) => {
    e.preventDefault();
    if (patientData.password !== patientData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await patientSignup(patientData);
      toast.success('Registration successful!');
      dispatch(login({
        userData: response.data,
        authToken: response.data.token,
        role: 'patient'
       }));
      navigate('/patient/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    Object.keys(doctorData).forEach(key => {
      formData.append(key, doctorData[key]);
    });
    try {
      const response = await doctorSignup(formData);
      toast.success('Registration submitted! Waiting for approval.',response);
      setAuthMode('signin');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = activeTab === 'patient' 
        ? await patientSignin(signinData)
        : await doctorSignin(signinData);
      
      toast.success('Login successful!');
      dispatch(login({
        userData: response.data,
        authToken: response.data.token,
        role: activeTab
       }));
      navigate(`/${activeTab}/dashboard`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!signinData.email) {
      toast.error('Please enter your email first');
      return;
    }
    try {
      await patientForgotPassword(signinData.email);
      toast.success('Password reset instructions sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Request failed');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <img src="/curelex-logo.jpeg" alt="CureLex" className="auth-logo" />
          <h1>Welcome to CureLex</h1>
          <p>CONNECT. CONSULT. CARE.</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${activeTab === 'patient' ? 'active' : ''}`}
            onClick={() => setActiveTab('patient')}
          >
            <FaUser /> Patient
          </button>
          <button 
            className={`tab-btn ${activeTab === 'doctor' ? 'active' : ''}`}
            onClick={() => setActiveTab('doctor')}
          >
            <FaUserMd /> Doctor
          </button>
        </div>

        <div className="auth-mode-toggle">
          <button 
            className={authMode === 'signin' ? 'active' : ''}
            onClick={() => setAuthMode('signin')}
          >
            Sign In
          </button>
          <button 
            className={authMode === 'signup' ? 'active' : ''}
            onClick={() => setAuthMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {authMode === 'signin' ? (
          <form className="auth-form" onSubmit={handleSignin}>
            <div className="form-group">
              <label><FaEnvelope /> Email</label>
              <input 
                type="email" 
                name="email"
                value={signinData.email}
                onChange={handleSigninChange}
                required 
                placeholder="your.email@example.com"
              />
            </div>
            <div className="form-group">
              <label><FaLock /> Password</label>
              <input 
                type="password" 
                name="password"
                value={signinData.password}
                onChange={handleSigninChange}
                required 
                placeholder="Enter your password"
              />
            </div>
            {activeTab === 'patient' && (
              <button type="button" className="forgot-password" onClick={handleForgotPassword}>
                Forgot Password?
              </button>
            )}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        ) : activeTab === 'patient' ? (
          <form className="auth-form" onSubmit={handlePatientSignup}>
            <div className="form-row">
              <div className="form-group">
                <label>Full Name</label>
                <input name="fullName" value={patientData.fullName} onChange={handlePatientChange} required />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={patientData.age} onChange={handlePatientChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={patientData.gender} onChange={handlePatientChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FaPhone /> Mobile Number</label>
                <input name="mobileNumber" value={patientData.mobileNumber} onChange={handlePatientChange} required />
              </div>
              <div className="form-group">
                <label><FaEnvelope /> Email</label>
                <input type="email" name="email" value={patientData.email} onChange={handlePatientChange} required />
              </div>
            </div>
            <div className="form-group">
              <label><FaMapMarkerAlt /> Address</label>
              <textarea name="address" value={patientData.address} onChange={handlePatientChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact</label>
                <input name="emergencyContact" value={patientData.emergencyContact} onChange={handlePatientChange} required />
              </div>
              <div className="form-group">
                <label><FaIdCard /> Aadhaar Number</label>
                <input name="aadhaarNumber" value={patientData.aadhaarNumber} onChange={handlePatientChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FaLock /> Password</label>
                <input type="password" name="password" value={patientData.password} onChange={handlePatientChange} required />
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input type="password" name="confirmPassword" value={patientData.confirmPassword} onChange={handlePatientChange} required />
              </div>
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Registering...' : 'Register as Patient'}
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleDoctorSignup}>
            <div className="form-row">
              <div className="form-group">
                <label>Doctor Name</label>
                <input name="doctorName" value={doctorData.doctorName} onChange={handleDoctorChange} required />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input type="number" name="age" value={doctorData.age} onChange={handleDoctorChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Gender</label>
              <select name="gender" value={doctorData.gender} onChange={handleDoctorChange} required>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label><FaStethoscope /> Specialization</label>
              <input name="specialization" value={doctorData.specialization} onChange={handleDoctorChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Medical Registration Number</label>
                <input name="medicalRegistrationNumber" value={doctorData.medicalRegistrationNumber} onChange={handleDoctorChange} required />
              </div>
              <div className="form-group">
                <label>Registration State</label>
                <input name="registrationState" value={doctorData.registrationState} onChange={handleDoctorChange} required />
              </div>
            </div>
            <div className="form-group">
              <label><FaHospital /> Current Practice Hospital</label>
              <input name="currentPracticeHospital" value={doctorData.currentPracticeHospital} onChange={handleDoctorChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Years of Experience</label>
                <input type="number" name="yearsOfExperience" value={doctorData.yearsOfExperience} onChange={handleDoctorChange} required />
              </div>
              <div className="form-group">
                <label>Total Patients Treated</label>
                <input type="number" name="totalPatientsTreated" value={doctorData.totalPatientsTreated} onChange={handleDoctorChange} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label><FaEnvelope /> Email</label>
                <input type="email" name="email" value={doctorData.email} onChange={handleDoctorChange} required />
              </div>
              <div className="form-group">
                <label><FaPhone /> Mobile Number</label>
                <input name="mobileNumber" value={doctorData.mobileNumber} onChange={handleDoctorChange} required />
              </div>
            </div>
            <div className="form-group">
              <label>Professional Photo (with stethoscope)</label>
              <input type="file" name="professionalPhoto" onChange={handleDoctorChange} accept="image/*" required />
            </div>
            <div className="form-group">
              <label>Registration Certificate</label>
              <input type="file" name="registrationCertificate" onChange={handleDoctorChange} accept="image/*,.pdf" required />
            </div>
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Submitting...' : 'Register as Doctor'}
            </button>
            <p className="info-text">
              Note: Your registration will be reviewed by our admin team. You'll receive login credentials via email once approved.
            </p>
          </form>
        )}

        <button className="back-home" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
};

export default AuthPage;