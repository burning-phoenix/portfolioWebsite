import React from 'react';
import { createTimeline, createDrawable, stagger, utils } from 'animejs';
import { useVisualTimeline, Replay, NIGHT, SANS, MONO } from './shared';
import './visuals.css';

/* "five layers, one assumption" — the containment stack drawn as trajectories.
   Six arcs shield the project; seven realistic probes fly at it, and each
   dies at the first wall whose job it is. One uniform grammar: a mint dot
   is a check actually run and passed; a ring a probe merely flies past
   (approval for the read-only loop, the bash rings for edit_file's different
   door) stays silent. A rejected card parks its nose at the wall that killed
   it, the wall takes a coral scar, and a log line lands on the left. The
   hanging find gets no verdict at all: it waits at the sandbox while a 30s
   timer drains. grep alone goes all the way in, and comes back with matches.

   Every death is verified against the source:
   - rm ∉ ReadOnlyShellCommand's Literal (schemas.py) — unsayable in the loop
   - push ∉ GIT_READONLY_SUBCOMMANDS (schemas.py)
   - '../' ∈ dangerous_patterns, killed by validate_args (schemas.py)
   - bash `cat .env` runs, but the SRT config's denyRead lists .env
     (setup_sandbox.py) — the sandbox refuses the read, not the file layer
   - timeout: int = 30 in SandboxCommandExecutor (command_executor.py)
   - edit_file(".env") is the chat path's file tool (tools.py); its schema
     checks it, the human approves it, and it STILL dies at
     FileSystemSandbox.BLOCKED_PATTERNS — the file layer assumes even the
     human will someday be wrong
   Tech view only, so drawn midnight-native. */

const CX = 800;
const CY = 330;

const RINGS = [
  { r: 315, abbr: 'SCH', desc: 'the schema: the loop can only say read-only commands' },
  { r: 270, abbr: 'GIT', desc: 'the git whitelist: only read-only subcommands pass' },
  { r: 225, abbr: 'VAL', desc: "the validators: block '../' traversal, pin cwd to the project" },
  { r: 180, abbr: 'HUM', desc: 'human approval: chat-mode operations wait for a click' },
  { r: 135, abbr: 'SBX', desc: 'the sandbox: isolated execution, secrets unreadable, killed at 30s' },
  { r: 90, abbr: 'FSG', desc: 'the file guard: file tools cannot touch secrets, .git is read-only' }
];

const CH = 6.6; // mono advance at fontSize 11
// where a horizontal lane at height `lane` crosses the ring of radius r
const xAt = (r, lane) => CX - Math.sqrt(r * r - (lane - CY) * (lane - CY));
// same crossing, at the card edge nearest the center line — the arcs are
// diagonal, so stopping at the centerline crossing clips the card's corner
const xAtEdge = (r, lane) => {
  const dy = Math.max(Math.abs(lane - CY) - 12, 0);
  return CX - Math.sqrt(r * r - dy * dy);
};

/* Each probe: which rings actively check it (mint dots), which wall kills it,
   and the log verdict, tagged with the killer's abbreviation. */
const PROBES = [
  { id: 'rm', cmd: 'rm -rf .', lane: 90, blinks: [], deathRing: 315,
    layer: 'SCH', verdict: "'rm' is not in the vocabulary" },
  { id: 'push', cmd: 'git push', lane: 160, blinks: [315], deathRing: 270,
    layer: 'GIT', verdict: "'push' is not a read-only subcommand" },
  { id: 'trav', cmd: 'cat ../notes.md', lane: 230, blinks: [315, 270], deathRing: 225,
    layer: 'VAL', verdict: "'../' is path traversal" },
  { id: 'env', cmd: 'cat .env', lane: 282, blinks: [315, 270, 225], deathRing: 135,
    layer: 'SBX', verdict: '.env is on the denyRead list' },
  { id: 'hang', cmd: 'find . -type f', lane: 448, blinks: [315, 270, 225], deathRing: 135,
    hangs: true, layer: 'SBX', verdict: 'no verdict by 30s — killed' },
  { id: 'edit', cmd: 'edit_file(".env")', lane: 378, blinks: [315, 180], dashed: true,
    deathRing: 90, layer: 'FSG', verdict: 'blocked pattern, even with approval' },
  { id: 'grep', cmd: 'grep -rn "TODO" src/', lane: 330, blinks: [315, 225, 135],
    toCenter: true }
].map((p) => ({
  ...p,
  w: p.cmd.length * CH + 18,
  blinkXs: p.blinks.map((r) => xAt(r, p.lane)),
  deathX: p.deathRing ? xAtEdge(p.deathRing, p.lane) - 4 : undefined
}));

// a short coral scar on the ring that made the kill, centered on the impact
const scarPath = (p) => {
  const phi = Math.atan2(p.lane - CY, p.deathX - CX);
  const [a, b] = [phi - 0.14, phi + 0.14];
  const pt = (ang) => `${CX + p.deathRing * Math.cos(ang)} ${CY + p.deathRing * Math.sin(ang)}`;
  return `M ${pt(a)} A ${p.deathRing} ${p.deathRing} 0 0 1 ${pt(b)}`;
};

const travel = (dist) => Math.max(280, Math.round(dist * 1.1));

function buildLayers(root, { autoplay, reduced }) {
  const arcs = createDrawable('.fl-ring');
  utils.set(arcs, { draw: '0 0' });

  const tl = createTimeline({
    defaults: { duration: 320, ease: 'outQuad' },
    autoplay
  });

  // the shield assembles, outside in
  tl.add(arcs, { draw: ['0 0', '0 1'], duration: 550, delay: stagger(80), ease: 'inOutQuad' })
    .add('.fl-chrome', { opacity: [0, 1], duration: 320 }, '-=250');

  const die = (p) => {
    tl.add(`#fl-scar-${p.id}`, { opacity: [0, 1], duration: 120 }, '-=40')
      .add(`#fl-scar-${p.id}`, { opacity: [1, 0.55], duration: 350 })
      .add(`#fl-rect-${p.id}`, { stroke: [NIGHT.ink, NIGHT.coral], duration: 220 }, '<-=250')
      .add(`#fl-reason-${p.id}`, { opacity: [0, 1], translateX: [-6, 0], duration: 260 }, '<');
  };

  PROBES.forEach((p) => {
    const card = `#fl-card-${p.id}`;
    const startNose = 40 + p.w;
    let from = startNose;

    tl.add(card, { opacity: [0, 1], duration: 160 }, '+=250');

    // fly inward, pausing a beat at every ring that actually checks
    p.blinkXs.forEach((bx, j) => {
      tl.add(card, { translateX: [from, bx], duration: travel(bx - from), ease: 'inOutSine' }, '+=40');
      tl.add(`#fl-blink-${p.id}-${j}`, { opacity: [0, 1], duration: 90 }, '-=50')
        .add(`#fl-blink-${p.id}-${j}`, { opacity: [1, 0.35], duration: 240 });
      from = bx;
    });

    if (p.toCenter) {
      // clean pass: touch the project, come back with the answer
      const nose = CX - 66;
      tl.add(card, { translateX: [from, nose], duration: travel(nose - from), ease: 'inOutSine' }, '+=40');
      tl.add('#fl-pulse', { opacity: [0, 0.5], duration: 200 }, '-=60')
        .add('#fl-pulse', { opacity: [0.5, 0], duration: 400 });
      tl.add(card, { translateX: [nose, startNose], duration: 750, ease: 'outQuad' }, '+=150')
        .add('#fl-result', { opacity: [0, 1], duration: 260 }, '-=100');
      return;
    }

    tl.add(card, { translateX: [from, p.deathX], duration: travel(p.deathX - from), ease: 'inOutSine' }, '+=40');

    if (p.hangs) {
      // no wall answers — the sandbox just holds it while the clock drains
      tl.add('#fl-timer-bg', { opacity: [0, 1], duration: 180 }, '-=80')
        .add('#fl-timer', { opacity: [0, 1], duration: 180 }, '<');
      tl.add('#fl-timer', { width: [46, 0], duration: 1450, ease: 'linear' }, '+=60')
        .add(card, { opacity: [1, 0.65], duration: 240, loop: 5, alternate: true }, '<');
    }
    die(p);
  });

  if (reduced) tl.complete();
  return tl;
}

const FiveLayers = () => {
  const { rootRef, showReplay, replay } = useVisualTimeline(buildLayers);
  const grep = PROBES.find((p) => p.id === 'grep');
  const hang = PROBES.find((p) => p.id === 'hang');

  return (
    <figure className="case-visual case-visual--wide case-visual--night" ref={rootRef}>
      <svg viewBox="0 0 960 650" role="img"
        aria-label="Six concentric arcs shield the project files: schema, git whitelist, argument validators, human approval, sandbox runtime with a 30-second cap, and the filesystem guard. Seven realistic probes fly at the shield. rm -rf . dies instantly at the schema — not a word the loop can say. git push passes the schema and dies at the subcommand whitelist. cat ../notes.md dies at the path-traversal validator. cat .env passes three checks and dies at the sandbox — .env is on its denyRead list. find . -type f gets no verdict and is killed at the sandbox's 30-second timeout. edit_file of .env takes a different door, passes its schema and human approval, and is still refused by the independent file layer. grep passes cleanly through to the project and returns with 18 matches.">

        {/* the shield */}
        {RINGS.map(({ r }) => (
          <path key={r} className="fl-ring"
            d={`M ${CX} ${CY - r} A ${r} ${r} 0 0 0 ${CX} ${CY + r}`}
            fill="none" stroke={NIGHT.muted} strokeWidth="1.25" />
        ))}
        {RINGS.map(({ r, abbr }) => (
          <text key={abbr} className="fl-chrome" opacity="0" x={CX + 10} y={CY - r + 4}
            fontFamily={MONO} fontSize="9.5" letterSpacing="1" fill={NIGHT.muted}>{abbr}</text>
        ))}

        {/* the thing being shielded */}
        <g className="fl-chrome" opacity="0">
          <circle cx={CX} cy={CY} r="58" fill={NIGHT.wash} stroke={NIGHT.accent} strokeWidth="1.5" />
          <text x={CX} y={CY + 4} textAnchor="middle" fontFamily={SANS} fontSize="10.5"
            fontWeight="600" fill={NIGHT.ink}>the project</text>
        </g>
        <circle id="fl-pulse" cx={CX} cy={CY} r="68" fill="none" stroke={NIGHT.accentBright}
          strokeWidth="2" opacity="0" />

        <text className="fl-chrome" opacity="0" x="40" y="52" fontFamily={SANS} fontSize="10"
          fontWeight="600" letterSpacing="1.5" fill={NIGHT.muted}>WHAT THE MODEL TRIED</text>

        {/* what each ring is, in one line */}
        <g className="fl-chrome" opacity="0">
          {RINGS.map(({ abbr, desc }, i) => (
            <text key={abbr} x="40" y={508 + i * 18}>
              <tspan fontFamily={MONO} fontSize="9.5" letterSpacing="1"
                fill={NIGHT.text}>{abbr}</tspan>
              <tspan dx="12" fontFamily={SANS} fontSize="10"
                fill={NIGHT.muted}>{desc}</tspan>
            </text>
          ))}
        </g>

        {/* the probes: cards, check-dots, scars, and the log of verdicts */}
        {PROBES.map((p) => (
          <g key={p.id}>
            <g id={`fl-card-${p.id}`} opacity="0" style={{ transform: `translateX(${40 + p.w}px)` }}>
              <rect id={`fl-rect-${p.id}`} x={-p.w} y={p.lane - 12} width={p.w} height="24" rx="3"
                fill={NIGHT.wash} stroke={p.toCenter ? NIGHT.accent : NIGHT.ink} strokeWidth="1.25"
                strokeDasharray={p.dashed ? '5 3' : 'none'} />
              <text x={-p.w / 2} y={p.lane + 4} textAnchor="middle" fontFamily={MONO}
                fontSize="11" fill={p.toCenter ? NIGHT.accentBright : NIGHT.ink}>{p.cmd}</text>
            </g>
            {p.blinkXs.map((bx, j) => (
              <circle key={j} id={`fl-blink-${p.id}-${j}`} cx={bx} cy={p.lane} r="3.5"
                fill={NIGHT.accent} opacity="0" />
            ))}
            {p.deathRing && (
              <path id={`fl-scar-${p.id}`} d={scarPath(p)} fill="none"
                stroke={NIGHT.coral} strokeWidth="2.5" opacity="0" />
            )}
            {p.layer && (
              <text id={`fl-reason-${p.id}`} x="40" y={p.lane + 4} opacity="0">
                <tspan fontFamily={MONO} fontSize="9.5" letterSpacing="1"
                  fill={NIGHT.coral}>{p.layer}</tspan>
                <tspan dx="10" fontFamily={SANS} fontSize="10.5"
                  fill={NIGHT.text}>{p.verdict}</tspan>
              </text>
            )}
          </g>
        ))}

        {/* the sandbox clock */}
        <g id="fl-timer-bg" opacity="0">
          <rect x={hang.deathX - hang.w / 2 - 23} y={hang.lane + 18} width="46" height="4" rx="1"
            fill="none" stroke={NIGHT.muted} strokeWidth="0.75" />
          <text x={hang.deathX - hang.w / 2 - 32} y={hang.lane + 24} textAnchor="end"
            fontFamily={MONO} fontSize="9" fill={NIGHT.muted}>30s</text>
        </g>
        <rect id="fl-timer" x={hang.deathX - hang.w / 2 - 23} y={hang.lane + 18} width="46"
          height="4" rx="1" fill={NIGHT.coral} opacity="0" />

        {/* grep's round trip pays off */}
        <text id="fl-result" x={40 + grep.w + 14} y={grep.lane + 4} fontFamily={MONO}
          fontSize="11" fill={NIGHT.accentBright} opacity="0">→ 18 matches</text>
      </svg>
      <Replay show={showReplay} onReplay={replay} />
    </figure>
  );
};

export default FiveLayers;
