import React from 'react';
import './Research.css';

const Research = () => {
  return (
    <section id="research" className="research">
      <div className="container">
        <h2 className="section-label">Research</h2>

        <div className="research-entry">
          <h3 className="research-title">Senior Capstone Research</h3>
          <p className="research-meta">Michigan State University, College of Engineering &middot; Advisor: Dr. Sijia Liu &middot; Jan 2026 &ndash; Present</p>
          <ul className="research-details">
            <li>Developing novel mathematical framework for exact mechanistic interpretation of game-playing neural networks, circumventing the approximation and polysemanticity limitations of existing interpretability approaches.</li>
            <li>Derived and empirically validated theoretical results connecting deep ReLU network geometry to exact algebraic structures; manuscript in preparation.</li>
          </ul>
        </div>

        <div className="research-entry">
          <h3 className="research-title">Student ML Researcher</h3>
          <p className="research-meta">The Cronin Lab, University of Glasgow &middot; Remote &middot; Dec 2025 &ndash; Jan 2026</p>
          <ul className="research-details">
            <li>Studied internal representations of the Leela Zero Go engine using Matryoshka Sparse Autoencoders, topological data analysis (persistent homology), bifurcation detection, and attractor basin analysis.</li>
            <li>Identified fundamental limits of post-hoc approximation methods for deriving atomic units of game-state representation from neural networks, motivating development of exact algebraic approaches.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Research;
