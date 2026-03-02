

import React , { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaStethoscope, FaUserMd, FaHeartbeat, FaShieldAlt, FaMapMarkerAlt, FaEnvelope, FaPhone, FaLinkedin, FaTwitter, FaInstagram, FaFacebook,FaBars, FaTimes } from 'react-icons/fa';
import '../styles/HomePage.css';


const HomePage = () => {
  const navigate = useNavigate();

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const partnerLogos = [
    { name: 'Indian Institute of Information Technology, Allahabad', shortName: 'IIIT Allahabad' },
    { name: 'Startup and Incubation Cell United University', shortName: 'SIC United University' },
    { name: 'Asian Institute of Technology', shortName: 'AIT' }
  ];

  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="homepage">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <img src="/curelex-logo.jpeg" alt="CureLex" className="logo-image" />
          </div>
          <div className="hamburger" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaTimes /> : <FaBars />}
          </div>
          <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          <li><a href="#home" onClick={() => setIsOpen(false)}>Home</a></li>
          <li><a href="#about" onClick={() => setIsOpen(false)}>About Us</a></li>
          <li><a href="#services" onClick={() => setIsOpen(false)}>Services</a></li>
          <li><a href="#contact" onClick={() => setIsOpen(false)}>Contact</a></li>
          <li>
              <button className="login-btn" onClick={() => navigate('/auth')}>
                Login
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-content">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h1 className="hero-title">
              Your Health, Our <span className="gradient-text">Priority</span>
            </h1>
            <p className="hero-subtitle">
              CONNECT. CONSULT. CARE.
            </p>
            <p className="hero-description">
              Experience seamless healthcare with verified doctors, secure medical records, and 24/7 consultation services.
            </p>
            <div className="hero-buttons">
              <button className="btn btn-primary" onClick={() => navigate('/auth?tab=patient')}>
                <FaHeartbeat /> Get Started as Patient
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/auth?tab=doctor')}>
                <FaUserMd /> Join as Doctor
              </button>
            </div>
          </motion.div>
        </div>
        <div className="hero-visual">
          <div className="floating-card card-1">
            <FaStethoscope size={40} />
            <p>24/7 Consultation</p>
          </div>
          <div className="floating-card card-2">
            <FaShieldAlt size={40} />
            <p>Secure & Private</p>
          </div>
          <div className="floating-card card-3">
            <FaUserMd size={40} />
            <p>Verified Doctors</p>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="about-section">
        <div className="container">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">About CureLex</h2>
            <div className="about-content">
              <div className="about-text">
                <h3>Transforming Healthcare Accessibility</h3>
                <p>
                  CureLex is a revolutionary healthcare platform designed to bridge the gap between patients and quality medical care. Our mission is to make healthcare accessible, affordable, and efficient for everyone.
                </p>
                <h4>Our Vision</h4>
                <p>
                  To create a world where quality healthcare is just a click away, empowering individuals to take control of their health journey with confidence and ease.
                </p>
                <h4>Our Mission</h4>
                <p>
                  Connecting patients with verified medical professionals through cutting-edge technology, ensuring secure, personalized, and compassionate care at every step.
                </p>
              </div>
              <div className="about-features">
                <div className="feature-card">
                  <FaHeartbeat className="feature-icon" />
                  <h4>Patient-Centric</h4>
                  <p>Your health and well-being are at the core of everything we do</p>
                </div>
                <div className="feature-card">
                  <FaShieldAlt className="feature-icon" />
                  <h4>Secure & Private</h4>
                  <p>End-to-end encryption ensures your data is always protected</p>
                </div>
                <div className="feature-card">
                  <FaUserMd className="feature-icon" />
                  <h4>Verified Doctors</h4>
                  <p>All doctors are thoroughly verified and credentialed</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Supported By Section */}
      <section className="supported-section">
        <div className="container">
          <h2 className="section-title">Supported By</h2>
          <div className="partners-grid">
            {partnerLogos.map((partner, index) => (
              <motion.div
                key={index}
                className="partner-card"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <div className="partner-logo-placeholder">
                  {partner.shortName}
                </div>
                <p>{partner.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact-section">
        <div className="container">
          <h2 className="section-title">Get In Touch</h2>
          <div className="contact-content">
            <div className="contact-info">
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <div>
                  <h4>Address</h4>
                  <p>CureLex Healthcare Pvt. Ltd.<br />
                  Technology Park, Innovation Hub<br />
                  Bangalore, Karnataka 560001</p>
                </div>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <div>
                  <h4>Email</h4>
                  <p><a href="mailto:contact@curelex.com">contact@curelex.com</a></p>
                  <p><a href="mailto:support@curelex.com">support@curelex.com</a></p>
                </div>
              </div>
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <div>
                  <h4>Phone</h4>
                  <p>+91 1800-123-4567 (Toll Free)</p>
                  <p>+91 98765-43210</p>
                </div>
              </div>
            </div>
            <div className="contact-map">
              <iframe
                title="CureLex Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.8447392624785!2d77.59369931482178!3d12.971598990862697!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sBangalore!5e0!3m2!1sen!2sin!4v1634567890123!5m2!1sen!2sin"
                width="100%"
                height="350"
                style={{ border: 0, borderRadius: '12px' }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
          
          {/* Social Media */}
          <div className="social-media">
            <h3>Connect With Us</h3>
            <div className="social-icons">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <img src="/curelex-logo.jpeg" alt="CureLex" className="footer-logo" />
              <p>CONNECT. CONSULT. CARE.</p>
            </div>
              <div className="footer-column">
                <h4>Quick Links</h4>
                <ul>
                  <li><a href="#home">Home</a></li>
                  <li><a href="#about">About Us</a></li>
                  <li><a href="#services">Services</a></li>
                  <li><a href="#contact">Contact</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>For Patients</h4>
                <ul>
                  <li><a href="/auth?tab=patient">Sign Up</a></li>
                  <li><a href="/auth">Login</a></li>
                  <li><a href="#services">Services</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h4>For Doctors</h4>
                <ul>
                  <li><a href="/auth?tab=doctor">Register</a></li>
                  <li><a href="/auth">Login</a></li>
                  <li><a href="#about">About Platform</a></li>
                </ul>
              </div>
              
          </div>
          <div className="footer-bottom">
            <p>&copy; 2026 CureLex Healthcare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;