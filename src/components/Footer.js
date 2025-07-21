import React from 'react';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="container">
        <p>&copy; {year} Himanshu S Janmeda. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
