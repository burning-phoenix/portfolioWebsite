import React from 'react';
import './visuals.css';

/* "three workers, one door" — a still diagram, on purpose.
   The claim is topological: every request converges on a single node, the
   Gatekeeper, and there is no other route to the project. Geometry states
   that at a glance; motion would only re-prove it. Drawn in the Noether
   daylight palette (this sits in the plain view, which is always light). */

import { SLATE, ASH, PINE, SANS, MONO } from './shared';

const WORKERS = [
  { y: 30, name: 'PLANNER', sub: 'plans the work' },
  { y: 123, name: 'CODER', sub: 'writes the code' },
  { y: 216, name: 'EXPLORER', sub: 'gathers context' }
];

const FILES = ['.py', '.md', '.png'];

const OneDoor = () => (
  <figure className="case-visual case-visual--wide">
    <svg viewBox="0 0 960 300" role="img"
      aria-label="Diagram: three AI workers — a Planner that plans the work, a Coder that writes the code, and an Explorer that gathers context — each send their requests along paths that all converge on a single node labeled Gatekeeper. One path continues from the gatekeeper to the project's files. There is no other route.">

      {/* the three workers */}
      {WORKERS.map(({ y, name, sub }) => (
        <g key={name}>
          <rect x="40" y={y} width="190" height="54" rx="2" fill="none" stroke={SLATE} strokeWidth="1.25" />
          <text x="135" y={y + 24} textAnchor="middle" fontFamily={SANS} fontSize="13"
            fontWeight="600" letterSpacing="1" fill={SLATE}>{name}</text>
          <text x="135" y={y + 42} textAnchor="middle" fontFamily={SANS} fontSize="10.5"
            fill={ASH}>{sub}</text>
        </g>
      ))}

      {/* every request converges */}
      <path d="M230 57 C 360 57, 430 138, 528 147" fill="none" stroke={ASH} strokeWidth="1.25" />
      <path d="M230 150 H528" fill="none" stroke={ASH} strokeWidth="1.25" />
      <path d="M230 243 C 360 243, 430 162, 528 153" fill="none" stroke={ASH} strokeWidth="1.25" />
      <line x1="528" y1="150" x2="538" y2="150" stroke={ASH} strokeWidth="1.25" />
      <polygon points="538,145 546,150 538,155" fill={ASH} />

      {/* the gatekeeper: the one node every action must pass */}
      <circle cx="600" cy="150" r="52" fill="none" stroke={PINE} strokeWidth="2" />
      <text x="600" y="154" textAnchor="middle" fontFamily={SANS} fontSize="11.5"
        fontWeight="600" letterSpacing="1" fill={PINE}>GATEKEEPER</text>

      {/* through it, to the project */}
      <line x1="652" y1="150" x2="744" y2="150" stroke={PINE} strokeWidth="1.5" />
      <polygon points="744,145 752,150 744,155" fill={PINE} />
      {FILES.map((label, i) => (
        <g key={label}>
          <rect x="768" y={108 + i * 30} width="68" height="24" rx="3" fill="none"
            stroke={ASH} strokeWidth="1" />
          <text x="802" y={124 + i * 30} textAnchor="middle" fontFamily={MONO} fontSize="11"
            fill={SLATE}>{label}</text>
        </g>
      ))}
    </svg>
  </figure>
);

export default OneDoor;
