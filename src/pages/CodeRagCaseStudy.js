import React from 'react';
import { Link } from 'react-router-dom';
import CaseStudyLayout, { CsSection } from './CaseStudyLayout';

const CodeRagCaseStudy = () => (
  <CaseStudyLayout
    title="code-rag"
    subtitle="Retrieval for coding agents that I can prove works."
    meta={
      <>
        Open-source (LGPL-2.1) &middot;{' '}
        <a href="https://github.com/burning-phoenix/code-rag" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </>
    }
  >
    <CsSection label="The Problem">
      <p>
        LLM coding assistants are only as good as the context you feed them, and most RAG-over-code
        setups feed them garbage: fixed-size chunks that split functions mid-body, retrieval that
        surfaces a 40-line window when the answer is a 6-line method, and no way to know whether
        any of it works beyond eyeballing a few queries. I was using Claude Code against a research
        codebase mixing Python, Lean proofs, and math-heavy papers, and I wanted retrieval the
        agent could trust &mdash; with evidence, not vibes. So I set two goals: build an MCP
        retrieval server good enough to use daily, and build the evaluation harness that would tell
        me the truth about it.
      </p>
    </CsSection>

    <CsSection label="Constraints">
      <p>
        It had to run per-project and locally (isolated Qdrant container per codebase, config
        scaffolded by one <code>init</code> command), speak MCP over stdio so Claude Code discovers
        it with zero glue, handle 11 languages plus markdown and Lean, and stay cheap enough that
        optional LLM enrichment didn't blow up ingest cost. And the evaluation had to be honest
        &mdash; designed so I couldn't accidentally flatter my own system.
      </p>
    </CsSection>

    <CsSection label="Approach">
      <p>
        The pipeline: an extension-dispatched chunker registry (stdlib <code>ast</code> for Python,
        tree-sitter for ten other languages, declaration-level for Lean, section-level for
        markdown) &rarr; a static concept&rarr;file/line pointer index &rarr; optional batched LLM
        enrichment (summaries + hypothetical questions) &rarr; 4096-d Qwen3 embeddings &rarr;
        Qdrant. The server exposes three tools: <code>search_documents</code> (semantic search with
        a math-density filter), <code>search_code</code> (a retrieved method also returns its
        parent class for context), and <code>lookup_index</code> (exact, embedding-free concept
        lookup &mdash; a zero-hallucination fallback). All orchestrators depend on{' '}
        <code>typing.Protocol</code> interfaces, so tests inject fakes and CI runs hermetically
        &mdash; no network, no Docker.
      </p>
      {/* anime.js visual-aid slot: ingest pipeline / chunking comparison */}
      <div className="cs-visual" data-visual="code-rag-pipeline" />
    </CsSection>

    <CsSection label="Decisions That Mattered">
      <p>
        <strong>Designing metrics I couldn't game.</strong> Standard overlap-based recall has a
        failure mode: bigger chunks overlap more gold lines without being more useful &mdash; one
        whole-file chunk scores recall &asymp; 1. So alongside recall@k, NDCG, and MRR, I added{' '}
        <strong>line-range IoU@k</strong> (how tightly retrieval bounds the answer) and report{' '}
        <strong>chunk geometry</strong> so a config can't win by coarseness alone. This paid off
        immediately, because my own data delivered an uncomfortable result: on raw decisive-span
        recall@10, naive line windows <em>tied</em> plain AST chunking (0.722 vs 0.722). If recall
        were my only metric, I'd have concluded AST chunking was pointless. The IoU tables told the
        real story: on Python, AST chunks localize the answer{' '}
        <strong>2.6&times; more precisely</strong> than line windows (IoU@5 of 0.458 vs 0.176)
        &mdash; the difference between handing an agent the exact method and handing it a 40-line
        window the method happens to sit in.
      </p>
      {/* anime.js visual-aid slot: IoU localization comparison */}
      <div className="cs-visual" data-visual="code-rag-iou" />
      <p>
        <strong>Measuring enrichment instead of assuming it.</strong> LLM enrichment (batched
        summaries + hypothetical questions, appended to the embedding text) is a popular technique
        that's rarely quantified. My three-way ablation (AST+enrich / AST / line-based) over 100
        hand-written queries showed it's a clear win <strong>for code</strong> &mdash; on Python,
        decisive-span recall rose at every k, from +24% relative at k=3 (0.477 &rarr; 0.591) and
        +32% at k=5, tapering to +11% at k=10 &mdash; but{' '}
        <strong>neutral-to-negative on prose</strong>, where plain AST already hit 0.907 recall@10
        on markdown. That's an evidence-backed operational default (enrich code, skip prose) that
        also cuts LLM cost &mdash; the kind of finding you only get by measuring. One
        methodological rule I held: the golden dataset is hand-written, never LLM-generated,
        because LLM-authored queries would share phrasing with LLM-authored summaries and bias the
        enrichment ablation in its own favor.
      </p>
      <p>
        <strong>One home for chunk identity.</strong> Early on I hit the classic re-ingest bug
        class: edit a file, line ranges shift, and stale vectors linger as orphans. My fix was
        structural &mdash; a single <code>point_id()</code> function keyed on the corpus-relative
        path (so same-named files in different folders can't collide), and an incremental sync
        where the <em>policy</em> (per-file delete-then-upsert, prune vanished files) lives in the
        orchestrator while the store only exposes delete/list primitives. Identity rules that live
        in one place can't drift between implementations.
      </p>
      <p>
        <strong>Refusing to trust the LLM's ordering.</strong> Enrichment parses batched JSON, and
        the tempting shortcut is to align summaries to chunks by position. I made the parser demand
        ids exactly 1..n and treat anything else as a parse failure &mdash; because a silently
        misaligned batch attaches the <em>wrong summary to the wrong code</em>, which is worse than
        no summary. Failures route through retry-with-error-feedback, then a per-chunk fallback.
        The failure mode I optimized against was silent corruption, not visible errors.
      </p>
      <p>
        <strong>A version pin with a story.</strong> CI broke on Python 3.12 but not 3.11 because
        tree-sitter's <code>parse()</code> API flipped from bytes to str after 0.25.2 and the two
        interpreters resolved different wheels. The pin in <code>pyproject.toml</code> carries a
        comment explaining exactly why &mdash; future-me (or a contributor) should never have to
        rediscover that.
      </p>
    </CsSection>

    <CsSection label="Results">
      <ul>
        <li>
          <strong>Retrieval quality, measured:</strong> 100 hand-labeled queries, 165 graded spans
          (decisive/supportive), span-level recall@k, NDCG@k (span-coverage, capped &le; 1), MRR,
          line-range IoU, across a three-way chunking ablation. Best config (AST + enrichment):{' '}
          <strong>0.762 decisive recall@10, 0.890 hit rate</strong>, with per-content-type
          breakdowns and stated caveats (per-type samples are small; I treat deltas under 0.05 as
          noise).
        </li>
        <li>
          <strong>Localization:</strong> AST chunking delivers{' '}
          <strong>~2.6&times; tighter answer localization</strong> than line windows on code
          (Python IoU@5: 0.458 vs 0.176).
        </li>
        <li>
          <strong>Enrichment, quantified:</strong> +24% to +32% relative recall lift on Python at
          low k; no benefit on prose &mdash; now a documented, evidence-backed default.
        </li>
        <li>
          <strong>Engineering hygiene:</strong> 117 unit tests (hermetic &mdash; fakes for
          embeddings/vector store/LLM), snapshot tests pinning chunker output, <code>mypy</code>{' '}
          with <code>disallow_untyped_defs</code>, ruff (including blind-except linting), and a
          3.11/3.12 CI matrix where all gates must pass. The eval report is generated from the run,
          so the numbers in <code>REPORT.md</code> can't go stale.
        </li>
        <li>
          <strong>In daily use</strong> as the retrieval layer for Claude Code on my own research
          projects; adding a language is one small file plus one registry line.
        </li>
      </ul>
    </CsSection>

    <CsSection label="What I'd Do Differently">
      <p>
        The honest gaps are on my roadmap: bootstrap confidence intervals so small per-type deltas
        come with error bars; ~50 queries per content type for real statistical power; token-aware
        matching for <code>lookup_index</code> (substring matching under-serves natural-language
        queries); and making the enrich-code-skip-prose finding the config default. I'd also add
        mocked-HTTP tests for the provider retry paths, which today are only exercised live.
      </p>
      <p>
        This project began as the answer to a limitation I shipped in{' '}
        <Link to="/case-studies/noether">Noether</Link>, whose semantic search had no structural
        chunking &mdash; the follow-through matters as much as the finding.
      </p>
    </CsSection>

    <CsSection label="If This Looks Like Your Problem">
      <p>
        If you're shipping RAG &mdash; over code, docs, or anything else &mdash; and you can't
        currently answer "how good is our retrieval, and which of our techniques actually pay for
        themselves?", this is exactly the work I do: build the pipeline, build the golden dataset
        and metrics around it, run the ablations, and hand you defaults backed by numbers instead
        of folklore.
      </p>
    </CsSection>
  </CaseStudyLayout>
);

export default CodeRagCaseStudy;
