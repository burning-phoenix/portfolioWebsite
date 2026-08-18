import React from 'react';
import './Skills.css';

const Skills = () => {
  const categories = [
    {
      name: 'Languages',
      items: 'Python, C++, SQL, TypeScript, Go, Java'
    },
    {
      name: 'LLM systems',
      items: 'LLM loops (Plan-and-Execute), vLLM, RAG, JAX, MCP, evaluation, LangGraph, multi-agent orchestration and observability, vector databases, prompt engineering'
    },
    {
      name: 'ML',
      items: 'PyTorch, deep learning, mechanistic interpretability, CUDA, SAEs, QLoRA'
    },
    {
      name: 'Infra/Web',
      items: 'AWS, Azure, Docker, Make, CAN, CI/CD, Git'
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
