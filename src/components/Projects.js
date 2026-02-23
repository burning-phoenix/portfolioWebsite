import React from 'react';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'Noether',
      description: 'Terminal-based multi-agent AI code editor. Three-agent orchestration system (Planner/Coder/Explorer) with sandboxed execution, user approval workflows, and snapshot-based undo. Integrated local RAG for semantic codebase retrieval on 8GB M1 Macs.',
      technologies: ['Python', 'Textual', 'Qdrant', 'LLM Orchestration'],
      link: 'https://github.com/burning-phoenix/Noether',
      date: 'Feb 2026'
    },
    {
      title: 'IQtrader',
      subtitle: 'Best AI/ML Hack — GrizzHacks 2025',
      description: 'Multi-resolution deep learning model for 8-hour stock forecasting combining CNNs, BiLSTMs, and transformer-style attention. Achieved 72% directional accuracy, 55% correlation, and 0.2874 MSE.',
      technologies: ['Python', 'TensorFlow', 'Deep Learning'],
      link: 'https://github.com/burning-phoenix/IQtrader',
      date: 'March 2025'
    },
    {
      title: 'GoEmotions Multi-Label Classifier',
      description: 'Fast multi-label emotion classifier using DistilBERT + CNN on Google\'s GoEmotions dataset (27 labels). Achieved 45.7% F1 and 56.7% MCC — outperforming BERT-base baselines by +15% MCC with 40% fewer parameters.',
      technologies: ['Python', 'HuggingFace', 'NLP', 'PyTorch'],
      link: 'https://github.com/burning-phoenix/GoEmotions/blob/main/Classifier.ipynb',
      date: 'Feb 2025'
    },
    {
      title: 'Speed Reader',
      subtitle: 'Categorical Prize at InnoHacks',
      description: 'Web app that summarizes articles using NLTK and web scraping, with a Flask backend and Bootstrap frontend. Collaborated with a cross-functional team on the Python text processing pipeline.',
      technologies: ['Python', 'Flask', 'NLTK', 'Bootstrap'],
      link: 'https://devpost.com/software/speed-reader-v9ihzr',
      date: 'March 2021'
    },
    {
      title: 'Wassgood',
      subtitle: 'SyntHacks 1st Prize',
      description: 'App evaluating product safety via ingredient analysis using web scraping and NLP.',
      technologies: ['React', 'NLP', 'Web Scraping'],
      link: 'https://devpost.com/software/scanlator',
      date: 'Nov 2020'
    },
    {
      title: 'Environment Watch',
      subtitle: 'Make SPP 2020 Hackathon',
      description: 'Mobile platform that crowdsources data about populations of endangered animals. Users report wildlife sightings with photos and location, viewable on an interactive map with community-driven verification.',
      technologies: ['Kotlin', 'Firebase', 'TensorFlow', 'Google Maps API'],
      link: 'https://github.com/burning-phoenix/environment-watch',
      date: '2020'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-label">Projects</h2>

        {projects.map((project, index) => (
          <div key={index} className="project-entry">
            <h3 className="project-title">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                {project.title}
              </a>
              {project.subtitle && (
                <span className="project-subtitle"> &mdash; {project.subtitle}</span>
              )}
              <span className="project-date">{project.date}</span>
            </h3>
            <p className="project-description">{project.description}</p>
            <div className="project-tech">
              {project.technologies.map((tech, i) => (
                <span key={i} className="tech-tag">{tech}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Projects;
