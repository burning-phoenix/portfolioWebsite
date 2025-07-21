import React from 'react';
import './Projects.css'; // reuse existing card/grid styles

const OngoingProjects = () => {
  const ongoing = [
    {
      title: 'Project Alpha (ECT)',
      description: 'Deep analysis of BRENDA for enzyme complexity prediction.',
      github: '#'
    },
    {
      title: 'Project Beta (GATv2)',
      description: 'Graph Attention Network for chess.',
      github: 'https://github.com/burning-phoenix/GATv2'
    }
  ];

  return (
    <section id="ongoing" className="projects">
      <div className="container">
        <h2>Ongoing Projects</h2>
        <p className="projects-intro">A glimpse at what I’m building right now.</p>
        <div className="projects-grid">
          {ongoing.map((proj, idx) => (
            <div className="project-card" key={idx}>
              <div className="project-content">
                <h3>{proj.title}</h3>
                <p>{proj.description}</p>
                <div className="project-links">
                  <a href={proj.github} className="btn" target="_blank" rel="noopener noreferrer">View Code</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OngoingProjects;
