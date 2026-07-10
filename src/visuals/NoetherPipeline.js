import React from 'react';
import { createTimeline, createDrawable, stagger, utils } from 'animejs';
import { useVisualTimeline, Replay, SLATE, ASH, RUST, MINT, CORAL, PAPER, SANS, MONO } from './shared';
import './visuals.css';

const STAGES = ['VALIDATE', 'PREPARE', 'APPROVE', 'EXECUTE', 'UNDO RECORD', 'CONTEXT UPDATE'];
const BOX_W = 128;
const BOX_H = 52;
const BOX_GAP = 28;
const X0 = 26;
const BOX_Y = 64;
const MID_Y = BOX_Y + BOX_H / 2;
const CENTERS = STAGES.map((_, i) => X0 + BOX_W / 2 + i * (BOX_W + BOX_GAP));

function buildPipeline(root, { autoplay, reduced }) {
  const countEl = root.querySelector('#np-audit-count');
  const check = createDrawable('#np-check');
  utils.set(check, { draw: '0 0' });

  const tl = createTimeline({
    defaults: { duration: 400, ease: 'outQuad' },
    autoplay
  });

  // the check fades out at the end of a run; restore it for replays
  tl.set('#np-check', { opacity: 1 }, 0);

  // the diagram assembles
  tl.add('.np-stage', { opacity: [0, 1], translateY: [8, 0], delay: stagger(70), duration: 350 })
    .add('.np-conn', { opacity: [0, 1], duration: 250 }, '<+=150')
    .add('.np-audit-head', { opacity: [0, 1], duration: 250 }, '<');

  // a stage flashes as the token passes: two plain tweens, no keyframes
  const visit = (i, color) =>
    tl.add(`#np-box-${i}`, { stroke: color, duration: 140, ease: 'outQuad' }, '<+=160')
      .add(`#np-box-${i}`, { stroke: SLATE, duration: 300 });

  // run 1: a file write passes every stage
  tl.add('#np-token1', { opacity: [0, 1], duration: 200 }, '+=250');
  tl.add('#np-token1', { translateX: [-80, CENTERS[0]], duration: 340, ease: 'inOutQuad' });
  visit(0, RUST);
  tl.add('#np-token1', { translateX: CENTERS[1], duration: 340, ease: 'inOutQuad' }, '+=60');
  visit(1, RUST);
  tl.add('#np-token1', { translateX: CENTERS[2], duration: 340, ease: 'inOutQuad' }, '+=60');
  visit(2, RUST);

  // the human beat: nothing moves until approval lands
  tl.add(check, { draw: '0 1', duration: 320, ease: 'inOutQuad' }, '+=260')
    .add('#np-approved', { opacity: [0, 1], duration: 220 }, '<+=100');

  // approval consumed: the sign vanishes the moment the token moves on
  tl.add('#np-token1', { translateX: CENTERS[3], duration: 340, ease: 'inOutQuad' }, '+=420')
    .add('#np-check', { opacity: [1, 0], duration: 160 }, '<')
    .add('#np-approved', { opacity: [1, 0], duration: 160 }, '<');
  visit(3, RUST);
  tl.add('#np-token1', { translateX: CENTERS[4], duration: 340, ease: 'inOutQuad' }, '+=60');
  visit(4, RUST);
  tl.add('#np-token1', { translateX: CENTERS[5], duration: 340, ease: 'inOutQuad' }, '+=60');
  visit(5, RUST);

  // exit right, and the audit log records it
  tl.add('#np-token1', { translateX: 1040, opacity: [1, 0], duration: 420, ease: 'inQuad' }, '+=120')
    .add('#np-log-1', { opacity: [0, 1], translateY: [4, 0], duration: 280 }, '-=200')
    .call(() => { countEl.textContent = 'audit.jsonl — 1 operation'; }, '<+=100');

  // run 2: a dangerous command dies at VALIDATE — and is still audited
  tl.add('#np-token2', { opacity: [0, 1], duration: 200 }, '+=450');
  tl.add('#np-token2', { translateX: [-80, CENTERS[0]], duration: 340, ease: 'inOutQuad' });
  visit(0, CORAL);
  tl.add('#np-token2', { translateX: CENTERS[0] - 64, opacity: [1, 0], duration: 380 }, '-=160')
    .add('#np-log-2', { opacity: [0, 1], translateY: [4, 0], duration: 280 }, '-=120')
    .call(() => { countEl.textContent = 'audit.jsonl — 2 operations'; });

  if (reduced) tl.complete();
  return tl;
}

const NoetherPipeline = () => {
  const { rootRef, showReplay, replay } = useVisualTimeline(buildPipeline);

  return (
    <figure className="case-visual case-visual--wide" ref={rootRef}>
      <svg viewBox="0 0 960 250" role="img"
        aria-label="Diagram: every operation passes through six pipeline stages — validate, prepare, approve, execute, undo record, context update. A file write pauses for human approval and completes; a dangerous command is rejected at validation. Both are recorded in the audit log.">
        {/* approval mark, above the APPROVE stage */}
        <path id="np-check" d="M388 34 l9 10 l18 -20" fill="none" stroke={MINT} strokeWidth="2" />
        <text id="np-approved" x={CENTERS[2] + 32} y="34" fontFamily={SANS} fontSize="11"
          fill={MINT} opacity="0">approved</text>

        {/* six stages */}
        {STAGES.map((label, i) => (
          <g key={label} className="np-stage" opacity="0">
            <rect id={`np-box-${i}`} x={X0 + i * (BOX_W + BOX_GAP)} y={BOX_Y}
              width={BOX_W} height={BOX_H} rx="2" fill={PAPER} stroke={ASH} strokeWidth="1.25" />
            <text x={CENTERS[i]} y={MID_Y + 4} textAnchor="middle"
              fontFamily={SANS} fontSize="11" letterSpacing="0.8" fill={SLATE}>{label}</text>
          </g>
        ))}

        {/* connectors */}
        {STAGES.slice(0, -1).map((_, i) => (
          <line key={i} className="np-conn" opacity="0"
            x1={X0 + BOX_W + i * (BOX_W + BOX_GAP)} y1={MID_Y}
            x2={X0 + BOX_W + BOX_GAP + i * (BOX_W + BOX_GAP)} y2={MID_Y}
            stroke={ASH} strokeWidth="1.25" />
        ))}

        {/* the two operations */}
        <g id="np-token1" opacity="0" style={{ transform: 'translateX(-80px)' }}>
          <rect x="-58" y={MID_Y - 13} width="116" height="26" rx="3" fill={PAPER} stroke={SLATE} strokeWidth="1.25" />
          <text x="0" y={MID_Y + 4} textAnchor="middle" fontFamily={MONO} fontSize="12" fill={SLATE}>write file</text>
        </g>
        <g id="np-token2" opacity="0" style={{ transform: 'translateX(-80px)' }}>
          <rect x="-58" y={MID_Y - 13} width="116" height="26" rx="3" fill={PAPER} stroke={CORAL} strokeWidth="1.25" />
          <text x="0" y={MID_Y + 4} textAnchor="middle" fontFamily={MONO} fontSize="12" fill={CORAL}>rm -rf .</text>
        </g>

        {/* audit log */}
        <text id="np-audit-count" className="np-audit-head" x={X0} y="178"
          fontFamily={MONO} fontSize="12" fill={ASH} opacity="0">audit.jsonl — 0 operations</text>
        <text id="np-log-1" x={X0} y="204" fontFamily={MONO} fontSize="12" fill={SLATE} opacity="0">
          <tspan fill={MINT}>✓</tspan> write_file — approved
        </text>
        <text id="np-log-2" x={X0} y="228" fontFamily={MONO} fontSize="12" fill={SLATE} opacity="0">
          <tspan fill={CORAL}>✕</tspan> bash: rm -rf . — rejected at VALIDATE
        </text>
      </svg>
      <figcaption>
        One pipeline, every operation: a write waits for human approval before executing; a
        dangerous command dies at validation. Both land in the audit log.
      </figcaption>
      <Replay show={showReplay} onReplay={replay} />
    </figure>
  );
};

export default NoetherPipeline;
