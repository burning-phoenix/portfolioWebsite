import React, { useEffect, useRef, useState } from 'react';
import { createTimeline, createScope, createDrawable, stagger, onScroll, utils } from 'animejs';
import './visuals.css';

/* "game over" — the Introduction's animation.
   Beats: a plain request types out (comfort) → enters the AI box (curiosity)
   → out comes `rm -rf .`, small and unremarkable (the hush — danger that
   doesn't look like danger) → the command flickers into a Pac-Man, exits the
   top row, screen-wraps onto the corridor where the project's files sit, and
   eats them one by one (dark comedy — you are not the player) → Pac-Man
   leaves; the screen cuts to blank and GAME OVER slams into frame with an
   earthquake shake (finality, in the one language everyone reads).
   Drawn flat in the deep-space-arcade mood: nebula ground, cyan files,
   coral machine. No gradients, no glow. Plays once on scroll; replayable. */

const NEBULA = '#2D283E';
const BONE = '#D4D4CE';
const CYAN = '#6FBDBB';
const CYAN_DIM = '#4A9E9C';
const CORAL = '#D46F7A';

const MONO = "'SF Mono', Menlo, monospace";

const REQUEST = 'Delete the junk files.';
const COMMAND = 'rm -rf .';
const CH = 9; // monospace advance at 15px

// human keystroke rhythm: slightly uneven, with a breath after each word
const KEY_RHYTHM = [95, 62, 55, 80, 48, 66, 58, 88, 52, 71];
const KEY_TIMES = (() => {
  let t = 0;
  return REQUEST.split('').map((c, i, arr) => {
    t += arr[i - 1] === ' ' ? 150 : KEY_RHYTHM[i % KEY_RHYTHM.length];
    return t;
  });
})();
const TYPE_MS = KEY_TIMES[KEY_TIMES.length - 1];

const CMD_X = 545; // where the command prints; pac is born at its center
const PAC_SPAWN_X = CMD_X + (COMMAND.length * CH) / 2;

const DOTS = [60, 110, 160, 210, 310, 360, 410, 510, 560, 610, 710, 760, 810];
const FILES = [
  { x: 260, label: '.xlsx' },
  { x: 460, label: '.py' },
  { x: 660, label: '.md' },
  { x: 860, label: '.png' }
];
const EATABLES = [...DOTS.map((x) => ({ x })), ...FILES].sort((a, b) => a.x - b.x);

/* GAME OVER as banded pixel lettering: each glyph is a 5×7 pixel grid,
   filled by horizontal color bands (bone → gold → orange → rust, a matte
   cousin of the classic arcade sign ramp) clipped to the letterforms,
   over a chunky dark outline. */
const GLYPHS = {
  G: ['01110', '10001', '10000', '10111', '10001', '10001', '01110'],
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001']
};

const P = 15; // pixel size
const EXP = 3; // stroke fattening: each filled pixel bleeds this far into its neighbors
const OUT = 4; // outline thickness beyond the fattened stroke
const WORD_W = 23 * P; // 4 letters, 5 px wide, 1-col gaps
const BLOCK_H = 16 * P; // two 7-row words + a 2-row gap
const BANDS = [
  { from: 0, to: 2, color: '#F4F1E8' },
  { from: 2, to: 3.5, color: '#DFBF63' },
  { from: 3.5, to: 5, color: '#D68A4F' },
  { from: 5, to: 7, color: '#C4544A' }
];
const OUTLINE = '#17141F';

const wordPixels = (word) => {
  const px = [];
  word.split('').forEach((ch, li) => {
    GLYPHS[ch].forEach((row, r) => {
      row.split('').forEach((bit, c) => {
        if (bit === '1') px.push([li * 6 + c, r]);
      });
    });
  });
  return px;
};

const PixelWord = ({ word, rowOffset, clipId }) => {
  const pixels = wordPixels(word);
  const x0 = -WORD_W / 2;
  const y0 = -BLOCK_H / 2 + rowOffset * P;
  const pad = EXP + OUT;
  return (
    <g>
      {pixels.map(([c, r], i) => (
        <rect key={`o${i}`} x={x0 + c * P - pad} y={y0 + r * P - pad}
          width={P + 2 * pad} height={P + 2 * pad} fill={OUTLINE} />
      ))}
      <clipPath id={clipId}>
        {pixels.map(([c, r], i) => (
          <rect key={i} x={x0 + c * P - EXP} y={y0 + r * P - EXP}
            width={P + 2 * EXP} height={P + 2 * EXP} />
        ))}
      </clipPath>
      <g clipPath={`url(#${clipId})`}>
        {BANDS.map((b, i) => (
          <rect key={i} x={x0 - EXP}
            y={y0 + b.from * P - (b.from === 0 ? EXP : 0)}
            width={WORD_W + 2 * EXP}
            height={(b.to - b.from) * P + (b.from === 0 ? EXP : 0) + (b.to === 7 ? EXP : 0)}
            fill={b.color} />
        ))}
      </g>
    </g>
  );
};

const TOP_MS = 870; // top row: spawn → right edge
const CORRIDOR_MS = 2070; // corridor: x -40 → 900 at the same arcade speed
const CHOMP_MS = 110; // one mouth half-cycle, the original cadence

const GameOver = () => {
  const rootRef = useRef(null);
  const tlRef = useRef(null);
  const [showReplay, setShowReplay] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setShowReplay(!reduced);

    const scope = createScope({ root: rootRef.current }).add(() => {
      const line1 = createDrawable('#go-line1');
      const boxLine = createDrawable('#go-box');
      const line2 = createDrawable('#go-line2');
      utils.set(line1, { draw: '0 0' });
      utils.set(boxLine, { draw: '0 0' });
      utils.set(line2, { draw: '0 0' });

      const tl = createTimeline({
        defaults: { duration: 300, ease: 'outQuad' },
        autoplay: reduced
          ? false
          : onScroll({ target: rootRef.current, enter: 'bottom 85%' })
      });

      tl.set('#go-pac', { translateX: PAC_SPAWN_X, translateY: 74, opacity: 0 }, 0);
      tl.set('#go-gameover', { translateX: 480, translateY: 170, scale: 5, opacity: 0 }, 0);

      // the project is already there: pellets and files blink on first
      tl.add('.go-pellet', { opacity: [0, 1], duration: 40, ease: 'steps(1)', delay: stagger(28) })

        // beat 1 — comfort: someone types at a prompt, terminal-true.
        // The cursor blinks while idle, goes solid while typing, and each
        // character lands in the cell the cursor just left — it is never
        // covered by the block.
        .add('#go-lbl-nl', { opacity: [0, 1], duration: 200 }, '+=150')
        .add('#go-cursor', { opacity: [0, 1, 0, 1, 0, 1], duration: 1250, ease: 'steps(1)' })
        .label('type');

      REQUEST.split('').forEach((c, i) => {
        tl.add(`#go-rc-${i}`, { opacity: [0, 1], duration: 8, ease: 'steps(1)' }, `type+=${KEY_TIMES[i]}`)
          .add('#go-cursor', {
            translateX: [i * CH, (i + 1) * CH],
            duration: 8,
            ease: 'steps(1)'
          }, `type+=${KEY_TIMES[i]}`);
      });

      // sentence done: the cursor blinks off
      tl.add('#go-cursor', { opacity: [1, 0, 1, 0], duration: 900, ease: 'steps(1)' }, `type+=${TYPE_MS + 250}`)

        // beat 2 — curiosity: the words enter a machine you can't see into
        .add(line1, { draw: '0 1', duration: 240, ease: 'inOutQuad' }, '-=250')
        .add(boxLine, { draw: '0 1', duration: 320, ease: 'inOutQuad' })
        .add('#go-lbl-ai', { opacity: [0, 1], duration: 150 }, '-=100')
        .add('.go-proc-dot', { opacity: [0, 1, 0, 1, 0], duration: 700, ease: 'steps(1)', delay: stagger(100) })

        // beat 3 — the hush: eight quiet characters that look like nothing.
        // The machine types too — but steady and even, no human hesitation.
        .add(line2, { draw: '0 1', duration: 240, ease: 'inOutQuad' })
        .add('#go-lbl-bash', { opacity: [0, 1], duration: 150 }, '<')
        .add('#go-cursor2', { opacity: [0, 1], duration: 40 })
        .label('cmdtype');

      COMMAND.split('').forEach((c, i) => {
        tl.add(`#go-cc-${i}`, { opacity: [0, 1], duration: 8, ease: 'steps(1)' }, `cmdtype+=${(i + 1) * 55}`)
          .add('#go-cursor2', {
            translateX: [i * CH, (i + 1) * CH],
            duration: 8,
            ease: 'steps(1)'
          }, `cmdtype+=${(i + 1) * 55}`);
      });

      // command printed: the cursor blinks off
      tl.add('#go-cursor2', { opacity: [1, 0, 1, 0], duration: 600, ease: 'steps(1)' }, `cmdtype+=${COMMAND.length * 55 + 200}`)

        // beat 4 — the morph: the command becomes the player.
        // Position rides in the same tween as the flicker (explicit from-to),
        // so it can never be skipped the way a zero-duration set can.
        .add('#go-cmd', { opacity: [1, 0, 1, 0], duration: 300, ease: 'steps(1)' }, '+=550')
        .add('#go-pac', {
          opacity: [0, 1, 0, 1],
          translateX: [PAC_SPAWN_X, PAC_SPAWN_X],
          translateY: [74, 74],
          duration: 300,
          ease: 'steps(1)'
        }, '<')

        // top row: chomp sized to this leg, so the mouth can't die at the wrap
        .label('travel')
        .add('#go-pac-mouth', {
          opacity: [1, 0],
          duration: CHOMP_MS,
          alternate: true,
          loop: Math.round(TOP_MS / CHOMP_MS),
          ease: 'steps(1)'
        }, 'travel')
        .add('#go-pac', { translateX: [PAC_SPAWN_X, 990], duration: TOP_MS, ease: 'linear' }, 'travel')

        // screen-wrap onto the corridor: the teleport is the corridor tween's
        // own from-value, not a separate instant child
        .label('chomp')
        .add('#go-pac-mouth', {
          opacity: [1, 0],
          duration: CHOMP_MS,
          alternate: true,
          loop: Math.round((CORRIDOR_MS + 250) / CHOMP_MS),
          ease: 'steps(1)'
        }, 'chomp')
        .add('#go-pac', {
          translateX: [-40, 900],
          translateY: [250, 250],
          duration: CORRIDOR_MS,
          ease: 'linear'
        }, 'chomp');

      // each pellet and file vanishes the instant the mouth reaches it
      EATABLES.forEach((item, i) => {
        tl.add(`#go-eat-${i}`, { opacity: [1, 0], duration: 20, ease: 'steps(1)' },
          `chomp+=${Math.round((CORRIDOR_MS * (item.x + 40)) / 940)}`);
      });

      // done eating: leave the screen
      tl.add('#go-pac', { translateX: [900, 1015], duration: 250, ease: 'linear' }, `chomp+=${CORRIDOR_MS}`)

        // beat 5 — finality: everything else cuts to blank,
        // GAME OVER slams into frame and the screen quakes
        .add('#go-world', { opacity: [1, 0], duration: 40, ease: 'steps(1)' }, '+=350')
        .add('#go-gameover', {
          opacity: [0, 1],
          scale: [5, 1],
          translateX: [480, 480],
          translateY: [170, 170],
          duration: 320,
          ease: 'inQuad'
        }, '+=150')
        .add('#go-gameover', {
          translateX: [480, 468, 490, 472, 487, 475, 484, 478, 481, 480],
          translateY: [170, 179, 162, 176, 165, 174, 167, 172, 169, 170],
          duration: 450,
          ease: 'linear'
        }, '-=40')

        // then the set goes cold
        .add('#go-blackout', { opacity: [0, 1], duration: 180, ease: 'outQuad' }, '+=1000');

      // reduced motion holds on the GAME OVER frame, not the black screen
      if (reduced) tl.seek(tl.duration - 1200);
      tlRef.current = tl;
    });

    return () => scope.revert();
  }, []);

  return (
    <figure className="case-visual case-visual--wide" ref={rootRef}>
      <svg viewBox="0 0 960 340" role="img"
        aria-label="Animation, drawn as a 90s arcade screen: a person types the request 'Delete the junk files.' in natural language. It passes through a box labeled AI, which outputs the bash command rm -rf . — the command turns into a Pac-Man that eats the project's files (.xlsx, .py, .md, .png) one by one, leaves the screen, and everything cuts to black except the words GAME OVER slamming into frame.">
        {/* the arcade screen */}
        <rect x="1" y="1" width="958" height="338" rx="4" fill={NEBULA} stroke="rgba(74, 158, 156, 0.35)" strokeWidth="1" />

        <g id="go-world">
          {/* beat 1: the request */}
          <text id="go-lbl-nl" x="48" y="44" fontFamily={MONO} fontSize="11" letterSpacing="2"
            fill={CYAN_DIM} opacity="0">NATURAL LANGUAGE</text>
          <text fontFamily={MONO} fontSize="15" fill={BONE}>
            {REQUEST.split('').map((c, i) => (
              <tspan key={i} id={`go-rc-${i}`} x={48 + i * CH} y="80" opacity="0">
                {c === ' ' ? ' ' : c}
              </tspan>
            ))}
          </text>
          <rect id="go-cursor" x="48" y="64" width="9" height="19" fill={BONE} opacity="0" />

          {/* beat 2: the machine */}
          <path id="go-line1" d="M262 74 H380" fill="none" stroke={CYAN_DIM} strokeWidth="1.25" />
          <path id="go-box" d="M380 44 h120 v60 h-120 Z" fill="none" stroke={CYAN} strokeWidth="1.25" />
          <text id="go-lbl-ai" x="440" y="74" textAnchor="middle" fontFamily={MONO} fontSize="15"
            fontWeight="700" fill={BONE} opacity="0">AI</text>
          <circle className="go-proc-dot" cx="424" cy="92" r="2.5" fill={CYAN} opacity="0" />
          <circle className="go-proc-dot" cx="440" cy="92" r="2.5" fill={CYAN} opacity="0" />
          <circle className="go-proc-dot" cx="456" cy="92" r="2.5" fill={CYAN} opacity="0" />

          {/* beat 3: the command */}
          <path id="go-line2" d="M500 74 H532" fill="none" stroke={CYAN_DIM} strokeWidth="1.25" />
          <text id="go-lbl-bash" x={CMD_X} y="44" fontFamily={MONO} fontSize="11" letterSpacing="2"
            fill={CYAN_DIM} opacity="0">BASH COMMAND</text>
          <text id="go-cmd" fontFamily={MONO} fontSize="15" fill={BONE}>
            {COMMAND.split('').map((c, i) => (
              <tspan key={i} id={`go-cc-${i}`} x={CMD_X + i * CH} y="80" opacity="0">
                {c === ' ' ? ' ' : c}
              </tspan>
            ))}
          </text>
          <rect id="go-cursor2" x={CMD_X} y="64" width="9" height="19" fill={BONE} opacity="0" />

          {/* the corridor: your project */}
          {EATABLES.map((item, i) =>
            item.label ? (
              <text key={i} id={`go-eat-${i}`} className="go-pellet" x={item.x} y="256"
                textAnchor="middle" fontFamily={MONO} fontSize="14" fill={CYAN} opacity="0">
                {item.label}
              </text>
            ) : (
              <circle key={i} id={`go-eat-${i}`} className="go-pellet" cx={item.x} cy="250" r="3"
                fill={CYAN} opacity="0" />
            )
          )}

          {/* beat 4: the player */}
          <g id="go-pac" opacity="0">
            <path d="M0 0 L21 -12 A24 24 0 1 0 21 12 Z" fill={CORAL} />
            <circle id="go-pac-mouth" r="24" fill={CORAL} />
          </g>
        </g>

        {/* beat 5 */}
        <g id="go-gameover" opacity="0">
          <PixelWord word="GAME" rowOffset={0} clipId="go-clip-game" />
          <PixelWord word="OVER" rowOffset={9} clipId="go-clip-over" />
        </g>

        {/* beat 6: the set goes cold */}
        <rect id="go-blackout" x="1" y="1" width="958" height="338" rx="4"
          fill="#0C0B10" opacity="0" pointerEvents="none" />
      </svg>
      {showReplay && (
        <button className="visual-replay" onClick={() => tlRef.current && tlRef.current.restart()}>
          replay
        </button>
      )}
    </figure>
  );
};

export default GameOver;
