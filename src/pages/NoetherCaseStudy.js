import React from 'react';
import { Link } from 'react-router-dom';
import CaseStudyLayout, { CsSection } from './CaseStudyLayout';

const NoetherCaseStudy = () => (
  <CaseStudyLayout
    title="Noether"
    subtitle="A multi-agent code editor built on the assumption that the LLM will misbehave."
    meta={
      <>
        Open-source (GPL-3.0) &middot;{' '}
        <a href="https://github.com/burning-phoenix/noether" target="_blank" rel="noopener noreferrer">
          GitHub
        </a>
      </>
    }
  >
    <CsSection label="The Problem">
      <p>
        Agentic coding tools have two failure modes, and most tools pick one. Either they're
        economically constrained &mdash; every token of planning, generation, and exploration goes
        through one expensive frontier model &mdash; or they're safety-naive: an LLM with shell
        access running inside your real project directory, where "clean up the temp files" is one
        hallucination away from <code>rm -rf .</code>. I wanted to build a coding agent that took
        both problems seriously: a terminal editor where a large-context model plans, a cheap (or
        free, local) model generates, and <em>every</em> action the system can take flows through a
        security architecture designed for a component that lies. Noether is ~14,000 lines of
        source and my most architecturally demanding project &mdash; the hard parts weren't the
        agents, they were the guarantees around them.
      </p>
    </CsSection>

    <CsSection label="Constraints">
      <p>
        Noether runs in your actual project directory &mdash; not a container, not a copy &mdash;
        which means the trust question can't be outsourced. It had to run on modest hardware (code
        generation on an 8GB M1 Mac via memory-mapped GGUF weights), stay responsive (a Textual TUI
        with streaming LLM output means real multithreading, not asyncio hand-waving), and remain
        auditable: if an agent touched a file, there had to be a record, an approval, and a way
        back.
      </p>
    </CsSection>

    <CsSection label="Approach">
      <p>
        Three agents with hard role boundaries: a <strong>Planner</strong> (128K-context API model)
        that does Socratic scope refinement, decomposes work into atomic tasks, and runs an
        autonomous Reason-Act-Observe loop; a <strong>Coder</strong> (local Qwen3-Coder-30B via
        llama-cpp-python, or an API model in fast mode) that only generates code from atomic task
        descriptions; and a stateless <strong>Explorer</strong> that gathers codebase context on
        demand. Around them: a task queue with dependency-aware topological sort, local semantic
        search (jina-embeddings-v2-base-code + embedded Qdrant, under 300MB RAM), a native
        tool-calling layer built from Pydantic schemas, snapshot-based undo, a custom JSONL tracer
        streamed live into the TUI, and &mdash; at the center &mdash; one pipeline through which
        every bash command and file operation must pass.
      </p>
      {/* anime.js visual-aid slot: three-agent architecture / pipeline flow */}
      <div className="cs-visual" data-visual="noether-architecture" />
    </CsSection>

    <CsSection label="Decisions That Mattered">
      <p>
        <strong>One path, not five.</strong> Early versions had what most agent codebases have:
        several places where an LLM output could become a subprocess call or a file write, each
        with its own partial checks. That's unreviewable &mdash; you can't reason about safety
        across five code paths. I collapsed everything into a single{' '}
        <code>OperationPipeline.execute()</code> with a fixed sequence &mdash; VALIDATE &rarr;
        PREPARE &rarr; APPROVE &rarr; EXECUTE &rarr; UNDO RECORD &rarr; CONTEXT UPDATE &mdash; and
        made "all operations go through the pipeline" the one non-negotiable rule in
        CONTRIBUTING.md. Six operation types, three approval policies (always / never / batch), and
        an append-only <code>.noether/audit.jsonl</code> entry for every operation{' '}
        <em>including the rejected and failed ones</em>. One place to validate means one place to
        audit, one place to record undo, and one place a security reviewer has to read.
      </p>
      {/* anime.js visual-aid slot: pipeline stage sequence */}
      <div className="cs-visual" data-visual="noether-pipeline" />
      <p>
        <strong>Make dangerous actions unrepresentable, not filtered.</strong> The autonomous loop
        doesn't have write commands <em>blocked</em> &mdash; it has them made unexpressible. Tool
        schemas are Pydantic models, and the read-only schema's <code>command</code> field is a{' '}
        <code>Literal</code> over <code>ls</code>, <code>cat</code>, <code>grep</code>,{' '}
        <code>find</code>, <code>git</code>, and a dozen other read-only binaries; a write command
        fails schema validation before any policy code runs. Git gets a subcommand whitelist
        (<code>status</code>, <code>log</code>, <code>diff</code>, ...), <code>python -c</code> is
        rejected to close the inline-execution escape hatch, and validators block path-traversal
        patterns and confine <code>cwd</code> to the project root. The chat path gets a fuller
        command set &mdash; but every one of those requires a human clicking an approval modal.
        Below the schemas sits process-level isolation: commands execute exclusively through a
        sandbox runtime with network and filesystem restrictions, and there is deliberately{' '}
        <strong>no fallback</strong> to raw <code>subprocess</code> shell execution &mdash; if the
        sandbox isn't installed, bash commands fail loudly rather than degrade quietly. A
        filesystem sandbox layer independently blocks <code>.env</code>, keys, <code>.ssh/</code>,
        cloud credentials, and makes <code>.git/</code> read-only, and a 30-second hard timeout
        bounds every command. Five layers, because each one assumes the layer above it will someday
        be wrong.
      </p>
      {/* anime.js visual-aid slot: five defense layers */}
      <div className="cs-visual" data-visual="noether-layers" />
      <p>
        <strong>Tolerate the LLM's imprecision &mdash; then teach it.</strong> LLMs hallucinate
        whitespace and guess indentation, so exact-match search/replace editing fails constantly.
        My <code>ContentMatcher</code> tries four layers in order &mdash; exact,
        whitespace-normalized, indentation-flexible, then difflib fuzzy at a 0.75 threshold &mdash;
        each tagged with a confidence that's shown to the user in the approval modal ("fuzzy match,
        81%"), with the original file's indentation re-applied to the replacement. The part I'm
        most pleased with is the <em>failure</em> path: when no layer matches, the pipeline returns
        structured feedback &mdash; the closest region found, its similarity score, line numbers,
        three lines of surrounding context, and an explicit instruction to copy the exact text
        &mdash; so the model can repair its own edit on the next turn instead of flailing. One
        honest engineering detail: the closest-match scan is O(n&sup2;), so it's skipped on files
        over 2,000 lines to keep the UI from freezing &mdash; a documented trade of feedback
        quality for responsiveness.
      </p>
      <p>
        <strong>Undo means undo.</strong> I initially considered reversing search/replace
        operations to implement undo, and rejected it: reversal inherits every fragility of forward
        matching. Instead every modification pushes the <em>complete prior file content</em> onto a
        thread-safe snapshot stack (<code>None</code> meaning "file didn't exist," so undoing a
        create is a delete). It costs memory &mdash; capped at 50 entries &mdash; and buys
        certainty: sequential undos restore exact bytes, every time, with no matching step that can
        fail.
      </p>
      <p>
        <strong>Synchronous as a concurrency strategy.</strong> The least fashionable decision in
        the codebase: the pipeline is fully synchronous &mdash; <code>subprocess.run()</code>, not
        asyncio. Textual runs an async loop on the main thread while all LLM calls live in worker
        threads, and a pipeline that must be callable from both contexts cannot itself own an event
        loop without nested-loop collisions. The TUI's stability came from the same discipline: I
        migrated every agent-to-UI mutation onto Textual's native message bus after learning the
        hard way that widget queries from worker threads and <code>push_screen_wait()</code> are
        race conditions waiting to fire (approvals now use <code>push_screen</code> plus a{' '}
        <code>threading.Event</code> with a 60s timeout). Those hard-won rules are codified as five
        numbered laws in ARCHITECTURE.md so contributors don't rediscover them.
      </p>
      <p>
        <strong>Economics enforced at the queue.</strong> The planner/coder split only works if
        tasks actually fit the small model, so the orchestrator <em>rejects</em> any task whose
        estimated context exceeds the coder's 4,096-token budget &mdash; forcing the Planner to
        decompose further rather than letting an oversized task fail downstream. Queue ordering is
        a topological sort over task dependencies with priority tie-breaking. The result is the
        economic point of the whole design: planning happens once in a 128K-context model,
        generation happens in a model that costs ~$0.27 per million tokens on the API &mdash; or
        nothing at all, locally, with weights memory-mapped from SSD so a 30B model fits alongside
        8GB of RAM.
      </p>
    </CsSection>

    <CsSection label="Results">
      <p>
        The system works end to end: scope a project conversationally, <code>/confirm</code> into a
        dependency-ordered task queue, watch the coder stream implementations through batch
        approval, <code>/auto</code> a read-only investigation, <code>/undo</code> anything. It's
        guarded by <strong>207 unit and integration tests</strong> across the sandbox, executor,
        matcher, undo stack, parsers, memory, and orchestration; observable through per-span traces
        (custom tracer, no external observability dependency) rendered live in the TUI plus a
        persistent audit log; and extensible by design &mdash; adding an API provider is a registry
        entry, adding a tool is a Pydantic model that auto-converts to function-calling JSON.
      </p>
    </CsSection>

    <CsSection label="What I'd Do Differently">
      <p>
        The honest weak point is retrieval: Noether's semantic search embeds only the first 4,000
        characters of each file &mdash; no structural chunking &mdash; which is exactly the
        limitation that motivated my follow-up project,{' '}
        <Link to="/case-studies/code-rag">code-rag</Link>, where I built AST-aware chunking and a
        measured evaluation of it. Coder task allocation is the other frontier &mdash; the
        decomposition-to-generation handoff is where the largest quality gains remain, and
        ARCHITECTURE.md says so out loud. And a legacy async execution path still exists behind the
        pipeline; retiring it would make the "one path" claim true without the footnote.
      </p>
    </CsSection>

    <CsSection label="If This Looks Like Your Problem">
      <p>
        If you're putting an LLM anywhere near production systems, real filesystems, or shell
        access, the interesting work isn't the agent &mdash; it's the pipeline, the schemas, the
        approvals, and the undo. That containment layer is what I build: agent systems designed
        from the premise that the model will eventually do the wrong thing, engineered so that when
        it does, nothing irreversible happens.
      </p>
    </CsSection>
  </CaseStudyLayout>
);

export default NoetherCaseStudy;
