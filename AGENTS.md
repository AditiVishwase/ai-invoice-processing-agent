# Agent workflow

Use this workflow for every feature, fix, and maintenance task in this repository. Do not build directly on `main`.

## Workflow

1. **Isolate** with the `new-feature` skill. Fetch `origin`, check for uncommitted work and overlapping open PRs, then create a uniquely named task worktree from `origin/main` on a `codex/<task-name>` branch. Keep the worktree until the PR is merged or closed.
2. **Build** with the `code-structure` skill. Keep domain decisions and orchestration at the action or boundary layer. Put reusable provider, storage, parsing, and other operational mechanics in explicit-input services that return structured results. Avoid extracting one-off logic.
3. **Prove** with `evidence-driven-testing`. Discover and run the repository checks once they exist. Verify behavior with runtime evidence. For bug fixes, capture the failing behavior before changing it when practical. Never expose invoice content, credentials, tokens, or payment details in evidence.
4. **Ship** with `before-and-after` for user-visible changes, then `greploop` for ordinary PRs. Use `greploop-apps` only when Greptile rejects a PR because it exceeds the regular file-count limit. Include evidence and test results in the PR description. Do not merge unless explicitly asked.

Apply `unslop` to text written or changed for people, including documentation, comments, commit messages, PR titles and descriptions, and the final reply.

## Repository rules

- Never commit directly to `main` or force-push. If a pushed branch needs rewriting, use `--force-with-lease` only on the task's own branch.
- Use one worktree and branch per task. Do not reuse another agent's branch or worktree. Check open PR file overlap and shared-checkout changes before starting; stop and ask for direction if they conflict.
- Regenerate lockfiles when resolving dependency conflicts. Do not hand-merge them.
- Protect invoice and vendor data. Keep secrets out of source, logs, screenshots, recordings, and test evidence. Use synthetic or redacted fixtures.
- Preserve exact monetary values, currency, and source provenance when handling invoice data. Do not silently guess missing or ambiguous extracted fields.
- Keep domain policy, authorization, state transitions, and failure classification in orchestration code. Services own reusable mechanics and must not directly mutate domain state.
- Do not run schema experiments against a shared database. Confirm that a development server belongs to the current task before trusting its output.

## Project checks and environment

- Runtime: Node.js 22.12+ for the frontend and Python 3.11+ for the backend.
- Install frontend dependencies with `npm --prefix frontend ci`.
- Create a local Python environment with `python -m venv .venv`, then install backend dependencies with `\.venv\Scripts\python -m pip install -e "backend[dev]"` in PowerShell.
- If PowerShell's `python` resolves to an MSYS installation, use a native Windows Python 3.11+ interpreter for venv creation.
- Start the API with `\.venv\Scripts\python -m uvicorn app.main:app --app-dir backend --env-file .env --reload` and the frontend with `npm --prefix frontend run dev`.
- Checks: `npm --prefix frontend run typecheck`, `npm --prefix frontend run build`, and `\.venv\Scripts\python -m pytest backend/tests`.
- The workshop application currently has an Overview shell, placeholder workflow routes, a Copilot panel shell, an API health route, and provider contracts. Invoice workflow behavior, database persistence, and external provider integrations are not yet implemented.
- No external integration services are configured. ERP remains a mock-only target; use synthetic documents and keep credentials in local environment configuration.
- Update these commands and limits when implementation adds dependencies, checks, or local services. Do not claim checks passed unless they were run.

## Completing a task

1. Keep changes within the assigned scope.
2. Run the documented checks and gather behavior evidence.
3. Review the diff and evidence for accidental invoice data or secrets.
4. Commit with a clear message, rebase onto the latest `origin/main`, and rerun checks.
5. Push the task branch and open a PR. Explain changes, evidence, risks, and follow-up work in the description.
6. Run the applicable Greptile loop until it reports 5/5 confidence with no unresolved comments, or report why it could not complete.
7. Present the PR URL. Do not merge unless explicitly asked.
