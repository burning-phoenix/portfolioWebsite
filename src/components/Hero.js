import React, { useRef, useState } from 'react';
import './Hero.css';
import trailerVideo from '../assets/noether-trailer.mp4';

const Hero = () => {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-content">
        <h1 className="hero-name">Himanshu Janmeda</h1>
        <p className="hero-subtitle">Computer Engineering &middot; AI/ML Research</p>

        <div className="hero-video-wrapper">
          <video
            ref={videoRef}
            className="hero-video"
            autoPlay
            muted
            loop
            playsInline
          >
            <source src={trailerVideo} type="video/mp4" />
          </video>
          <button
            className="mute-toggle"
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11 5L6 9H2v6h4l5 4V5z" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
            )}
          </button>
        </div>

        <p className="hero-tagline">
          Building tools that think carefully about your code.
        </p>

        <button
          className="scroll-indicator"
          onClick={() => scrollToSection('research')}
          aria-label="Scroll down"
        >
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
            <line x1="8" y1="0" x2="8" y2="20" stroke="#95A5A6" strokeWidth="1" />
            <polyline points="4,16 8,22 12,16" stroke="#95A5A6" strokeWidth="1" fill="none" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;
