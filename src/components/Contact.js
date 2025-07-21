import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2>Get In Touch</h2>
        <p>If you'd like to talk about a project or just say hello, feel free to drop me a line.</p>
        <div className="contact-links">
          <a href="mailto:himanshujanmeda007@gmail.com" className="btn">Email Me</a>
          <a href="https://www.linkedin.com/in/himanshu-janmeda-45259929b/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">LinkedIn</a>
          <a href="https://github.com/burning-phoenix/" target="_blank" rel="noopener noreferrer" className="btn">GitHub</a>
        </div>

      </div>
    </section>
  );
};

export default Contact;
