import React from 'react';
import './visuals.css';

/* "nesting vs. filtering" — a still diagram, on purpose.
   Panel one: why context grows by default — recursion drawn literally,
   each turn's box containing the previous turn's box plus new raw material.
   Panel two: Noether's Planner has the same problem — its boxes grow too —
   but at a fraction of the rate, because the Explorer and Coder absorb the
   raw bulk in throwaway contexts and pass up only distilled reports.
   Grounded in the source: planner memory keeps a sliding window with
   truncated events (planner_memory.py); coder briefs are capped at 4,096
   estimated tokens and rejected back to the Planner when bigger
   (orchestrator.py). Drawn in the Noether daylight palette. */

import { SLATE, ASH, PINE, CORAL, SANS, MONO } from './shared';

// the Planner grows too — recursively, like everything else — just slowly.
// `marks` = the widths of every earlier turn, drawn as stacked shading inside
// the new box: each layer adds a shade, so older context reads darker, and
// the unshaded sliver IS the turn's growth.
const PLANNERS = [
  { x: 110, w: 150, turn: 1, adds: 'the request', marks: [] },
  { x: 290, w: 215, turn: 2, adds: "turn 1 + reply + explorer's report", marks: [150] },
  { x: 535, w: 240, turn: 3, adds: 'turn 2 + task marked complete', marks: [215, 150] }
];

const ContextDivision = () => (
  <figure className="case-visual case-visual--wide">
    <svg viewBox="0 0 960 640" role="img"
      aria-label="Two-panel diagram. Panel one, a single agent: three nested boxes labeled turn one, turn two, turn three — each turn's context contains the previous turn's entire context plus new code, diffs, and output, so the context grows recursively. Panel two, Noether: the Planner's context boxes also grow turn over turn, but only slightly — each turn adds a distilled report rather than raw code — because below, the Explorer greps and reads focused slices of code in a throwaway context and returns a short report with red flags, and the Coder runs one brief capped at 4,096 tokens, rejected back to the Planner if bigger. The bulk is read at the edges and discarded there.">

      {/* ——— panel one: the default, recursion ——— */}
      <text x="40" y="24" fontFamily={SANS} fontSize="11" fontWeight="600" letterSpacing="1.5"
        fill={ASH}>ONE AGENT — EVERY NEW TURN CARRIES EVERY TURN BEFORE IT</text>

      <rect x="40" y="44" width="880" height="240" rx="2" fill="none" stroke={SLATE} strokeWidth="1.25" />
      <text x="52" y="66" fontFamily={MONO} fontSize="10" letterSpacing="1" fill={ASH}>TURN 3</text>
      <text x="630" y="122" fontFamily={SANS} fontSize="11.5" fill={SLATE}>everything in turn 2, again</text>
      <text x="630" y="144" fontFamily={SANS} fontSize="11.5" fill={SLATE}>+ 800 more lines, diffs,</text>
      <text x="630" y="166" fontFamily={SANS} fontSize="11.5" fill={SLATE}>+ tool output</text>

      <rect x="60" y="80" width="540" height="180" rx="2" fill="none" stroke={SLATE} strokeWidth="1.25" />
      <text x="72" y="102" fontFamily={MONO} fontSize="10" letterSpacing="1" fill={ASH}>TURN 2</text>
      <text x="340" y="150" fontFamily={SANS} fontSize="11.5" fill={SLATE}>everything in turn 1, again</text>
      <text x="340" y="172" fontFamily={SANS} fontSize="11.5" fill={SLATE}>+ 400 lines of code it read</text>
      <text x="340" y="194" fontFamily={SANS} fontSize="11.5" fill={SLATE}>+ its own answer</text>

      <rect className="cd-wash" x="80" y="120" width="240" height="110" rx="2" stroke={SLATE} strokeWidth="1.25" />
      <text x="92" y="142" fontFamily={MONO} fontSize="10" letterSpacing="1" fill={ASH}>TURN 1</text>
      <text x="200" y="185" textAnchor="middle" fontFamily={MONO} fontSize="12" fill={SLATE}>your request</text>

      <text x="40" y="314" fontFamily={SANS} fontSize="11" fill={ASH}>
        …and turn 4 will carry all of this, again.
      </text>

      {/* ——— panel two: the same growth, at a fraction of the rate ——— */}
      <text x="40" y="360" fontFamily={SANS} fontSize="11" fontWeight="600" letterSpacing="1.5"
        fill={ASH}>NOETHER — THE SAME GROWTH, AT A FRACTION OF THE RATE</text>

      {PLANNERS.map(({ x, w, turn, adds, marks }) => (
        <g key={turn}>
          {marks.map((m) => (
            <React.Fragment key={m}>
              <rect x={x} y="376" width={m} height="60" rx="2" fill={PINE} opacity="0.08" />
              <line x1={x + m} y1="376" x2={x + m} y2="436"
                stroke={ASH} strokeWidth="0.75" strokeDasharray="3 3" />
            </React.Fragment>
          ))}
          <rect x={x} y="376" width={w} height="60" rx="2" fill="none" stroke={PINE} strokeWidth="1.25" />
          <text x={x + w / 2} y="400" textAnchor="middle" fontFamily={SANS} fontSize="10"
            fontWeight="600" letterSpacing="1" fill={PINE}>{`PLANNER · TURN ${turn}`}</text>
          <text x={x + w / 2} y="420" textAnchor="middle" fontFamily={SANS} fontSize="10.5"
            fill={ASH}>{adds}</text>
        </g>
      ))}
      <text x="795" y="392" fontFamily={SANS} fontSize="11" fill={ASH}>grows by reports,</text>
      <text x="795" y="408" fontFamily={SANS} fontSize="11" fill={ASH}>not by codebases</text>
      <text x="795" y="428" fontFamily={SANS} fontSize="10" fill={ASH}>shaded = carried over</text>

      {/* the eyes: reports flow up to the Planner, whenever a turn asks */}
      <line x1="250" y1="466" x2="250" y2="444" stroke={PINE} strokeWidth="1.25" />
      <polygon points="245,446 255,446 250,438" fill={PINE} />
      <text x="262" y="458" fontFamily={SANS} fontSize="10.5">
        <tspan fill={PINE}>a short report: what, where</tspan>
        <tspan fill={CORAL}> + ⚠ red flags</tspan>
      </text>
      <rect className="cd-wash" x="60" y="470" width="360" height="140" rx="2" stroke={ASH} strokeWidth="1" />
      <text x="76" y="496" fontFamily={SANS} fontSize="11.5" fontWeight="600" fill={SLATE}>
        EXPLORER — the eyes
      </text>
      <text x="76" y="526" fontFamily={MONO} fontSize="13" fill={SLATE}>greps, skims, reads slices</text>
      <text x="76" y="548" fontFamily={SANS} fontSize="10.5" fill={ASH}>in a context of its own,</text>
      <text x="76" y="566" fontFamily={SANS} fontSize="10.5" fill={ASH}>thrown away when done</text>

      {/* the hands: briefs flow down from the Planner */}
      <line x1="615" y1="440" x2="615" y2="462" stroke={PINE} strokeWidth="1.25" />
      <polygon points="610,460 620,460 615,468" fill={PINE} />
      <text x="627" y="458" fontFamily={SANS} fontSize="10.5" fill={PINE}>an edit brief, one task at a time</text>
      <rect className="cd-wash" x="540" y="470" width="360" height="140" rx="2" stroke={ASH} strokeWidth="1" />
      <text x="556" y="496" fontFamily={SANS} fontSize="11.5" fontWeight="600" fill={SLATE}>
        CODER — the hands
      </text>
      <text x="556" y="526" fontFamily={MONO} fontSize="13" fill={SLATE}>one brief ≤ 4,096 tokens</text>
      <text x="556" y="548" fontFamily={SANS} fontSize="10.5" fill={ASH}>bigger than that? rejected back</text>
      <text x="556" y="566" fontFamily={SANS} fontSize="10.5" fill={ASH}>to the Planner, to cut finer</text>
    </svg>
  </figure>
);

export default ContextDivision;
