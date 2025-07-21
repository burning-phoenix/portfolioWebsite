import React from 'react';
import './About.css';
import profileImg from '../assets/profile.JPG';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2>About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm a Computer Engineering student at Michigan State University (class of 2026) passionate about AI/ML research with a focus on transparent, interpretable models. I believe AI has transformative potential in biomedical research and am dedicated to developing solutions that advance healthcare through responsible machine learning.
            </p>
            <p>
              My experience spans deep-learning research, data-driven backend systems, and intuitive React frontends. Over the past four years, I've shipped award-winning projects at national hackathons, scaled a non-profit educational initiative from 3 to 12 educators, and developed programming curricula that empowered hundreds of underprivileged kids to learn coding.
            </p>
            <p>
              I'm committed to building clean, maintainable code with user-first design principles. When I'm not researching or coding, you'll find me mentoring fellow hackers, experimenting with edge-AI on Raspberry Pi, or discovering the best coffee spots in East Lansing. I'm always eager to collaborate on ambitious projects that push the boundaries of what AI can achieve.
            </p>
            
            <div className="about-stats">
              <div className="stat">
                <h3>20+</h3>
                <p>Projects & Prototypes</p>
              </div>
              <div className="stat">
                <h3>4+</h3>
                <p>Years Building Software</p>
              </div>
              <div className="stat">
                <h3>5</h3>
                <p>Hackathon Awards</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <div className="image-container">
              <img src={profileImg} alt="Himanshu S Janmeda" className="profile-img" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
