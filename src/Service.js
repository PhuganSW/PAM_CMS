// Service.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Service.css';
import logo from './icon/PAM_logo.png';

const Service = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0); // State to track the current slide

  const slides = [
    <div className="custom-slide first-slide" >
      <div className="content-center">
        <img src={logo} alt="PAM Logo" className="circle-logo" />
        <p className="quote">Unlock HR with PAM</p>
      </div>
    </div>,
    <div className="custom-slide">
      
      <p>This is the second slide.</p>
    </div>,
    <div className="custom-slide">
      
      <p>This is the third slide.</p>
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

  return (
    <div className="service-container">
      <nav className="navbar">
        <div className="logo-container">
          <img src={logo} alt="PAM Logo" className="logo" />
        </div>
        <div className="button-container">
          <button className="nav-button" style={{backgroundColor:'#D9D9D9'}} onClick={()=> navigate('/login_company')}>Login</button>
          <button className="nav-button" style={{backgroundColor:'#343434',color:'#FFF'}}>Register</button>
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
      </div>
    </div>
  );
};

export default Service;
