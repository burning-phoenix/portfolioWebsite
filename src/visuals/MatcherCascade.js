import React from 'react';
import { createTimeline, createDrawable, stagger, utils } from 'animejs';
import { useVisualTimeline, Replay, NIGHT, SANS, MONO } from './shared';
import './visuals.css';

/* "the matcher cascade" — one concrete edit, four algorithms shown working.
   The model's SEARCH block and the real file sit side by side; each layer of
   ContentMatcher is demonstrated as a visible transformation of those texts.

   Run 1 — the model dropped the indentation (code-fence flattening):
     EXACT compares characters and trips on the missing indent; WHITESPACE
     collapses runs of spaces to one — the file's four become one, the model's
     zero stay zero, still unequal; INDENT strips every line's lead on both
     sides and what's left is identical: caught, 90%.
   Run 2 — the model remembered an API that's gone: nothing helps, and FUZZY
     scores the nearest window at 57% — a real SequenceMatcher ratio for these
     two blocks — under the 0.75 bar. The miss returns a map, back to the model.

   Every mechanic is verified against editor.py: _normalize_whitespace collapses
   [ \t]+ to a single space, _indent_match dedents and strips, FUZZY_THRESHOLD
   is 0.75, and the feedback mirrors EditError.format_feedback().
   Tech view only, so drawn midnight-native. */

const CH = 7.2; // Menlo advance at fontSize 12
const MODEL_X = 40;
const MODEL_TX = 54;
const FILE_X = 550;
const NUM_X = 560;
const FILE_TX = 596;
const CARD_H = 88;

const R1 = { labelY: 52, cardY: 60, lines: [84, 105, 126] };
const R2 = { headerY: 322, labelY: 350, cardY: 358, lines: [382, 403, 424] };

const CHIPS = ['1 · EXACT', '2 · WHITESPACE', '3 · INDENT', '4 · FUZZY'];
const CHIP_Y = 176;
const chipX = (i) => 40 + i * 230;

const FILE_LINES = [
  'def total(items):',
  'subtotal = sum(i.price for i in items)', // drawn after a 4-dot indent
  'return round(subtotal * TAX, 2)'
];

// the lens beats: stage 2 collapses the file's indent 4 → 1 (code slides
// 3 chars left); stage 3 strips it entirely (4 chars). Both revert — the
// algorithms transform copies, never the file.
const COLLAPSE = -3 * CH;
const DEDENT = -4 * CH;

const stage = (tl, i, on) =>
  tl.add(`#mx-chip-${i}`, { stroke: on ? [NIGHT.muted, NIGHT.ink] : [NIGHT.ink, NIGHT.muted], duration: 200 }, '<')
    .add(`#mx-cap-${i}`, { opacity: on ? [0, 1] : [1, 0], duration: 220 }, '<');

function buildCascade(root, { autoplay, reduced }) {
  const arrow = createDrawable('#mx-arrow');
  utils.set(arrow, { draw: '0 0' });

  const tl = createTimeline({
    defaults: { duration: 320, ease: 'outQuad' },
    autoplay
  });

  // run 1 assembles: the two texts, then the cascade below them
  tl.add('.mx-r1-in', { opacity: [0, 1], translateY: [8, 0], delay: stagger(120), duration: 300 })
    .add('.mx-chip', { opacity: [0, 1], translateY: [6, 0], delay: stagger(80), duration: 260 }, '<+=140');

  // stage 1 — EXACT: character for character; the mismatch glows
  tl.add('#mx-chip-0', { stroke: [NIGHT.muted, NIGHT.ink], duration: 200 }, '+=250')
    .add('#mx-cap-0', { opacity: [0, 1], duration: 220 }, '<');
  tl.add('.mx-hl1', { opacity: [0, 0.3], duration: 260, delay: stagger(70) }, '+=200');
  tl.add('#mx-verdict-0', { opacity: [0, 1], duration: 200 }, '+=650');
  tl.add('.mx-hl1', { opacity: [0.3, 0], duration: 240 }, '+=450');
  stage(tl, 0, false);

  // stage 2 — WHITESPACE: the file's four spaces become one, before your eyes
  stage(tl, 1, true);
  tl.add('#mx-dots4-2', { opacity: [1, 0], duration: 260 }, '+=350')
    .add('#mx-dots1-2', { opacity: [0, 1], duration: 260 }, '<')
    .add('#mx-fcode-2', { translateX: [0, COLLAPSE], duration: 320, ease: 'inOutQuad' }, '<')
    .add('#mx-dots4-3', { opacity: [1, 0], duration: 260 }, '<+=90')
    .add('#mx-dots1-3', { opacity: [0, 1], duration: 260 }, '<')
    .add('#mx-fcode-3', { translateX: [0, COLLAPSE], duration: 320, ease: 'inOutQuad' }, '<');
  tl.add('#mx-verdict-1', { opacity: [0, 1], duration: 200 }, '+=700');
  tl.add('#mx-dots4-2', { opacity: [0, 1], duration: 240 }, '+=450')
    .add('#mx-dots1-2', { opacity: [1, 0], duration: 240 }, '<')
    .add('#mx-fcode-2', { translateX: [COLLAPSE, 0], duration: 280, ease: 'inOutQuad' }, '<')
    .add('#mx-dots4-3', { opacity: [0, 1], duration: 240 }, '<')
    .add('#mx-dots1-3', { opacity: [1, 0], duration: 240 }, '<')
    .add('#mx-fcode-3', { translateX: [COLLAPSE, 0], duration: 280, ease: 'inOutQuad' }, '<');
  stage(tl, 1, false);

  // stage 3 — INDENT: strip the lead from both sides; the lines agree
  stage(tl, 2, true);
  tl.add('#mx-dots4-2', { opacity: [1, 0], duration: 240 }, '+=350')
    .add('#mx-dots4-3', { opacity: [1, 0], duration: 240 }, '<')
    .add('#mx-fcode-2', { translateX: [0, DEDENT], duration: 340, ease: 'inOutQuad' }, '<')
    .add('#mx-fcode-3', { translateX: [0, DEDENT], duration: 340, ease: 'inOutQuad' }, '<');
  tl.add('.mx-match1', { opacity: [0, 0.16], duration: 220, delay: stagger(90) }, '+=300');
  tl.add('#mx-chip-2', { stroke: [NIGHT.ink, NIGHT.accent], duration: 220 }, '+=250')
    .add('#mx-verdict-2', { opacity: [0, 1], duration: 200 }, '<')
    .add('#mx-tag1', { opacity: [0, 1], duration: 240 }, '<+=140');
  // the file itself never changed: put it back, keep the matched region marked
  tl.add('.mx-match1', { opacity: [0.16, 0], duration: 300 }, '+=750')
    .add('#mx-dots4-2', { opacity: [0, 1], duration: 260 }, '<')
    .add('#mx-dots4-3', { opacity: [0, 1], duration: 260 }, '<')
    .add('#mx-fcode-2', { translateX: [DEDENT, 0], duration: 300, ease: 'inOutQuad' }, '<')
    .add('#mx-fcode-3', { translateX: [DEDENT, 0], duration: 300, ease: 'inOutQuad' }, '<')
    .add('#mx-region1', { opacity: [0, 1], duration: 260 }, '<+=180');

  // run 2: the stages the viewer already knows fail fast —
  tl.add('.mx-r2-in', { opacity: [0, 1], translateY: [8, 0], delay: stagger(100), duration: 300 }, '+=800');
  tl.add('#mx-r2-0', { opacity: [0, 1], duration: 180 }, '+=350')
    .add('#mx-r2-1', { opacity: [0, 1], duration: 180 }, '+=300')
    .add('#mx-r2-2', { opacity: [0, 1], duration: 180 }, '+=300');
  // — and FUZZY measures instead of comparing: the scraps it can align light
  // up one by one, and the meter climbs to their sum — short of the bar
  tl.add('.mx-scrap', { opacity: [0, 0.22], duration: 240, delay: stagger(90) }, '+=350');
  tl.add('#mx-meter-fill', { width: [0, 205], duration: 750, ease: 'outCubic' }, '-=250')
    .add('#mx-meter-label', { opacity: [0, 1], duration: 220 }, '-=200');
  // the miss comes back as a map
  tl.add('.mx-fb', { opacity: [0, 1], translateY: [6, 0], duration: 240, delay: stagger(140) }, '+=400');
  tl.add(arrow, { draw: ['0 0', '0 1'], duration: 480, ease: 'inOutQuad' }, '+=250')
    .add('#mx-arrowhead', { opacity: [0, 1], duration: 160 }, '-=90')
    .add('.mx-return', { opacity: [0, 1], duration: 260 }, '-=40');

  if (reduced) tl.complete();
  return tl;
}

/* card chrome: label + frame */
const Card = ({ x, w, labelY, cardY, label, className }) => (
  <g className={className} opacity="0">
    <text x={x} y={labelY} fontFamily={SANS} fontSize="10" fontWeight="600"
      letterSpacing="1.2" fill={NIGHT.muted}>{label}</text>
    <rect x={x} y={cardY} width={w} height={CARD_H} rx="2"
      fill={NIGHT.wash} stroke={NIGHT.muted} strokeWidth="1" />
  </g>
);

/* the file, drawn once per run: line numbers, a visible 4-dot indent on
   lines 2–3 (split into segments so the algorithms can transform it) */
const FileCard = ({ r, run, label }) => (
  <>
    <Card x={FILE_X} w={370} labelY={r.labelY} cardY={r.cardY} label={label}
      className={`mx-r${run}-in`} />
    <g className={`mx-r${run}-in`} opacity="0">
      {r.lines.map((y, i) => (
        <text key={y} x={NUM_X} y={y} fontFamily={MONO} fontSize="11"
          fill={NIGHT.muted}>{41 + i}</text>
      ))}
      <text x={FILE_TX} y={r.lines[0]} fontFamily={MONO} fontSize="12"
        fill={NIGHT.ink}>{FILE_LINES[0]}</text>
      {[1, 2].map((i) => (
        <g key={i}>
          {run === 1 && (
            <>
              <text id={`mx-dots4-${i + 1}`} x={FILE_TX} y={r.lines[i]} fontFamily={MONO}
                fontSize="12" fill={NIGHT.muted}>····</text>
              <text id={`mx-dots1-${i + 1}`} x={FILE_TX} y={r.lines[i]} fontFamily={MONO}
                fontSize="12" fill={NIGHT.muted} opacity="0">·</text>
            </>
          )}
          {run === 2 && (
            <text x={FILE_TX} y={r.lines[i]} fontFamily={MONO} fontSize="12"
              fill={NIGHT.muted}>····</text>
          )}
          <text id={run === 1 ? `mx-fcode-${i + 1}` : undefined} x={FILE_TX + 4 * CH}
            y={r.lines[i]} fontFamily={MONO} fontSize="12" fill={NIGHT.ink}>
            {FILE_LINES[i]}
          </text>
        </g>
      ))}
    </g>
  </>
);

const MatcherCascade = () => {
  const { rootRef, showReplay, replay } = useVisualTimeline(buildCascade);

  return (
    <figure className="case-visual case-visual--wide case-visual--night" ref={rootRef}>
      <svg viewBox="0 0 960 600" role="img"
        aria-label="Two worked examples of the four-layer content matcher, each showing the model's search block beside the real file. Run one: the model dropped all indentation. The exact matcher compares character for character and fails on the missing indent; the whitespace matcher collapses the file's four leading spaces to one but the model's zero stay zero, still unequal; the indent matcher strips every line's leading indent from both sides and the lines are identical — caught, indent match, 90% confidence. Run two: the model remembered an API that no longer exists. The first three matchers fail; the fuzzy matcher lights up the fragments it can align — the def line, indentation, return, and other scaffolding — which sum to 57% similarity, under the 75% threshold, so the failure returns a map — closest match at lines 41 to 43, surrounding context, and the instruction to copy the exact text — back to the model, which repairs its own edit next turn.">

        {/* ═══ run 1 — the model dropped the indentation ═══ */}
        <text className="mx-r1-in" opacity="0" x="40" y="24" fontFamily={SANS} fontSize="11"
          fontWeight="600" letterSpacing="1.5" fill={NIGHT.muted}>RUN 1 — THE MODEL DROPPED THE INDENTATION</text>

        <Card x={MODEL_X} w={360} labelY={R1.labelY} cardY={R1.cardY}
          label="THE MODEL SENT" className="mx-r1-in" />
        <g className="mx-r1-in" opacity="0">
          {FILE_LINES.map((line, i) => (
            <text key={line} x={MODEL_TX} y={R1.lines[i]} fontFamily={MONO} fontSize="12"
              fill={NIGHT.ink}>{line}</text>
          ))}
        </g>

        <FileCard r={R1} run={1} label="THE FILE — pricing.py" />

        {/* stage 1's lens: the file's indent, and the model's missing one */}
        {[1, 2].map((i) => (
          <g key={i}>
            <rect className="mx-hl1" x={FILE_TX - 1} y={R1.lines[i] - 11} width={4 * CH + 2}
              height="15" fill={NIGHT.coral} opacity="0" />
            <rect className="mx-hl1" x={MODEL_TX - 3} y={R1.lines[i] - 11} width="3"
              height="15" fill={NIGHT.coral} opacity="0" />
          </g>
        ))}

        {/* stage 3's verdict: every line agrees */}
        {R1.lines.map((y) => (
          <g key={y}>
            <rect className="mx-match1" x={MODEL_TX - 6} y={y - 11} width="344" height="15"
              fill={NIGHT.accent} opacity="0" />
            <rect className="mx-match1" x={NUM_X - 4} y={y - 11} width="358" height="15"
              fill={NIGHT.accent} opacity="0" />
          </g>
        ))}
        <rect id="mx-region1" x={FILE_X} y={R1.cardY} width="370" height={CARD_H} rx="2"
          fill="none" stroke={NIGHT.accent} strokeWidth="1.5" opacity="0" />

        {/* the cascade */}
        {CHIPS.map((label, i) => (
          <g key={label} className="mx-chip" opacity="0">
            <rect id={`mx-chip-${i}`} x={chipX(i)} y={CHIP_Y} width="190" height="32" rx="2"
              fill="none" stroke={NIGHT.muted} strokeWidth="1.25" />
            <text x={chipX(i) + 14} y={CHIP_Y + 21} fontFamily={SANS} fontSize="11"
              fontWeight="600" letterSpacing="1" fill={NIGHT.text}>{label}</text>
            <text id={`mx-verdict-${i}`} x={chipX(i) + 168} y={CHIP_Y + 21} fontFamily={MONO}
              fontSize="13" fill={i === 2 ? NIGHT.accentBright : NIGHT.coral}
              opacity="0">{i === 2 ? '✓' : '✕'}</text>
          </g>
        ))}

        {/* what each algorithm is doing, in one line */}
        <text id="mx-cap-0" x="480" y="250" textAnchor="middle" fontFamily={SANS} fontSize="11.5"
          fill={NIGHT.text} opacity="0">compare character for character — the model's lines start at column 0, the file's don't</text>
        <text id="mx-cap-1" x="480" y="250" textAnchor="middle" fontFamily={SANS} fontSize="11.5"
          fill={NIGHT.text} opacity="0">collapse every run of spaces to one — the file's four become one, the model's zero stay zero</text>
        <text id="mx-cap-2" x="480" y="250" textAnchor="middle" fontFamily={SANS} fontSize="11.5"
          fill={NIGHT.text} opacity="0">strip each line's leading indent on both sides and compare what's left — identical</text>
        <text id="mx-tag1" x="480" y="274" textAnchor="middle" fontFamily={MONO} fontSize="11.5"
          fill={NIGHT.accentBright} opacity="0">✓ caught — indent match · 90% confidence</text>

        {/* ═══ run 2 — the model remembered an API that's gone ═══ */}
        <text className="mx-r2-in" opacity="0" x="40" y={R2.headerY} fontFamily={SANS} fontSize="11"
          fontWeight="600" letterSpacing="1.5" fill={NIGHT.muted}>RUN 2 — THE MODEL REMEMBERED AN API THAT'S GONE</text>

        <Card x={MODEL_X} w={360} labelY={R2.labelY} cardY={R2.cardY}
          label="THE MODEL SENT" className="mx-r2-in" />
        <g className="mx-r2-in" opacity="0">
          {/* xmlSpace keeps the leading spaces — SVG collapses them by default,
              which would shift the text out from under the highlight rects */}
          <text x={MODEL_TX} y={R2.lines[0]} fontFamily={MONO} fontSize="12" fill={NIGHT.ink}>def total(items, discount):</text>
          <text xmlSpace="preserve" x={MODEL_TX} y={R2.lines[1]} fontFamily={MONO} fontSize="12" fill={NIGHT.ink}>{'    price = apply_discount(items, discount)'}</text>
          <text xmlSpace="preserve" x={MODEL_TX} y={R2.lines[2]} fontFamily={MONO} fontSize="12" fill={NIGHT.ink}>{'    return price * TAX_RATE'}</text>
        </g>

        <FileCard r={R2} run={2} label="THE FILE — pricing.py" />

        {/* what fuzzy could align — SequenceMatcher's actual matching blocks,
            lit as the meter counts them. Blocks of 2+ chars; four 1-char
            accidents ('i', 'n', 'r', a space) are in the 57% but skipped here
            for legibility. Mostly scaffolding — the def line, indents, return,
            ' * TAX' — plus semantically wrong scavenges: 'price' aligned to
            the file's i.price, 'items' to the file's trailing items. */}
        <rect className="mx-scrap" x={MODEL_TX} y={R2.lines[0] - 11} width={15 * CH}
          height="15" fill={NIGHT.accent} opacity="0" />
        <rect className="mx-scrap" x={MODEL_TX + 25 * CH} y={R2.lines[0] - 11} width={2 * CH}
          height="15" fill={NIGHT.accent} opacity="0" />
        <rect className="mx-scrap" x={MODEL_TX} y={R2.lines[1] - 11} width={10 * CH}
          height="15" fill={NIGHT.accent} opacity="0" />
        <rect className="mx-scrap" x={MODEL_TX + 27 * CH} y={R2.lines[1] - 11} width={5 * CH}
          height="15" fill={NIGHT.accent} opacity="0" />
        <rect className="mx-scrap" x={MODEL_TX + 42 * CH} y={R2.lines[1] - 11} width={CH}
          height="15" fill={NIGHT.accent} opacity="0" />
        <rect className="mx-scrap" x={MODEL_TX} y={R2.lines[2] - 11} width={11 * CH}
          height="15" fill={NIGHT.accent} opacity="0" />
        <rect className="mx-scrap" x={MODEL_TX + 16 * CH} y={R2.lines[2] - 11} width={6 * CH}
          height="15" fill={NIGHT.accent} opacity="0" />

        {/* three known sieves fail fast */}
        <text id="mx-r2-0" x="40" y="470" fontFamily={MONO} fontSize="11" fill={NIGHT.text}
          opacity="0">exact <tspan fill={NIGHT.coral}>✕</tspan></text>
        <text id="mx-r2-1" x="130" y="470" fontFamily={MONO} fontSize="11" fill={NIGHT.text}
          opacity="0">whitespace <tspan fill={NIGHT.coral}>✕</tspan></text>
        <text id="mx-r2-2" x="252" y="470" fontFamily={MONO} fontSize="11" fill={NIGHT.text}
          opacity="0">indent <tspan fill={NIGHT.coral}>✕</tspan></text>

        {/* fuzzy doesn't compare, it measures */}
        <g className="mx-r2-in" opacity="0">
          <text x="40" y="490" fontFamily={SANS} fontSize="10.5" fill={NIGHT.muted}>4 · FUZZY — how much of the block can be aligned?</text>
          <rect x="40" y="496" width="360" height="10" rx="1" fill="none"
            stroke={NIGHT.muted} strokeWidth="1" />
          <line x1="310" y1="490" x2="310" y2="512" stroke={NIGHT.ink} strokeWidth="1"
            strokeDasharray="3 2" />
          <text x="310" y="524" textAnchor="middle" fontFamily={MONO} fontSize="10"
            fill={NIGHT.muted}>needs ≥ 75%</text>
          <text x="40" y="524" fontFamily={SANS} fontSize="10" fill={NIGHT.muted}>lit = what aligned — scaffolding, mostly</text>
        </g>
        <rect id="mx-meter-fill" x="40" y="496" width="0" height="10" fill={NIGHT.coral} />
        <text id="mx-meter-label" x="400" y="490" textAnchor="end" fontFamily={MONO} fontSize="11"
          fill={NIGHT.ink} opacity="0">closest: 57% <tspan fill={NIGHT.coral}>✕</tspan></text>

        {/* the miss, returned as a map — EditError.format_feedback() */}
        <text className="mx-fb" x="550" y="492" fontFamily={MONO} fontSize="11"
          fill={NIGHT.coral} opacity="0">EDIT FAILED: no_match</text>
        <text className="mx-fb" x="550" y="510" fontFamily={MONO} fontSize="11"
          fill={NIGHT.ink} opacity="0">CLOSEST MATCH (57%) — lines 41–43</text>
        <text className="mx-fb" x="550" y="528" fontFamily={MONO} fontSize="11"
          fill={NIGHT.text} opacity="0">+ 3 lines of surrounding context</text>
        <text className="mx-fb" x="550" y="546" fontFamily={MONO} fontSize="11"
          fill={NIGHT.accentBright} opacity="0">SUGGESTION: copy the exact text</text>

        {/* the round trip: the map travels back to the model */}
        <path id="mx-arrow" d="M 538 500 C 502 472, 466 434, 422 386" fill="none"
          stroke={NIGHT.accentBright} strokeWidth="1.5" />
        <polygon id="mx-arrowhead" points="416,380 428,385 421,392" fill={NIGHT.accentBright}
          opacity="0" />
        <text className="mx-return" x="480" y="580" textAnchor="middle" fontFamily={SANS}
          fontSize="10.5" fill={NIGHT.text} opacity="0">the map goes back to the model — it repairs its own edit next turn</text>
      </svg>
      <figcaption>
        One edit, four algorithms. A flattened block is caught once the indent stops mattering;
        a hallucinated one scores 57% against the nearest window and comes back as a map.
      </figcaption>
      <Replay show={showReplay} onReplay={replay} />
    </figure>
  );
};

export default MatcherCascade;
