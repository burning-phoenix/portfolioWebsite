import { useEffect, useRef, useState } from 'react';
import { createScope, onScroll } from 'animejs';

/* ——— palettes ———
   JS mirrors of the CSS variables in CaseStudy.css: SVG visuals need concrete
   values because anime's color tweens can't read CSS custom properties.
   If a color changes there, it changes here. */

// house daylight constants, shared by every study's plain-view visuals
export const SLATE = '#2C3E50';
export const ASH = '#95A5A6';
export const PAPER = '#FAFAF8';
export const PINE = '#2E5E47';
export const MINT = '#4E9A76';
export const RUST = '#CC5A49';
export const CORAL = '#D46F7A'; // the one danger color, day or night, any theme
export const WASH = '#EDF3EE';

// the Tokyo-midnight ground every theme's tech view sits on (.cs-dark)
const NIGHT_BASE = {
  bg: '#1D1B27',
  ink: '#E6E4EF',
  text: '#C6C3D4',
  muted: '#837E96',
  coral: CORAL
};

// per-study accents, day and night (mirrors .cs-theme-* / .cs-dark.cs-theme-*)
export const THEMES = {
  noether: {
    day: { ink: '#22312A', accent: '#4E9A76', deep: '#2E5E47', wash: '#EDF3EE' },
    night: { ...NIGHT_BASE, accent: '#5CB98E', accentBright: '#8ED8B5', wash: '#212B25' }
  },
  corroborate: {
    day: { ink: '#26313C', accent: '#3E6E9E', deep: '#2A4C6E', wash: '#ECF1F6' },
    night: { ...NIGHT_BASE, accent: '#6FA3D8', accentBright: '#9DC4E8', wash: '#20293A' }
  },
  codeRag: {
    day: { ink: '#2D283E', accent: '#4A9E9C', deep: '#574E7E', wash: '#F0EFF4' },
    night: { ...NIGHT_BASE, accent: '#56BDBA', accentBright: '#A99BE0', wash: '#262138' }
  }
};

// Noether's midnight — the palette its tech-view visuals draw from
export const NIGHT = THEMES.noether.night;

export const SANS = "'Inter', -apple-system, sans-serif";
export const MONO = "'SF Mono', Menlo, monospace";

/* Every animated visual shares one lifecycle: build a timeline inside a scope,
   autoplay it when scrolled into view, offer a replay, and settle on a still
   frame when the reader prefers reduced motion. This hook owns that lifecycle;
   each visual owns only its drawing and its timeline.

   `build(root, { autoplay, reduced })` must be a module-level function that
   returns the timeline. It decides its own reduced-motion still (usually
   `tl.complete()`, or a `seek` when the true final frame is a blackout). */
export function useVisualTimeline(build) {
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShowReplay(!reduced);

    const scope = createScope({ root: rootRef.current }).add(() => {
      const autoplay = reduced
        ? false
        : onScroll({ target: rootRef.current, enter: 'bottom 85%' });
      tlRef.current = build(rootRef.current, { autoplay, reduced });
    });
    return () => scope.revert();
  }, [build]);

  const replay = () => tlRef.current && tlRef.current.restart();
  return { rootRef, showReplay, replay };
}

export const Replay = ({ show, onReplay }) =>
  show ? (
    <button className="visual-replay" onClick={onReplay}>replay</button>
  ) : null;
