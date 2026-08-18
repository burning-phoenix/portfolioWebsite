import React from 'react';
import { Link } from 'react-router-dom';
import './CaseStudies.css';

const CaseStudies = () => {
  const studies = [
    {
      slug: 'noether',
      title: 'Noether',
      tagline: 'A multi-agent coding-oriented harness with enforceable checks on LLMs',
      repo: 'https://github.com/burning-phoenix/noether'
    }
  ];

  return (
    <section id="case-studies" className="case-studies">
      <div className="container">
        <h2 className="section-label">Case Studies</h2>
        <p className="case-studies-intro">
          I take on freelance engineering work. Below is a case study to show how I
          approach a problem.
        </p>

        {studies.map((study) => (
          <div key={study.slug} className="case-study-entry">
            <h3 className="case-study-title">
              <Link to={`/case-studies/${study.slug}`}>{study.title}</Link>
            </h3>
            <p className="case-study-tagline">{study.tagline}</p>
            <p className="case-study-links">
              <Link to={`/case-studies/${study.slug}`}>Read the case study &rarr;</Link>
              {study.repo && (
                <>
                  <span className="case-study-separator">&middot;</span>
                  <a href={study.repo} target="_blank" rel="noopener noreferrer">GitHub</a>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CaseStudies;
