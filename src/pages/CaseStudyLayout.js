import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { animate, utils } from 'animejs';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import './CaseStudy.css';

export const CsSection = ({ label, children }) => (
  <section className="cs-section">
    <h2 className="cs-heading">{label}</h2>
    {children}
  </section>
);

/* Inline math, KaTeX-rendered. Inherits the page color, so it follows both
   the daylight and midnight palettes. */
export const TeX = ({ children }) => (
  <span
    dangerouslySetInnerHTML={{
      __html: katex.renderToString(children, { throwOnError: false }),
    }}
  />
);

/* Visible placeholder for a planned animation: names the visual and states
   why motion earns its place there. Replaced by the real visual once approved. */
export const AnimSlot = ({ name, kind = 'animation', children }) => (
  <aside className="cs-anim-slot">
    <p className="cs-anim-slot-name">planned {kind} — {name}</p>
    <p className="cs-anim-slot-why">{children}</p>
  </aside>
);

/* The techify toggle. The fill span carries the destination theme's ground
   color; CSS flips its transform-origin per view, so the sweep rises
   bottom-up into midnight and falls top-down back into daylight.
   Hover previews the sweep; click completes whatever is left of it and
   commits — the view only switches once the fill fully covers the button. */
const ViewToggle = ({ view, onToggleView }) => {
  const btnRef = useRef(null);
  const fillRef = useRef(null);
  const busyRef = useRef(false);
  const settledRef = useRef(false); // just switched; ignore hover until the pointer leaves
  const restColorRef = useRef(null);

  const destLabelColor = view === 'plain' ? '#E6E4EF' : '#2C3E50';

  const handleEnter = () => {
    if (busyRef.current || settledRef.current) return;
    restColorRef.current = getComputedStyle(btnRef.current).color;
    animate(fillRef.current, { scaleY: 1, duration: 350, ease: 'outQuart' });
    animate(btnRef.current, { color: destLabelColor, duration: 300, ease: 'inOutQuad' });
  };

  const handleLeave = () => {
    settledRef.current = false;
    if (busyRef.current) return;
    animate(fillRef.current, { scaleY: 0, duration: 300, ease: 'outQuad' });
    if (restColorRef.current) {
      animate(btnRef.current, {
        color: restColorRef.current,
        duration: 260,
        ease: 'inOutQuad',
        onComplete: () => { btnRef.current.style.color = ''; }
      });
    }
  };

  const handleClick = () => {
    if (busyRef.current) return;
    busyRef.current = true;

    // finish the sweep from wherever hover left it
    const progress = parseFloat(utils.get(fillRef.current, 'scaleY')) || 0;
    animate(btnRef.current, { color: destLabelColor, duration: 240, ease: 'inOutQuad' });
    animate(fillRef.current, {
      scaleY: 1,
      duration: Math.max(120, 400 * (1 - progress)),
      ease: 'inOutQuart',
      onComplete: () => {
        onToggleView();
        btnRef.current.style.color = '';
        settledRef.current = true;
        animate(fillRef.current, {
          opacity: [1, 0],
          duration: 260,
          delay: 80,
          ease: 'outQuad',
          onComplete: () => {
            utils.set(fillRef.current, { scaleY: 0, opacity: 1 });
            busyRef.current = false;
          }
        });
      }
    });
  };

  return (
    <button
      ref={btnRef}
      className="cs-view-toggle"
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <span ref={fillRef} className="cs-view-toggle-fill" aria-hidden="true" />
      <span className="cs-view-toggle-label">
        {view === 'plain' ? '[ techify ]' : '[ de-techify ]'}
      </span>
    </button>
  );
};

const CaseStudyLayout = ({ title, subtitle, meta, theme, view, onToggleView, children }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const themeClass = theme ? ` cs-theme-${theme}` : '';
  const darkClass = view === 'tech' ? ' cs-dark' : '';

  return (
    <article className={`case-study-page${themeClass}${darkClass}`}>
      <div className="container">
        <nav className="cs-back">
          <Link to="/">&larr; Himanshu Janmeda</Link>
        </nav>

        <header className="cs-header">
          <p className="section-label">Case Study</p>
          <h1 className="cs-title">{title}</h1>
          <p className="cs-subtitle">{subtitle}</p>
          {meta && <p className="cs-meta">{meta}</p>}
          {onToggleView && <ViewToggle view={view} onToggleView={onToggleView} />}
        </header>

        {children}

        <footer className="cs-footer">
          <p>
            If this looks like your problem,{' '}
            <a href="mailto:janmedahs@gmail.com">write to me</a>.
          </p>
          <p className="cs-footer-back">
            <Link to="/">&larr; Back to the main page</Link>
          </p>
        </footer>
      </div>
    </article>
  );
};

export default CaseStudyLayout;
