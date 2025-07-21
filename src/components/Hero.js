import React from 'react';
import './Hero.css';

const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Hi, I'm <span className="highlight">Himanshu S Janmeda</span>
            </h1>
            <p className="hero-subtitle">
              Computer Engineering Student & Full Stack Developer
            </p>
            <p className="hero-description">
              I build AI-driven and cloud-native applications that merge data science with immersive user experiences. Passionate about clean code, scalable architecture, and turning innovative ideas into reality.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn"
                onClick={() => scrollToSection('projects')}
              >
                View My Work
              </button>
              <button 
                className="btn btn-outline"
                onClick={() => scrollToSection('contact')}
              >
                Get In Touch
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
