import React from 'react';
import './Skills.css';

const Skills = () => {
  const categories = [
    {
      name: 'Languages',
      items: 'Python, C++, JavaScript, HTML, CSS'
    },
    {
      name: 'Frameworks & Tools',
      items: 'Git, Django, MySQL, PyTest'
    },
    {
      name: 'AI/ML',
      items: 'TensorFlow, Sparse Autoencoders, Interpretability Methods, Transformers, RL, Deep Learning'
    },
    {
      name: 'Cloud',
      items: 'AWS (S3, EC2, Lambda), Docker'
    }
  ];

  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-label">Skills</h2>

        <div className="skills-grid">
          {categories.map((cat, index) => (
            <div key={index} className="skill-category">
              <h3 className="skill-category-name">{cat.name}</h3>
              <p className="skill-items">{cat.items}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
