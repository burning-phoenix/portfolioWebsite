import React from 'react';
import './Skills.css';

const Skills = () => {
  const skills = [
    { name: 'Python', level: 90, icon: '🐍' },
    { name: 'C++', level: 80, icon: '💠' },
    { name: 'JavaScript', level: 85, icon: '🟨' },
    { name: 'React', level: 85, icon: '⚛️' },
    { name: 'Django', level: 75, icon: '🟢' },
    { name: 'TensorFlow', level: 70, icon: '🔶' },
    { name: 'AWS', level: 70, icon: '☁️' },
    { name: 'Docker', level: 65, icon: '🐳' },
    { name: 'Git', level: 85, icon: '📝' },
    { name: 'MySQL', level: 60, icon: '🗄️' },
    { name: 'HTML/CSS', level: 95, icon: '🎨' }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2>Skills & Technologies</h2>
        <p className="skills-intro">
          Here are some of the technologies I work with regularly
        </p>
        
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-card">
              <div className="skill-icon">{skill.icon}</div>
              <h3>{skill.name}</h3>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <span className="skill-percentage">{skill.level}%</span>
            </div>
          ))}
        </div>
        
        <div className="additional-skills">
          <h3>Other Technologies</h3>
          <div className="tech-tags">
            <span className="tech-tag">Redux</span>
            <span className="tech-tag">PyTest</span>
            <span className="tech-tag">NLP</span>
            <span className="tech-tag">Keras</span>
            <span className="tech-tag">Pandas</span>
            <span className="tech-tag">Neural Networks</span>
            <span className="tech-tag">Docker</span>
            <span className="tech-tag">AWS Lambda</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Skills;
