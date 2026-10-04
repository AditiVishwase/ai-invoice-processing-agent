# AI Invoice Processing Agent

Workshop MVP for reviewing invoices through AI extraction, validation, maker review, checker approval, and a mock SAP/ERP export. The demo does not execute payments or connect to a live ERP.

## Project layout

- `frontend/`: React, TypeScript, and Vite application.
- `backend/`: FastAPI application and replaceable provider contracts.
- `docs/PRD.md`: approved product requirements and technical specification.
- `.agents/skills/`: Software Factory skills used by repository agents.

## Requirements

- Node.js 22.12 or newer.
- Python 3.11 or newer.

## Local setup

From the repository root in PowerShell:

```powershell
npm --prefix frontend ci
# Use a Python 3.11+ interpreter to create the virtual environment.
python -m venv .venv
.\.venv\Scripts\python -m pip install -e "backend[dev]"
Copy-Item .env.example .env
```

If `python` resolves to an MSYS installation in PowerShell, use an installed native Windows Python instead. For example: `& "$env:LOCALAPPDATA\Programs\Python\Python313\python.exe" -m venv .venv`.

Start the API and frontend in separate terminals:

```powershell
.\.venv\Scripts\python -m uvicorn app.main:app --app-dir backend --env-file .env --reload
```

```powershell
npm --prefix frontend run dev
```

The frontend runs at `http://127.0.0.1:5173`. The API health endpoint is `http://127.0.0.1:8000/api/v1/health`.

## Checks

```powershell
npm --prefix frontend run typecheck
npm --prefix frontend run build
.\.venv\Scripts\python -m pytest backend/tests
```

## Current implementation scope

The application shell, Overview page, workflow navigation, Copilot panel shell, API health endpoint, and provider contracts are in place. Invoice processing, persistence models, human approval actions, ERP transactions, and AI responses are not implemented yet.

Use synthetic invoice data only. Configure provider credentials through local environment variables when an extraction provider is selected. Do not add real ERP credentials or payment execution.
