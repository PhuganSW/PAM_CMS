// Service.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Service.css';
import logo from './icon/PAM_logo.png';
import { FaCheckCircle } from 'react-icons/fa';

const Service = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0); // State to track the current slide
  const [activeButton, setActiveButton] = useState(null);

  const slides = [
    <div className="custom-slide first-slide" >
      <div className="content-center-wrapper">
      {/* Left Content */}
      <div className="content-center left-content">
        <img src={logo} alt="PAM Logo" className="circle-logo" />
        <p className="quote">"Unlock HR with PAM"</p>
        <p className="desc-quote">
          PAM (Personnel Assistance Management) is software to help HR  <br />manage
          human resources with web and mobile applications.
        </p>
        {/* <p className="quote">"Streamline Your HR"</p>
        <p style={{ textAlign: 'center', color: '#333', fontSize: 24, fontWeight: 'bold', lineHeight: '1.5' }}>
          Boost efficiency and simplify HR management with our intuitive
          solutions.
        </p> */}
      </div>
      {/* Right Content */}
      <div className="content-center right-content">
        <div className="message-box">
          <h3 style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}>Key Features:</h3>
          <ul style={{ paddingLeft: '20px', margin: 0 }}>
            <li>Employee Management</li>
            <li>Leave and Attendance Tracking</li>
            <li>Payroll Processing</li>
            <li>Performance Analysis</li>
            <li>Mobile and Web Compatibility</li>
          </ul>
        </div>
      </div>
    </div>
    </div>,
    <div className="custom-slide">
      
      <p>Coming Soon...</p>
    </div>,
    <div className="custom-slide">
      
      <p>Coming Soon...</p>
    </div>,
  ];

  // Function to handle next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Function to handle previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Keyboard event listener for left and right arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const scrollToPlan = () => {
    document.getElementById('plan-section').scrollIntoView({ behavior: 'smooth' });
    setActiveButton('plan'); // Set the active button to "Plan"
  };

  return (
    <div className="service-container">
       <nav className="navbar">
        <div className="navbar-left">
          <div className="logo-container">
            <img src={logo} alt="PAM Logo" className="logo" />
          </div>
          <button
            className={`nav-button plan-button ${activeButton === 'plan' ? '' : ''}`}
            onClick={scrollToPlan}
          >
            Plans
          </button>
        </div>
        <div className="button-container">
          <button
            className="nav-button"
            style={{ backgroundColor: '#D9D9D9' }}
            onClick={() => navigate('/login_company')}
          >
            Login
          </button>
          <button
            className="nav-button"
            style={{ backgroundColor: '#343434', color: '#FFF' }}
          >
            Register
          </button>
        </div>
      </nav>

      <div className="slideshow-container">
        <div className="arrow left-arrow" onClick={prevSlide}>
          &#8249;
        </div>
        <div className="slide-item">{slides[currentSlide]}</div>
        <div className="arrow right-arrow" onClick={nextSlide}>
          &#8250;
        </div>
        <div className="dots-container">
          {slides.map((_, index) => (
            <span
              key={index}
              className={`dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            ></span>
          ))}
        </div>
      </div>

      <div id="plan-section" className="plan-section">
        <div className="plan-header">
          <span className="line"></span>
          <h2 className="plan-title">Plans</h2>
          <span className="line"></span>
        </div>
        <div className="plan-cards">
          <div className="card">
            <h3>PAM 10</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 10 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>PAM 20</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 20 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>PAM 30</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 30 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>PAM 50</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 50 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>PAM 80</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 80 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>PAM 100</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 100 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>PAM 125</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 125 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
          <div className="card">
            <h3>PAM 150</h3>
            <ul>
              <li>
                <FaCheckCircle className="icon" />
                Support 150 employees.
              </li>
              <li>
                <FaCheckCircle className="icon" />
                Basic payroll processing.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Service;
