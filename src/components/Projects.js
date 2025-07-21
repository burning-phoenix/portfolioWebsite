import React from 'react';
import './Projects.css';
import iqTraderImg from '../assets/IQTrader.png';
import goEmotionsImg from '../assets/GoEmotions.png';
import speedReaderImg from '../assets/SpeedReader.png';
import wassgoodImg from '../assets/WassGood.png';

const Projects = () => {
  const projects = [
    {
      title: 'IQtrader',
      description: 'Multi-resolution deep learning framework (CNN + BiLSTM + Attention) for 8-hour stock forecasting. Achieved 72% directional accuracy and won Best AI/ML Hack at GrizzHacks 2025.',
      technologies: ['Python', 'TensorFlow', 'Pandas', 'NumPy'],
      image: iqTraderImg,
      liveLink: 'https://devpost.com/software/iqtrader',
      githubLink: 'https://github.com/burning-phoenix/IQtrader'
    },
    {
      title: 'GoEmotions Classifier',
      description: 'Real-time, multi-label emotion detection using DistilBERT + CNN on Google\'s GoEmotions dataset. Outperformed baselines by +15% MCC with 40% fewer parameters.',
      technologies: ['Python', 'HuggingFace', 'PyTorch', 'NLP'],
      image: goEmotionsImg,
      liveLink: 'https://github.com/burning-phoenix/GoEmotions/blob/main/Classifier.ipynb',
      githubLink: 'https://github.com/burning-phoenix/GoEmotions'
    },
    {
      title: 'Speed Reader',
      description: 'Web app that summarises articles using NLTK and web scraping; recognised at InnoHacks 2021.',
      technologies: ['Flask', 'NLTK', 'Bootstrap', 'Python'],
      image: speedReaderImg,
      liveLink: 'https://devpost.com/software/speed-reader-v9ihzr',
      githubLink: 'https://devpost.com/software/speed-reader-v9ihzr'
    },
    {
      title: 'Wassgood',
      description: 'React & Firebase application analysing product ingredients for safety using scraping + NLP; 1st prize at SyntHacks 2020.',
      technologies: ['React', 'Firebase', 'NLP', 'JavaScript'],
      image: wassgoodImg,
      liveLink: 'https://devpost.com/software/scanlator',
      githubLink: 'https://devpost.com/software/scanlator'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        <p className="projects-intro">
          Here are some of my recent projects that showcase my skills and experience
        </p>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div key={index} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} className="project-img" />
              </div>
              
              <div className="project-content">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                
                <div className="project-technologies">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="tech-badge">{tech}</span>
                  ))}
                </div>
                
                <div className="project-links">
                  <a href={project.liveLink} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
                    Live Demo
                  </a>
                  <a href={project.githubLink} className="btn" target="_blank" rel="noopener noreferrer">
                    View Code
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
