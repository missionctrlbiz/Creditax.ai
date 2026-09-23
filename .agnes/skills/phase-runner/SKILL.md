---
name: phase-runner
description: 'Run one creditax-ai build phase: work the items, verify, independent review gate, update STATE.json, and chain the next scheduled task. Use when a scheduled task or the user says "run phase <id>", "advance phase runner", or "phase runner watchdog". Do not use for one-off fixes unrelated to STATE.json.'
metadata:
  argument-hint: run <phase-id> | advance | watchdog
---

# Phase Runner (creditax-ai)

Arguments ($ARGUMENTS): one of `run <phase-id>`, `advance`, `watchdog`. If empty, act as `advance`.

## Toolchain rules (non-negotiable)

- Use `/usr/local/bin/node` (v20.16.0) and system npm. NEVER the app `node`/`npx` shims in /Applications/AgnesCode.app — they are broken (write /tmp/mcp.log under sandbox, exit at `set -e` before reaching node).
- Any command needing network (npm install, registry fetches) must be a shell call with the network flag set true.
- Write only inside the project directory or `.agnes/work/`. /tmp and home are not writable.
- Never commit secrets.

## Shared state

- `progress/STATE.json` — single source of truth. Always re-read it first; never trust the prompt.
- `progress/CHANGELOG.md` — append one line per run: `date — phase — verdict — notes`.
- `.agnes/work/sessions/` — write `YYYY-MM-DD-<phase>-<attempt>.md` session log: what was implemented, decisions, remaining items.
- Read `research/project-roadmap.md` and AGENTS.md for phase definitions before working.

## Mode: run <phase-id> / advance

1. Read STATE.json. Find the phase (the one named in args, or `current_phase` for `advance`).
   - If its status is `reviewed_pass` and a next phase exists in the `order` array: set current_phase to the next, set it `in_progress`, write STATE.json, then jump to step 2 with the new phase.
   - If it is `blocked`: STOP. Do not re-run. Report to user what was written to progress/BLOCKED-<phase>.md.
   - If no phase remains: report the chain complete, stop.
2. **Work loop** (up to 3 passes within this session):
   - Implement the todo items of the phase from the roadmap Feature List (P0 first, P1 if time), updating STATE.json `items` as each becomes `done`.
   - Verify: `npm run build` and `npm run lint` via `/usr/local/bin/node` (there is no `test` script yet; if one is added, run it too). Use the network flag on any shell call that reaches the registry.
   - Self-check every entry in `exit_criteria`. All green → proceed to review. Failing after 3 passes → write failure note, set status `in_progress`, attempts+1, update `last_updated`, schedule a retry one-shot task (~45 min out, same skill `run <phase>`), stop this run.
3. **Review gate — independent, never the worker grading itself**:
   - `delegate` an ad-hoc subagent with these instructions: "Read progress/STATE.json phase <id>, research/project-roadmap.md, and the code in src/. Verify each exit criterion of phase <id> against the actual code. Run the typecheck/build/test commands if needed. Return JSON: {verdict: pass|fail, reasons: [...], remaining_items: [...]}."
   - PASS → set phase status `reviewed_pass`, store `last_review`, append changelog, commit the phase work (`git add -A && git commit -m "phase: <id> — reviewed pass"`), then create the next one-shot scheduled task (~5 min out): title `phase-<next-id>`, prompt `Use the phase-runner skill with arguments: advance.`, new_session, project_dir = this repo.
   - FAIL → same as work-loop failure (attempts+1; if attempts reaches 3: status `blocked`, write progress/BLOCKED-<phase>.md with all verdicts + session logs summary, create a one-shot task that writes progress/ESCALATE notice, STOP the chain).
4. Always end by updating STATE.json `last_updated` and writing the session log.

## Mode: watchdog

- Read STATE.json. If current phase is `in_progress` and `last_updated` is older than 3 hours, resume by acting as `advance` (stale session crashed).
- If current phase is `blocked`, verify the BLOCKED doc exists, then stop and surface it.
- If everything is `reviewed_pass`, stop and report chain complete.
- Never schedule new tasks from watchdog; it only resumes or reports.

## Hard stops

- 3 failed attempts → hard stop with escalation doc; no further retries without human input.
- Verification commands that need secrets/credentials you do not have: write what is missing to the session log, mark the phase `blocked`, stop. Do not fabricate results.
