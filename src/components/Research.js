import React from 'react';
import './Research.css';

const Research = () => {
  return (
    <section id="research" className="research">
      <div className="container">
        <h2 className="section-label">Research</h2>

        <div className="research-entry">
          <h3 className="research-title">Undergraduate Researcher (Capstone)</h3>
          <p className="research-meta">Michigan State University, advised by Dr. Sijia Liu &middot; Jan 2026 &ndash; May 2026</p>
          <ul className="research-details">
            <li>Developed TropCAM, a saliency method that maps which parts of an image drove an image classifier's prediction, computing exact, spatially-resolved Jacobians of ReLU networks instead of the lossy per-channel weighting of Grad-CAM-style methods, with provable guarantees: explanations constant within linear regions, zero attribution to regions the model cannot see.</li>
            <li>Outperformed 5+ baselines on all six localization metrics (50K-image ImageNet validation set) and ADCC faithfulness; 0% attribution leakage on the “CAM methods see through walls” benchmark vs. Grad-CAM's >50%.</li>
            <li>Extending the exact-Jacobian framework to CLIP's attention pooling, first-author manuscript in preparation.</li>
          </ul>
        </div>

        <div className="research-entry">
          <h3 className="research-title">ResNet-CL &mdash; Task Ordering &amp; Catastrophic Forgetting</h3>
          <p className="research-meta">Preprint &middot; Jan 2026 &ndash; May 2026</p>
          <ul className="research-details">
            <li>Co-authored a continual-learning study (CIFAR-100) showing that the order tasks are learned in, broad categories first vs. specific ones first, sets a model's retention&ndash;plasticity tradeoff, and that standard protections (EWC, L2) barely move it: each order trades old-task memory against new-task accuracy, no order wins both, and the effect reverses for a shallow model.</li>
            <li>Implemented the exact per-sample Fisher for EWC, checked against a closed-form solution, with 45 tests covering data splits, penalties, and metrics.</li>
          </ul>
          <p className="research-links">
            <a href="https://arxiv.org/abs/2606.08013" target="_blank" rel="noopener noreferrer">arXiv</a>
            <span className="research-separator">&middot;</span>
            <a href="https://github.com/burning-phoenix/ResNet-CL" target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
        </div>

        <div className="research-entry">
          <h3 className="research-title">Student ML Engineer</h3>
          <p className="research-meta">The Cronin Lab, University of Glasgow &middot; Dec 2025 &ndash; Jan 2026</p>
          <ul className="research-details">
            <li>Investigated whether Leela Zero's internal representations decompose into discrete, composable features, an open problem in mechanistic interpretability, and produced a rigorous negative result: decompositions fail under feature absorption, splitting, and polysemanticity, corroborating recent SAE findings.</li>
            <li>Built the full stack from scratch: data pipeline for activation extraction (~496K activations, 4,999 games), trained Matryoshka TopK SAE in PyTorch (256-dim → 4,096 features, 4 sparsity levels), LLM-based automated labeling, linear probes, causal ablations.</li>
            <li>Delivered a documented, unit-tested codebase for the lab to extend.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Research;
