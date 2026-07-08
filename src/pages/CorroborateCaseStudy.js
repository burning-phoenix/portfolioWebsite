import React from 'react';
import { Link } from 'react-router-dom';
import CaseStudyLayout, { CsSection } from './CaseStudyLayout';

const CorroborateCaseStudy = () => (
  <CaseStudyLayout
    title="Corroborate"
    subtitle="A news pipeline where facts are verified by math, not by the model."
    meta={<>Open-source &middot; repo link pending &mdash; publishing shortly</>}
  >
    <CsSection label="The Problem">
      <p>
        Most news coverage is a thin layer of verifiable fact wrapped in a thick layer of framing,
        and the two arrive fused together. I wanted a daily brief that pulls them apart: what
        actually happened (confirmed across independent outlets), how different outlets are framing
        it, and where they contradict each other. The obvious approach &mdash; "feed articles to an
        LLM and ask it to fact-check" &mdash; fails on trust: an LLM will confidently promote a
        single outlet's allegation into a fact. So I inverted the design. In Corroborate, a claim
        only counts as corroborated if sentence-level embedding similarity confirms it across{' '}
        <strong>3+ independent outlets</strong> &mdash; a purely mathematical check that happens{' '}
        <em>before</em> the LLM sees anything. The model writes prose from pre-verified claims; it
        never gets the authority to decide what's true.
      </p>
    </CsSection>

    <CsSection label="Constraints">
      <p>
        This runs daily against 48 RSS feeds from 39 global outlets, so cost discipline is
        structural, not an afterthought. It had to be small enough to tweak in an afternoon
        (~1,340 lines of source), pipeable like a proper Unix tool (briefs to stdout, progress to
        stderr, quiet by default), and honest in its output &mdash; every factual sentence in a
        brief carries its source count, and disagreements between outlets get surfaced, not
        resolved.
      </p>
    </CsSection>

    <CsSection label="Approach">
      <p>
        Six stages behind swappable ABC interfaces (embedding, LLM, extraction, clustering): fetch
        RSS and filter to the last 24 hours &rarr; embed title+summary &rarr; agglomerative
        clustering into stories &rarr; full-text fetch (trafilatura) for the top clusters only
        &rarr; sentence-level claim corroboration within each cluster &rarr; LLM synthesis of
        per-story briefs, then a consolidation pass into a single daily document. Institutional
        feeds (central banks, BIS, the Fed) route around the corroboration path entirely into a
        separate digest. Two prompt files &mdash; a "constitution" of epistemic rules and a "soul"
        defining the synthesizer's role &mdash; govern every LLM call.
      </p>
      {/* anime.js visual-aid slot: six-stage pipeline / cost funnel */}
      <div className="cs-visual" data-visual="corroborate-funnel" />
    </CsSection>

    <CsSection label="Decisions That Mattered">
      <p>
        <strong>The cost funnel.</strong> The architecture's organizing principle is that the
        cheapest operations touch the most data, and every stage operates on a strictly smaller set
        than the one before. All entries get title+summary embeddings at $0.022 per million tokens;
        only clustered multi-outlet stories get full-text fetches; only fetched clusters get
        sentence-level embedding; only qualified stories with their pre-computed claims reach the
        LLM. Cost and token counts are logged per stage, so a run's spend is visible line by line.
        A full daily run across 48 feeds costs pennies &mdash; not because of a cheaper model, but
        because of the shape of the pipeline.
      </p>
      <p>
        <strong>Verification the LLM can't override.</strong> Claim detection splits every article
        into sentences, embeds them, and groups sentences whose cosine similarity clears 0.75
        &mdash; with the critical constraint that{' '}
        <strong>two sentences from the same outlet can never corroborate each other</strong>. Only
        groups spanning 3+ distinct outlets become claims, which are then deduplicated (same
        outlet-set, similar anchors collapse to one). The synthesis prompt hands the model these
        claims with their source counts and the constitution's rules: a single-source report is an
        allegation, not a fact; absence of contradiction is not confirmation; when outlets disagree
        on a figure, report the range. In a recent sample run, that structure is visible in the
        output &mdash; "confirmed by 10 sources" on the core event, "4+ sources" on a disputed
        fine, and a discrepancies paragraph noting that two outlets place the same phone call on
        different days.
      </p>
      {/* anime.js visual-aid slot: cross-outlet corroboration graph */}
      <div className="cs-visual" data-visual="corroborate-claims" />
      <p>
        <strong>A threshold sweep instead of a magic number.</strong> Clustering quality is
        notoriously sensitive to the distance threshold, and any single hand-tuned value is wrong
        on some news day. Instead of picking one, the pipeline runs agglomerative clustering at
        five thresholds (0.35 down to 0.15) and keeps whichever produces the most{' '}
        <em>multi-source</em> clusters &mdash; optimizing directly for the pipeline's actual
        objective (stories corroborable across outlets) rather than a generic clustering metric.
        The selection is logged, so every run shows its work.
      </p>
      <p>
        <strong>Primary sources are a different epistemic category.</strong> "Verify across 3
        outlets" is a category error for an ECB speech &mdash; the ECB <em>is</em> the source of
        truth about what the ECB said. Feeds tagged <code>primary</code> (14 institutional feeds:
        central banks, BIS, regulators) skip corroboration and route into a themed digest with its
        own prompt. Recognizing where the verification machinery <em>shouldn't</em> apply was as
        important as building it.
      </p>
      <p>
        <strong>Degrade visibly, never silently.</strong> Full-text extraction fails constantly in
        the real world (paywalls, bot blocks). When it does, the article falls back to
        title+summary &mdash; and is <em>labeled</em> "title+summary only" in the LLM prompt, so
        the model and the reader both know that source's evidentiary weight is lower. LLM calls
        retry with exponential backoff on server errors but fail loudly on client errors; a
        null-content response is logged with the message keys rather than swallowed.
      </p>
      <p>
        <strong>Shipping the blueprint's core, not its ambition.</strong> The original 723-line
        design document specified re-ranker ensemble validation, syndication detection, provenance
        grouping, and statefulness across runs. I cut all of it and shipped the single-pass core,
        because a working pipeline I run every morning beats a sophisticated one I'm still
        building. The cuts live on as a concrete roadmap rather than half-finished code paths.
      </p>
    </CsSection>

    <CsSection label="Results">
      <p>
        The pipeline runs end to end daily: 48 feeds in, one consolidated markdown brief out, with
        per-claim source counts, per-outlet framing summaries, and explicit discrepancy notes on
        every story. Category filtering (<code>-c world politics</code>, <code>--exclusive</code>),
        cluster scope control, and stderr/stdout separation make it composable into anything
        downstream. The full run is observable &mdash; per-feed fetch timing and drop reasons,
        per-threshold cluster counts, per-batch embedding costs, per-call LLM token usage.
      </p>
    </CsSection>

    <CsSection label="What I'd Do Differently">
      <p>
        The honest gaps map to the blueprint's cut features. The most important:{' '}
        <strong>syndication is the known blind spot.</strong> Three outlets running the same
        wire-service copy currently count as three independent confirmations, which overstates
        corroboration &mdash; the blueprint's provenance-grouping design (near-duplicate detection
        at ~0.95 similarity collapsing syndicated copies into one source) is the fix, and it's the
        first thing I'd add. Second, the claim detector has no measured precision/recall; after
        building a 100-query golden dataset for my{' '}
        <Link to="/case-studies/code-rag">code-rag</Link> retrieval project, I hold the view that
        unmeasured NLP components are unfinished &mdash; a hand-labeled set of claim/non-claim
        sentence pairs would tell me whether 0.75 is actually the right threshold. And the two
        ad-hoc style-comparison scripts should grow into a real test suite.
      </p>
    </CsSection>

    <CsSection label="If This Looks Like Your Problem">
      <p>
        If you have many unstructured sources &mdash; news, filings, tickets, research &mdash; and
        you need synthesis you can actually trust, the design pattern here is the deliverable: put
        verification in deterministic math where it's auditable, put the LLM last where it can only
        phrase what's already been established, and make every stage's cost and confidence visible.
        That's the kind of pipeline I build.
      </p>
    </CsSection>
  </CaseStudyLayout>
);

export default CorroborateCaseStudy;
