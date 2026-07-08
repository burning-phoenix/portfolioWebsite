import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CaseStudy.css';

export const CsSection = ({ label, children }) => (
  <section className="cs-section">
    <h2 className="cs-heading">{label}</h2>
    {children}
  </section>
);

const CaseStudyLayout = ({ title, subtitle, meta, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <article className="case-study-page">
      <div className="container">
        <nav className="cs-back">
          <Link to="/">&larr; Himanshu Janmeda</Link>
        </nav>

        <header className="cs-header">
          <p className="section-label">Case Study</p>
          <h1 className="cs-title">{title}</h1>
          <p className="cs-subtitle">{subtitle}</p>
          {meta && <p className="cs-meta">{meta}</p>}
        </header>

        {children}

        <footer className="cs-footer">
          <p>
            If this looks like your problem,{' '}
            <a href="mailto:janmedahs@gmail.com">write to me</a>.
          </p>
          <p className="cs-footer-back">
            <Link to="/">&larr; Back to the main page</Link>
          </p>
        </footer>
      </div>
    </article>
  );
};

export default CaseStudyLayout;
