import React from 'react';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact">
      <div className="container">
        <h2 className="section-label">Contact</h2>
        <p className="contact-text">
          Open to research collaborations, engineering roles, and interesting conversations.
        </p>
        <p className="contact-links">
          <a href="mailto:himanshujanmeda007@gmail.com">himanshujanmeda007@gmail.com</a>
          <span className="contact-separator">&middot;</span>
          <a href="https://www.linkedin.com/in/himanshu-janmeda-45259929b/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <span className="contact-separator">&middot;</span>
          <a href="https://github.com/burning-phoenix/" target="_blank" rel="noopener noreferrer">GitHub</a>
          <span className="contact-separator">&middot;</span>
          <a href="https://substack.com/@monkeyspaw" target="_blank" rel="noopener noreferrer">Substack</a>
        </p>
      </div>
    </section>
  );
};

export default Contact;
