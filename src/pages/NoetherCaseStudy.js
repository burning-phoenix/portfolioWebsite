import React, { useState } from 'react';
import CaseStudyLayout, { CsSection } from './CaseStudyLayout';
import NoetherPipeline from '../visuals/NoetherPipeline';
import GameOver from '../visuals/GameOver';
import OneDoor from '../visuals/OneDoor';
import ContextDivision from '../visuals/ContextDivision';
import MatcherCascade from '../visuals/MatcherCascade';
import FiveLayers from '../visuals/FiveLayers';

/* ------------------------------------------------------------------ */
/* Plain view — the default. Logic-infused natural language: every     */
/* claim earns the next one. No term appears before the reader has     */
/* a reason to want it.                                                */
/* ------------------------------------------------------------------ */

const PlainView = () => (
  <>
    <CsSection label="Problem statement">
      <p>
        To be useful, an AI coding assistant needs permission to change your files and run
        commands on your computer. But there is a tradeoff here which is easy to miss until its not,
        because the same permissions that let it fix your project can also wreck it. An AI doesn't
        have to be malicious to break things, maybe it hallucinated, or maybe its just plain 
        wrong, which is known to happen. Sometimes you are one misunderstanding away from it
        deleting something you worked the whole afternoon on.
      </p>
      <p>
        Most tools handle this with optimism. My stand on this is that the AI
        will, eventually, try to do something it shouldn't, its just a matter of time.
        Everything on this page follows from taking that one sentence seriously.
      </p>
      <GameOver />
    </CsSection>

    <CsSection label="Multi-agent synchrony">
      <p>
        Inside Noether, you have the option for three different AI workers, given the division of labor.
        The{' '}<strong>Planner</strong> reads your whole project and breaks your request into small,
        sharply defined tasks. The <strong>Coder</strong> takes one small task at a time and
        writes the code for it. The <strong>Explorer</strong> looks things up when the other
        two need context, so it can afford to really explore an issue, as long as it can be articulated. This also makes it easier to decide what responsibilities should each
        worker have instead of having an all-powerful agent.
      </p>
      <p>
        When any of them wants to act on the real world, like run a command or edit a file, the request
        goes through a fourth thing, a fixed sequence of six checkpoints designed to catch harmful actions. 
      </p>
      <OneDoor />
    </CsSection>

    <CsSection label="The Gatekeeper">
      <p>
        Check if the request is allowed, prepare it, get approval from the user, execute, save what's
        needed to undo it, and log it. Two details carry the weight: nothing moves until a human decides
        using the approval gate; and the writing-down happens even when the request is refused so we have
        a complete record. 
      </p>
      <NoetherPipeline />
    </CsSection>

    <CsSection label="autonomous loops">
      <p>
        This is a pre-emptive measure. When Noether works without you watching, in modes like autonomous
        Reason-Act-Observe, dangerous commands aren't blocked, they can't be formed at all. The AI doesn't
        type freely into a terminal, it can only assemble a command from the whitelisted options we already
        flagged as safe, like: list, show, search, find. In the auto loop, the agent can reason 
        about your files, decide where to look and how much to read, but it is not possible for the agent to edit
        or delete a file. This is a stylistic choice, based on how much fine-grained control over the agent 
        one wants, and how trusted the agent-harness combination is, but it definitely can be adjusted.
      </p>
    </CsSection>

    <CsSection label="Undo Mechanism">
      <p>
        Before Noether changes a file, it stores a complete copy of it. Undo doesn't try to
        reverse the edit, it simply puts the copy back. The benefit is dependable precision. The fair question
        is why git isn't enough. And this how I would answer that. Git protects the checkpoints you chose to make;
        an agent does its damage <em>between</em> them; in work you haven't committed yet, tangled into the same
        files as your own unfinished edits. Rolling back to your last commit throws your work out with the agent's
        mistake, and committing before each of an agent's fifty edits turns your history into noise. So
        Noether snapshots automatically, one entry per action, and <code>/undo</code> reverses
        exactly the agent's last move. Git remains what it should be: your history, written by you.
      </p>
    </CsSection>

    <CsSection label="How an AI Remembers">
      <p>
        To see why the next part matters, you need know how memory works in an LLM, please skip ahead if you already know this. 
        A good way to think about it is the following. Imagine a company where the person answering your emails is replaced before every single reply.
        The new person has never met you. The only reason the replies feel continuous is procedure: your entire correspondence, every email you sent,
        every reply you got, is kept in one case file, and each new employee must read the whole file, front to back, before they're allowed to write
        a word. Ask a quick follow-up question and the answer still requires a complete re-read of everything that ever happened. That file is the "context." 
        A language model remembers nothing between messages. Every time you press enter, the
        entire conversation meaning every message, and every answer it gave you is bundled up and sent again.
        The model re-reads all of it before writing the next word. The memory you experience is an illusion. The conversation doesn't just
        grow, it grows on top of itself.
      </p>
      <p>
        For chatting, this is harmless. For coding, it's brutal. Turn three pulls in 1,200 lines
        of code; every turn after re-reads those 1,200 lines whether they still matter or not.
        By turn ten the model is re-reading a small book to change one line, and a model
        paying attention to everything pays less attention to each thing.
      </p>
    </CsSection>

    <CsSection label="Why It Runs on an Ordinary Laptop">
      <p>
        Thinking and typing are priced differently. Planning needs a big model with a wide view of
        your project (so naturally, a bigger context window), but planning happens rarely. Writing a small, well-described piece of
        code doesn't need the big model at all: a small one can do it, even one running free on
        the laptop itself. When I use it, I usually go for GLM-5.2 as the planner, Gemma4 12 B (which can run without an API on your local computer) as the coder,
        and something like kimi-code-2.7 as the explorer. A very efficient yet effective setup. So Noether 
        splits the work, and then enforces the split: the task queue refuses any task too big for the small model,
        sending the Planner back to cut it finer. This serves two purposes at once, in breaking a bigger task into
        smaller sub-tasks forces the model to really think about what it is doing, and it keeps everything small
        enough for the coding model with a much smaller context window to execute. It's why Noether can offload a lot of token costs on an ordinary 16GB MacBook instead of a server.
      </p>
      <p>
        The deeper reason for the three workers is that the Planner never reads raw code, it reads reports.
        This might sound like a bad idea at first, but let's think about it. The Explorer takes the 1,200-line problem
        into a context of its own, reads everything there, and sends back three lines: what it found, where, and
        anything that looks like a red flag. The Coder takes one small brief, does the work,
        and reports done with the diff. The bulk is read at the edges and thrown away there;
        only what a decision needs travels up. So the Planner's context stays small,
        intentional and coherent across the whole session, and grows at a much smaller rate.
      </p>
      <ContextDivision />
    </CsSection>

    <CsSection label="What It Adds Up To">
      <p>
        Noether is about 14,000 lines of code, vetted by 207 tests. Our philosophy is that trust should be structural.
        LLMs are goal-directed systems, and it is appropriate to think of them as such when designing harnesses, or
        any software that works with them. This is the glue between the LLM and your computer, that glue is what I build. If you want the full technical
        version of this story, the <code>[ techify ]</code> button at the top of the page rewrites it in the trade's own words, and the code is on{' '}
        <a href="https://github.com/burning-phoenix/noether" target="_blank" rel="noopener noreferrer">GitHub</a>.
      </p>
    </CsSection>
  </>
);

/* ------------------------------------------------------------------ */
/* Tech view — the same story, recompiled for people who build these   */
/* systems. Mirrors the plain view's arc section-for-section, so the   */
/* [ techify ] toggle reads as a change of dialect, not of document.   */
/* ------------------------------------------------------------------ */

const TechView = () => (
  <>
    <CsSection label="Problem statement">
      <p>
        Agentic coding tools fail in one of two ways. Either context flooding, or hallucinations. So naturally, 
        I want to make a terminal editor with some division of labor, and a good starting point seemed like a large-context model plans, a cheap or local model writes
        the code, and every action either of them takes passes through an architecture designed to catch mis-formed or hallucinated instructions from the LLM. The result is Noether with ~14,000 lines of Python.
      </p>
      <p>
        Trust has to be structural since it your actual project directory, not a container. It has to
        generate code on an ordinary MacBook (memory-mapped GGUF weights), stay responsive while
        streaming LLM output into a Textual TUI (real threads, not asyncio), and
        leave a trail: every file an agent touches gets a record, an approval, and a way back.
      </p>
    </CsSection>

    <CsSection label="Unified pipeline">
      <p>
        Hard role boundaries. The <strong>Planner</strong> (128K-context API model) refines scope
        Socratically, decomposes work inferred through conversation into atomic tasks, and runs the autonomous
        Reason-Act-Observe loop. The <strong>Coder</strong> (a local model via llama-cpp-python,
        or an API model in fast mode) writes code from atomic task descriptions. 
        The stateless <strong>Explorer</strong> fetches context on demand. Underneath: a
        dependency-sorted task queue, local semantic search (code embeddings + embedded Qdrant,
        under 300MB RAM), tool schemas as Pydantic models, snapshot undo, and a JSONL tracer
        streamed live into the TUI. And at the center, the thing that makes the rest safe: one
        pipeline that every bash command and file operation must pass through. No agent talks to
        the filesystem without talking to the gatekeeper first.
      </p>
      <OneDoor />
    </CsSection>

    <CsSection label="The operation pipeline">
      <p>
        Early versions had what most agent codebases have: several places where model output could
        become a subprocess call or a file write, each with its own partial checks. So I seeked to standardize everything.
        I collapsed them into a single <code>OperationPipeline.execute()</code> with
        a fixed sequence; VALIDATE &rarr; PREPARE &rarr; APPROVE &rarr; EXECUTE &rarr; UNDO
        RECORD &rarr; CONTEXT UPDATE. Every operation appends a line to{' '}
        <code>.noether/audit.jsonl</code>, <em>including the rejected and the failed</em>.
        This introduces uniformity that the project was lacking in its early stages. One
        path means one place to validate, record undo, and for security audits.
      </p>
      <NoetherPipeline />
    </CsSection>

    <CsSection label="Containment by construction">
      <p>
        The autonomous loop's write commands aren't blocked, they can't be expressed. The
        read-only tool schema's <code>command</code> field is a Pydantic <code>Literal</code> over{' '}
        <code>ls</code>, <code>cat</code>, <code>grep</code>, <code>find</code>, <code>git</code>{' '}
        and a dozen other read-only binaries, so a write command fails schema validation before
        any policy code runs. Git is whitelisted by subcommand. <code>python -c</code> is refused
        outright. Validators kill path traversal and
        pin <code>cwd</code> to the project root. Chat mode gets a wider command set, and every
        one of those commands requires a human clicking an approval modal. This can obviously be fine-tuned for specific usecases.
      </p>
      <p>
        Below the schemas, commands execute only inside a sandbox runtime
        with network and filesystem restrictions, and there is deliberately no fallback to raw{' '}
        <code>subprocess</code>, no sandbox means bash fails loudly, which is good in this case. An
        independent filesystem layer blocks <code>.env</code>, keys, <code>.ssh/</code>, cloud
        credentials, and makes <code>.git/</code> read-only. A 30-second hard timeout bounds
        everything.
      </p>
      <FiveLayers />
    </CsSection>

    <CsSection label="Fuzzy edits that teach the model">
      <p>
        LLMs hallucinate whitespace and guess indentation, so exact-match search/replace fails
        constantly. <code>ContentMatcher</code> tries four layers in order: exact,
        whitespace-normalized, indentation-flexible, then difflib fuzzy at a 0.75 threshold,
        each tagged with a confidence the user sees in the approval modal ("fuzzy match,
        81%"), with the file's original indentation re-applied to the replacement. The part I'm
        proudest of is the failure path: when nothing matches, the pipeline returns the closest
        region found, its similarity score, line numbers, three lines of context, and an explicit
        instruction to copy the exact text so the model repairs its own edit on the next
        turn instead of flailing. One honest detail: the closest-match scan is O(n&sup2;), so
        files over 2,000 lines skip it, this could definitely be improved upon.
      </p>
      <MatcherCascade />
    </CsSection>

    <CsSection label="Snapshot undo">
      <p>
        I considered implementing undo by reversing search/replace operations, and rejected it considering the fragility of forward matching. Instead, every modification pushes
        the complete prior file content onto a thread-safe snapshot stack, <code>None</code>{' '}
        meaning "file didn't exist," so undoing a create is a delete. It costs memory, capped at
        50 entries, and buys certainty: sequential undos restore exact bytes with no matching step
        that can fail.

        The fair question
        is why git isn't enough. And this how I would answer that. Git protects the checkpoints you chose to make;
        an agent does its damage <em>between</em> them; in work you haven't committed yet, tangled into the same
        files as your own unfinished edits. Rolling back to your last commit throws your work out with the agent's
        mistake, and committing before each of an agent's fifty edits turns your history into noise. So
        Noether snapshots automatically, one entry per action, and <code>/undo</code> reverses
        exactly the agent's last move. Git remains what it should be: your history, written by you.

      </p>
    </CsSection>

    <CsSection label="Context economics">
      <p>
        The default failure mode that an agent transcript is
        append-only, so every file the model reads is re-tokenized into every subsequent call,
        relevance decaying while cost compounds. Noether's Planner is not exempt, its
        context grows too. The design just controls the rate, and what the growth is made of.
      </p>
      <p>
        Planner memory is structured, it is a sliding window of the last 10
        exchanges, system events truncated to 500 characters, command output capped at 1,500,
        task progress folded into a running summary. The Explorer is stateless and frugal by
        construction, <code>skim_file</code> returns definitions plus a few lines of
        context (full content only under 80 lines), <code>focused_read</code> greps to a target
        and extracts just that section &mdash; and what survives is an <code>ExploreReport</code>:
        summary, findings, recommendations. The Coder gets a self-contained brief; the
        orchestrator estimates context at ~4 characters per token and rejects any task over
        4,096, the Planner decomposes further, or the task never enters the queue. Queue
        order is a topological sort over dependencies with priority tie-breaking.
      </p>
      <p>
        The payoff is the design's economic point.
      </p>
      <ContextDivision />
    </CsSection>

    <CsSection label="Synchronous on purpose">
      <p>
        The least fashionable decision in the codebase: the pipeline is fully synchronous,{' '}
        <code>subprocess.run()</code>, not asyncio. Textual owns an event loop on the main thread,
        LLM calls live in worker threads, and a pipeline callable from both contexts cannot own a
        loop without nested-loop collisions. The TUI got stable the same way: every agent-to-UI
        mutation rides Textual's message bus, because widget queries from worker threads and{' '}
        <code>push_screen_wait()</code> are race conditions waiting to fire &mdash; approvals use{' '}
        <code>push_screen</code> plus a <code>threading.Event</code> with a 60s timeout.
      </p>
    </CsSection>

    <CsSection label="Results">
      <p>
        It works end to end: scope a project conversationally, <code>/confirm</code> into a
        dependency-ordered queue, watch the Coder stream implementations through batch approval,{' '}
        <code>/auto</code> a read-only investigation, <code>/undo</code> anything. 207 unit and
        integration tests cover the sandbox, executor, matcher, undo stack, parsers, memory, and
        orchestration. Every run is observable, per-span traces rendered live in the TUI,
        plus the persistent audit log. A new API provider is a
        registry entry; a new tool is a Pydantic model that auto-converts to function-calling
        JSON.
      </p>
    </CsSection>

    <CsSection label="What I'd Do Differently">
      <p>
        The honest weak point is retrieval. Noether embeds only the first 4,000 characters of each
        file, no structural chunking, exactly the limitation that became my follow-up
        project, <a href="https://github.com/burning-phoenix/code-rag" target="_blank" rel="noopener noreferrer">code-rag</a>, where I built AST-aware
        chunking and measured whether it works. And undo has a limitation, it restores files, not the world, a bash
        command's side effects, a package installed or a migration run, aren't
        snapshot-restorable, which is exactly why commands face the approval modal instead.
        Extending undo toward command effects is the ambitious version of that fix.
      </p>
    </CsSection>
  </>
);

const NoetherCaseStudy = () => {
  const [view, setView] = useState('plain');

  return (
    <CaseStudyLayout
      title="Noether"
      subtitle={
        view === 'plain'
          ? 'LLM harness with divison of labor and security.'
          : 'LLM harness with divison of labor and security.'
      }
      meta={
        <>
          Open-source (GPL-3.0) &middot;{' '}
          <a href="https://github.com/burning-phoenix/noether" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </>
      }
      theme="noether"
      view={view}
      onToggleView={() => setView(view === 'plain' ? 'tech' : 'plain')}
    >
      {view === 'plain' ? <PlainView /> : <TechView />}
    </CaseStudyLayout>
  );
};

export default NoetherCaseStudy;
