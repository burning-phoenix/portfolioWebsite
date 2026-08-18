import React from 'react';
import { Link } from 'react-router-dom';
import './Projects.css';

const Projects = () => {
  const projects = [
    {
      title: 'code-rag',
      description: 'An open-source RAG system for LLM coding agents that provides semantic search over any codebase: embeddings indexed in a per-project vector database in Qdrant, structure-aware chunking across 11 languages, LLM-generated summaries to enrich retrieval, and exact symbol lookup. Also includes an LLM evaluation suite made of 100 hand-labeled queries and agent-centric metrics (did the answer arrive, how much junk with it, in one piece?).',
      technologies: ['Python', 'MCP', 'Qdrant', 'tree-sitter'],
      link: 'https://github.com/burning-phoenix/code-rag',
      date: 'May 2026'
    },
    {
      title: 'Noether',
      description: 'An open-source, multi-agent Plan-and-Execute system orchestrating three LLMs with separate roles: a large-context planner that decomposes work into self-contained tasks, a coder that runs them on cheap API or local models, and a stateless explorer that reports on the codebase. All tool calls go through a singular, validated, logged pipeline that supports approval modals, sandboxing and native undo. Integrated local RAG for semantic codebase retrieval on low-RAM machines.',
      technologies: ['Python', 'Textual', 'Qdrant', 'LLM Orchestration'],
      link: 'https://github.com/burning-phoenix/Noether',
      caseStudy: '/case-studies/noether',
      date: 'Feb 2026'
    },
    {
      title: 'IQtrader',
      subtitle: 'Best AI/ML Hack — GrizzHacks 2025',
      description: 'Multi-resolution deep learning model for 8-hour stock forecasting combining CNNs, BiLSTMs, and transformer-style attention. Achieved 72% directional accuracy, 55% correlation, and 0.2874 MSE.',
      disclaimer: 'Built in a day at a hackathon. It won, but the code quality reflects the timeline. Better to be treated as prototype work rather than production.',
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
      title: 'DocDer',
      subtitle: 'Best General Hack at HackCancerSolutions',
      description: 'Flutter app using TensorFlow for mole malignancy detection through image analysis. Individually developed — learned Flutter and built the app from scratch, combining mobile development with machine learning integration.',
      technologies: ['Flutter', 'TensorFlow', 'Machine Learning'],
      link: 'https://devpost.com/software/docder',
      date: 'Oct 2020'
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
        <p className="projects-intro">Here are my publicly available projects.</p>

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
            {project.disclaimer && (
              <p className="project-disclaimer">{project.disclaimer}</p>
            )}
            {project.caseStudy && (
              <p className="project-case-study">
                <Link to={project.caseStudy}>Read the case study &rarr;</Link>
              </p>
            )}
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
