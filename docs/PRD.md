# AI invoice processing agent

## Product requirements and technical specification

**Status:** Approved for implementation

**Product stage:** Workshop MVP and guided demo

**Scope boundary:** Demonstrate invoice capture through approval and a mock SAP/ERP export. Do not execute payments or connect to a live ERP.

## 1. Product summary

The AI Invoice Processing Agent takes an invoice associated with a purchase order through document extraction, deterministic validation, maker review, checker approval, and a simulated SAP/ERP export. The interface makes each handoff visible, shows the extracted values and their evidence, and records decisions in an audit trail.

This is an end-to-end workflow demo. OCR or model extraction is one stage, not the product by itself. People remain responsible for the maker and checker decisions.

## 2. Problem and objectives

Accounts payable staff need to turn supplier invoices into reviewable records and route them for approval. The demo should show how AI can reduce manual entry while preserving human control over exceptions and approvals.

The MVP must:

- Show an invoice moving through the complete workshop demo flow.
- Extract invoice header and line-item data from an invoice document with an AI model.
- Show field-level confidence and source evidence so a reviewer can check model output.
- Compare invoice values to the associated purchase order and apply deterministic arithmetic and completeness checks.
- Require a maker review followed by a distinct checker approval.
- Represent the final SAP/ERP request and response using a local mock integration.
- Keep a readable, append-only record of processing, edits, decisions, and export activity.
- Offer a context-aware AI Copilot from the interface.
- Keep extraction and storage behind replaceable provider interfaces.

## 3. Non-goals

- Payment initiation, bank connectivity, payment scheduling, or remittance.
- A live SAP or other ERP connection.
- Production-grade accounting, tax, compliance, or fraud determinations.
- Autonomous approval. AI may extract, summarize, and flag; it must not approve, sign, or export on a person's behalf.
- Multi-tenant SaaS, general-purpose workflow configuration, or a vendor onboarding product.
- Training or fine-tuning a model on workshop data.
- A general-purpose chatbot, external web search, or Copilot actions that mutate invoice state.

## 4. Users and roles

| Role | Purpose | Allowed actions |
|---|---|---|
| AP Maker | Reviews the AI result and resolves ordinary extraction issues. | Start processing for an inbox item; inspect evidence and validation; edit extracted fields with a reason; approve the record for checker review; return it for reprocessing or mark it rejected with a reason. |
| AP Checker | Independently checks maker-reviewed data and records final approval. | Inspect invoice, PO, extraction evidence, validation, maker edits, and audit history; approve or reject/return with a reason; trigger the mock ERP export after approval. |
| Demo operator | Runs the workshop scenario and chooses the active demo persona. | Reset or seed demo records and switch between named demo users. This role is a demo convenience, not production identity administration. |

Maker and checker must be distinct identities for the same invoice. The demo must enforce that separation in server-side workflow rules, even if authentication uses seeded demo accounts.

### Access rules

- A maker cannot perform checker approval on an invoice they reviewed.
- Only an invoice in `AWAITING_CHECKER` can be checker-approved.
- Only an invoice in `APPROVED` can be exported.
- Copilot is read-only and cannot submit, approve, reject, or export.
- Role identity and authorization are checked by the API, not only hidden in the UI.

## 5. Complete user workflow

1. **Overview.** The user sees the workflow steps and a short explanation of the maker/checker controls. Selecting **Start demo** opens the inbox.
2. **Inbox.** The user sees seeded purchase orders and their associated invoices, a small status summary, and the action to start AI processing. Selecting an invoice opens its detail and starts processing.
3. **AI processing.** The app records a processing run, extracts document text/fields, associates fields with page evidence and confidence, normalizes the values, and runs deterministic validation against the purchase order. A visible progress view shows stage changes. On completion, the app automatically navigates to validation/review. The extracted values remain reviewable if validation finds issues.
4. **Maker review.** The maker checks the invoice preview alongside extracted fields, PO comparison, confidence, and validation messages. The maker may correct values and enter a reason. The maker approves the data for checker review, returns it for another processing attempt, or rejects it with a reason.
5. **Checker approval.** A different demo user opens the checker queue. The checker sees the original values, maker changes and reasons, validation outcome, and audit history. The checker records approval or returns/rejects the invoice with a reason. Approval captures an electronic sign-off record for the demo.
6. **ERP export.** The approved invoice is sent to the local SAP/ERP mock adapter. The UI displays the request summary and mock response, including a simulated ERP document identifier. A repeated export request must not create a second ERP document for the same invoice version.
7. **Audit trail.** The user can inspect timestamped events for the invoice, including extraction, edits, maker/checker decisions, export request, and export response.
8. **AI Copilot.** At any stage, the user may open Copilot for a concise explanation of the current invoice, validation issues, or next workflow step. Copilot does not change workflow state.

## 6. Main screens and acceptance criteria

### 6.1 Overview

**Content:** Product title, short purpose statement, seven-step workflow map (Overview, Inbox, AI Processing, Maker Review, Checker Approval, ERP Export, Audit Trail), demo limitation note, and **Start demo** action.

**Acceptance criteria:**

- The workflow sequence and maker/checker separation are visible before the demo starts.
- **Start demo** navigates to Inbox and opens a seeded demo scenario.
- The page states that ERP is mocked and the demo does not make payments.

### 6.2 Inbox

**Content:** Seeded invoice/PO entries with supplier, invoice number when available, PO number, amount/currency when available, received date, and processing state. Include a filter for workflow state only if needed to reach the demo records.

**Acceptance criteria:**

- The inbox contains at least one ready-to-process invoice linked to a PO.
- Each row clearly identifies the invoice and linked PO, without requiring OCR to find the PO first.
- Selecting **Process with AI** creates one processing run and opens the processing view.
- Repeated clicks for the same active run do not create duplicate runs.
- A failed or completed item can be reopened and its status is visible.

### 6.3 AI processing and validation

**Content:** Progress stages, invoice preview, extracted fields, confidence, evidence references, validation results, and a route to Maker Review.

**Acceptance criteria:**

- Processing shows distinct stages for document reading, field extraction, normalization, and validation.
- The selected AI extraction provider is called through an adapter; provider output is checked against a defined schema before it is saved.
- Every populated extracted value shows confidence and page/source evidence when the provider supplies it. Missing evidence is labeled unavailable, not fabricated.
- The app automatically opens the validation/review view when processing succeeds.
- Validation failures and low confidence are visible and do not silently discard extracted data.
- A provider or file error produces a visible recoverable state with retry guidance.

### 6.4 Maker Review

**Content:** Document preview, editable extracted fields, PO comparison, validation messages, field confidence/evidence, reason for corrections, and maker decision actions.

**Acceptance criteria:**

- The maker can compare each relevant invoice value with its source and, where applicable, its PO value.
- The maker can correct fields without overwriting the original extraction record.
- A correction to a material field requires a reason and records old value, new value, actor, and time.
- The maker cannot advance the record while required fields are missing or blocking validation errors remain, unless the maker resolves them or the requirements explicitly allow an override. Overrides require a reason and appear in the audit trail.
- Maker approval moves the invoice to `AWAITING_CHECKER`.
- Maker rejection/return requires a reason and transitions to the corresponding non-exportable state.

### 6.5 Checker Approval

**Content:** Review packet with invoice, PO match, extraction confidence, validation status, maker edits, reasons, and recent audit events. Include **Approve**, **Return to maker**, and **Reject** actions.

**Acceptance criteria:**

- The checker sees the maker's changes and the originally extracted values.
- The API rejects checker approval when the active checker is the maker for that invoice.
- Approval requires explicit confirmation and records checker identity, role, timestamp, approved invoice version, and approval statement.
- The displayed digital signature is a demo electronic sign-off record, not a legally certified digital signature.
- Return/reject requires a reason and keeps the invoice ineligible for ERP export.
- Only approval advances the invoice to `APPROVED`.

### 6.6 ERP Export

**Content:** Approved invoice summary, mock SAP request preview, export status, simulated response and ERP document number, and link to audit history.

**Acceptance criteria:**

- The export action is available only for `APPROVED` invoices.
- The app constructs a documented SAP-style mock request through an ERP adapter and never sends it to a live ERP.
- A successful response displays a stable mock ERP document number and transitions the invoice to `EXPORTED`.
- Request, response, timestamp, result, and idempotency key are recorded in the audit/export record.
- A repeated request for the same approved invoice version returns the existing result rather than creating another mock ERP document.
- A simulated ERP failure is visible, auditable, and retryable without repeating maker/checker approval.

### 6.7 Audit trail

**Content:** Chronological event list with event type, actor, timestamp, summary, and relevant before/after values. Provide access from invoice detail and ERP Export.

**Acceptance criteria:**

- Processing start/completion/failure, validation results, field edits, maker and checker decisions, export request/response, and retries create events.
- Each event identifies the invoice, actor or system component, timestamp, action, and relevant correlation/run ID.
- Field edits preserve before and after values and reason.
- The UI does not offer an edit/delete action for audit events.
- Logs and audit event summaries do not expose secrets or full document contents unnecessarily.

### 6.8 AI Copilot

**Content:** Persistent Copilot entry point in the application shell. A panel shows conversation context and offers suggested questions such as “Why did this invoice fail validation?” and “What should I review next?”

**Acceptance criteria:**

- The button is available from every major screen and opens a panel without losing current workflow context.
- Copilot answers using only the current invoice, associated PO, workflow state, validation results, and audit events available to the user.
- Copilot distinguishes extracted facts from suggestions and points to the underlying field or validation result where possible.
- If required data is missing or confidence is low, Copilot says so instead of inventing a value.
- Copilot cannot mutate records or trigger approval/export actions.
- Copilot errors are shown without blocking the invoice workflow.

## 7. Invoice fields

The data contract distinguishes source document values from normalized values and human corrections. Money is stored as decimal text/numeric decimal with an explicit ISO currency code, never binary floating point.

### Header fields

| Field | Required to submit for checker | Notes |
|---|---:|---|
| Supplier legal/display name | Yes | Preserve extracted spelling and normalized vendor reference separately when available. |
| Supplier identifier/tax ID | No | Store only if present in the document or seeded vendor record. |
| Invoice number | Yes | Preserve original formatting; use with supplier for duplicate detection. |
| Invoice date | Yes | ISO date after parsing; retain raw text and evidence. |
| Due date | No | Do not infer if absent. |
| Purchase order number | Yes | Inbox record provides expected PO association; compare document value when present. |
| Currency | Yes | ISO 4217 code; never assume from locale. |
| Subtotal | Yes | Exact decimal. |
| Tax total | Yes when document lists tax; otherwise explicitly absent/not applicable | Do not convert absent tax to zero without marking source absence. |
| Freight/other charges | No | Capture separately when present. |
| Discount | No | Capture separately when present. |
| Invoice total | Yes | Exact decimal and currency. |
| Payment terms | No | Informational only; no payment execution. |
| Remit-to details | No | Avoid collecting unrelated bank details for the MVP unless required by sample documents. |

### Line-item fields

| Field | Required to submit for checker | Notes |
|---|---:|---|
| Description | Yes | Preserve raw description. |
| PO line reference | No | Match where a PO line association is available. |
| Quantity | Yes when line is quantity-based | Decimal quantity. |
| Unit of measure | No | Preserve as printed. |
| Unit price | Yes when quantity is present | Exact decimal. |
| Line amount | Yes | Exact decimal and currency inherited from invoice unless explicitly different. |
| Tax rate/amount | No | Store only when present or supplied by PO/reference data. |

### Provenance per extracted field

For each model-produced field, store the field name, raw extracted text, normalized value, confidence (when supported), page index, bounding box or text snippet (when supported), extraction run ID, provider/model identifier, and whether a human changed it. Do not fabricate coordinates or confidence when the provider does not return them.

## 8. Data model

The following logical entities are sufficient for the demo. Exact physical types and naming can be decided during implementation.

| Entity | Purpose | Key data |
|---|---|---|
| `DemoUser` | Seeded demo personas. | `id`, display name, role, active flag. |
| `PurchaseOrder` | PO header used for comparison. | `id`, PO number, supplier reference/name, currency, total, status. |
| `PurchaseOrderLine` | Expected goods/services. | `id`, PO ID, line number, description, quantity, UOM, unit price, line total. |
| `Invoice` | Current workflow aggregate. | `id`, document name/storage key, supplier, invoice number/date/due date, PO ID, currency, totals, current state, current version, created/updated timestamps. |
| `InvoiceLine` | Current normalized invoice lines. | `id`, invoice ID, line number, description, PO line ID (nullable), quantity, UOM, unit price, line amount, currency. |
| `ExtractionRun` | One AI/OCR processing attempt. | `id`, invoice ID/version, provider, model, status, started/completed times, error code/message, raw response reference (redacted/controlled), normalized result. |
| `FieldEvidence` | Source support for extracted fields. | `id`, extraction run ID, field path, raw text, normalized value, confidence (nullable), page (nullable), bounding box/snippet (nullable). |
| `ValidationResult` | Rule outcomes for a specific invoice version. | `id`, invoice ID/version, rule code, severity, pass/fail, expected/actual values, message, created time. |
| `ApprovalDecision` | Maker/checker actions. | `id`, invoice ID/version, stage, actor ID, decision, reason, signed statement/reference, timestamp. |
| `ERPExport` | Mock integration transaction. | `id`, invoice ID/version, idempotency key, request payload, response payload, status, mock document number, attempts, timestamps. |
| `AuditEvent` | Append-only event history. | `id`, invoice ID, actor ID or system, event type, timestamp, correlation ID, safe summary, before/after diff reference. |

Store invoice document bytes separately from relational workflow data behind a `DocumentStorage` interface. Database foreign keys and unique constraints should enforce invoice number + supplier duplicate detection where the demo's normalization supports it. Model revisions with a version number so the approval and export refer to the exact reviewed data.

## 9. Processing states and transitions

Use one explicit invoice lifecycle state. Validation findings, extraction-run status, and export status are separate records so a failing rule does not erase the workflow stage.

| State | Meaning | Allowed next states |
|---|---|---|
| `RECEIVED` | Invoice is available in the inbox and has a PO association. | `PROCESSING` |
| `PROCESSING` | OCR/extraction/normalization/validation is running. | `AWAITING_MAKER`, `PROCESSING_FAILED` |
| `PROCESSING_FAILED` | A file/provider/worker failure prevented a complete run. | `PROCESSING` |
| `AWAITING_MAKER` | Extraction and validation results are ready for maker review, including results with validation exceptions. | `AWAITING_CHECKER`, `RETURNED_FOR_PROCESSING`, `REJECTED` |
| `RETURNED_FOR_PROCESSING` | Maker returned the invoice for corrected source/another extraction attempt. | `PROCESSING` |
| `AWAITING_CHECKER` | Maker approved a specific invoice version for independent checker review. | `APPROVED`, `RETURNED_TO_MAKER`, `REJECTED` |
| `RETURNED_TO_MAKER` | Checker needs a maker correction or explanation. | `AWAITING_CHECKER`, `REJECTED` |
| `APPROVED` | Checker approved a specific version. | `EXPORTING` |
| `EXPORTING` | Mock ERP adapter is handling an export attempt. | `EXPORTED`, `EXPORT_FAILED` |
| `EXPORT_FAILED` | Mock ERP returned or simulated an error. | `EXPORTING` |
| `EXPORTED` | Mock ERP accepted the invoice and returned a document number. | Terminal for this invoice version. |
| `REJECTED` | Maker or checker rejected the invoice with a reason. | Terminal in the MVP. |

Transitions are validated by the application service and repeated at API authorization boundaries. A correction after maker approval increments the invoice version and invalidates downstream approval/export for the old version. The demo should return the invoice to maker review or processing as appropriate rather than silently reusing stale approvals.

## 10. AI processing responsibilities

### AI/OCR may

- Read the invoice document using a replaceable OCR/document/vision provider.
- Propose structured header and line-item fields matching the invoice schema.
- Return confidence and source references when the provider supports them.
- Suggest a PO line match, with the match represented as a suggestion until deterministic checks or maker review confirm it.
- Explain validation results in Copilot using saved application data.

### AI/OCR must not

- Approve, reject, sign, or export an invoice.
- Make payment decisions, calculate a payment date, or initiate a payment.
- Invent missing values or convert unknown currency/tax into assumed values.
- Override validation rules or write directly to the approved record outside the workflow service.
- Treat model prose as trusted executable instructions.

### Processing sequence

1. Confirm invoice is processable and acquire an idempotent run identifier.
2. Load the stored file and perform file/type/page safety checks.
3. Send the document to `ExtractionProvider` for text/OCR and structured extraction.
4. Validate the provider response against the extraction schema; retain safe provider metadata and errors.
5. Normalize dates, decimals, and currency without losing raw source values.
6. Associate source evidence and confidence with fields where available.
7. Run deterministic validations and PO comparisons.
8. Persist extraction run, fields, validation results, workflow state, and audit events.
9. Show the result and route the user to review. Provider response never changes approval state directly.

## 11. Validation rules

Validation is deterministic and returns stable rule codes, severity, values, and reviewer-readable messages.

| Rule | Severity | Behavior |
|---|---|---|
| Required header fields | Blocking | Require supplier, invoice number, invoice date, PO association, currency, subtotal, and total before maker can submit to checker. |
| Required line data | Blocking when lines exist | Require description and line amount; require quantity and unit price where the line expresses a quantity calculation. |
| Duplicate invoice | Blocking | Detect same supplier + invoice number among existing demo invoices; allow a maker/checker disposition only if the workshop explicitly requires exceptions. |
| PO supplier match | Blocking | Compare invoice supplier to the PO supplier. Mismatch requires correction or rejection. |
| PO currency match | Blocking | Compare currency codes. Never convert currencies in this MVP. |
| PO number match | Blocking | Compare document PO number when present to the inbox-linked PO. A mismatch must be resolved. |
| Invoice total arithmetic | Blocking | Check subtotal + tax + freight/other charges - discounts against invoice total with the agreed currency rounding tolerance. |
| Line arithmetic | Blocking | Check quantity × unit price against line amount using the agreed rounding tolerance. |
| PO amount/line comparison | Warning or blocking based on confirmed workshop policy | Show invoice vs PO quantity, unit price, and amount variance. Do not silently auto-approve a variance. |
| Low extraction confidence | Warning | Flag fields below a configurable threshold for human review. The threshold is an assumption to confirm; confidence alone does not rewrite a value. |
| Missing source evidence | Warning | Mark evidence unavailable; require human visual confirmation for required fields if no evidence exists. |

No tax-law judgment, fraud score, or automatic variance threshold is assumed. Rounding precision and PO variance handling need workshop confirmation before implementation.

## 12. Maker review requirements

- Show original document and extracted values together.
- Show source evidence, confidence, and PO comparison per relevant value.
- Distinguish model-extracted, human-corrected, PO-derived, and absent values.
- Require a reason for edits to supplier, invoice number/date, PO association, currency, totals, or line items.
- Recalculate deterministic validation after every saved edit.
- Preserve the extraction output and all prior invoice versions for audit review.
- Do not permit maker approval with unresolved blocking validation failures. If the workshop wants explicit overrides, collect reason and show them to checker.
- Record maker, time, invoice version, decision, and reason.

## 13. Checker approval and demo sign-off

- Checker queue contains maker-submitted invoices only.
- Checker review packet shows source document, extracted and corrected data, PO comparison, validation, maker name, maker reasons, and audit events.
- Checker must be a different user from the maker for the invoice.
- Checker can approve, return to maker, or reject; return/reject requires a reason.
- Approval records checker identity, timestamp, approved invoice version, and a typed confirmation statement or equivalent explicit sign-off.
- The UI calls this a **demo electronic approval/sign-off**. It must not claim legal digital-signature compliance or cryptographic identity assurance.
- Any change after approval invalidates the old approval and requires the applicable review steps again.

## 14. Mock SAP/ERP export

`ERPAdapter` defines a provider boundary. The MVP includes `MockSapAdapter`, which runs locally and does not require network access to SAP or another ERP.

### Request representation

Show a readable SAP-style request containing:

- Vendor/supplier reference and invoice number.
- Invoice and posting dates, currency, subtotal, tax, charges/discounts, and total.
- PO number and line references.
- Approved invoice version, checker identity, approval timestamp, and idempotency key.

The displayed payload is an illustrative demo contract, not a claim of conformance to a specific SAP API. Exclude bank details and unnecessary full-document content.

### Mock response

On success, return a stable mock document ID, status, and accepted timestamp. On failure, return a deterministic simulated error code/message that can be retried. The mock adapter records both request and response with payload size limits and safe summaries.

### Export controls

- Only `APPROVED` invoice versions can be exported.
- The adapter rejects duplicate idempotency keys.
- Retry uses the same idempotency key for the same invoice version.
- A corrected invoice creates a new version and requires fresh approval before export.
- The UI labels the integration **Mock SAP/ERP** on the request and result.

## 15. Audit trail requirements

Record these events at minimum:

- Invoice/PO demo record seeded or document received.
- Processing started, each meaningful stage completed, processing failed, and retry started.
- Extraction provider/model and extraction run identifier.
- Validation rules run and result summary.
- Maker field changes with old/new values and reason.
- Maker approve, return, or reject.
- Checker approve, return, or reject, including signed statement reference.
- ERP export request, response, failure, and retry.
- Copilot request metadata where needed for troubleshooting, without storing secrets or unnecessary full prompts/document text.

Events include event ID, invoice ID/version, event type, actor or system identity, UTC timestamp, correlation ID, and safe details. Audit events are append-only in the application. Do not log credentials, access tokens, raw document bytes, or full model prompts containing invoice data. For demo storage, retention may be reset by the demo operator; document that reset behavior.

## 16. AI Copilot requirements

- A persistent entry point appears on Overview, Inbox, Processing, Maker Review, Checker Approval, ERP Export, and Audit Trail.
- Copilot receives only the minimum context for the active invoice and only data visible to the current role.
- Answers include concise explanations and cite the relevant field, rule code, or workflow event in the UI.
- Copilot can explain why validation failed, summarize maker corrections, explain the next allowed action, or summarize the mock ERP result.
- Copilot does not write field values, decide approval, create signatures, submit forms, or call ERP export.
- Copilot must refuse or defer when the context lacks evidence and must identify uncertain extracted values.
- Provider/model failures do not block the invoice workflow. The UI offers retry and preserves the open invoice state.
- Copilot content is treated as generated advice, not as a source of financial truth.

## 17. Error and exception handling

| Exception | User-visible behavior | Workflow behavior |
|---|---|---|
| Unsupported/corrupt file or page limit | Explain accepted demo file types/limits. | Do not start extraction; keep invoice in `RECEIVED` or mark the run failed with a retry/correction path. |
| OCR/model timeout or provider outage | Show stage and retry action; avoid showing raw provider stack traces. | Mark `PROCESSING_FAILED`; retain run metadata; do not produce a successful review result. |
| Invalid model response | Say the extraction result could not be read safely. | Reject schema-invalid output; preserve safe diagnostic metadata; retry with a new run. |
| Low confidence or missing fields | Mark specific fields for maker attention. | Continue to `AWAITING_MAKER`; never auto-fill guesses. |
| Validation failure | Show rule, expected/actual values, and severity. | Keep record reviewable but prevent maker submission while blocking errors remain. |
| Concurrent/stale edit | Ask user to reload or reconcile against the newer version. | Reject stale write using version check; preserve current data. |
| Maker/checker identity conflict | Explain that a different checker is required. | Reject transition at API/service layer and record a safe authorization event. |
| Mock ERP failure | Show simulated response and retry. | Mark `EXPORT_FAILED`; keep approval intact; retry idempotently. |
| Copilot provider failure | Show a local non-blocking error and retry action. | Do not alter invoice state. |
| Storage/database unavailable | Show that processing could not be saved. | Do not report success unless transaction and audit data persist; avoid duplicate work on retry. |

All errors receive a stable internal code and correlation ID. User-facing messages explain the next action without leaking stack traces, credentials, raw invoice data, or provider secrets.

## 18. Technical architecture recommendation

### Shape

Use a modular monolith for the workshop MVP. A single backend owns workflow policy and persistence; provider interfaces isolate OCR/model, document storage, and ERP behavior. A small web client presents the guided flow. This is easier to run in a workshop than microservices and still allows provider substitution.

```text
React + TypeScript client
  ├── Overview / inbox / invoice review / checker / export / audit
  └── Copilot panel
             │ REST/JSON
FastAPI application
  ├── API and authorization boundary
  ├── Workflow application services
  ├── Domain rules and state transitions
  ├── ExtractionProvider interface ── configured AI/OCR adapter
  ├── DocumentStorage interface ──── local demo storage adapter
  ├── ERPAdapter interface ────────── MockSapAdapter
  └── Repository interfaces ──────── SQLite demo database
```

### Suggested technology choices

- **Frontend:** React + TypeScript + Vite for a multi-screen, interactive demo and shared invoice review components.
- **Backend:** Python + FastAPI with typed request/response schemas. Keep route handlers thin.
- **Persistence:** SQLite for the single-user workshop demo, accessed through repositories/migrations. Keep schema and repository code portable to PostgreSQL if the project later needs concurrent or hosted use.
- **Document storage:** Local private demo directory behind an interface; store only generated file keys in the database. Do not serve arbitrary filesystem paths.
- **Processing:** A small background job abstraction for extraction progress. For a single-process workshop run, an in-process task is acceptable and should be labeled a demo limitation. Do not add Redis/Celery unless the workshop requires multi-process reliability.
- **AI/OCR:** Provider interface configured by environment. Choose the actual provider after confirming workshop credentials, data policy, and whether the model accepts PDFs/images directly or needs OCR first.
- **ERP:** Local `MockSapAdapter`; no outbound ERP credentials or network endpoint.
- **Tests:** Unit tests for state transitions, arithmetic and matching rules, adapter contract tests, and an end-to-end seeded workflow test. The implementation can decide tooling after the stack is approved.

### Architectural boundaries

- `InvoiceWorkflowService` owns state transitions and orchestrates processing, maker/checker policy, and export eligibility.
- `ExtractionProvider` performs OCR/AI extraction and returns a schema-constrained result with evidence metadata.
- `ValidationService` is deterministic and independent of the AI provider.
- `DocumentStorage` stores/retrieves document bytes by opaque key.
- `ERPAdapter` exports approved invoice payloads; only the mock adapter is enabled in the MVP.
- `CopilotService` builds a role-scoped context and returns a response; it has no mutation capabilities.
- Repositories persist entities and audit events. Application services control transaction boundaries.

## 19. Recommended project folder structure

This is a proposal, not a request to create these application files yet.

```text
.
├── AGENTS.md
├── README.md
├── docs/
│   └── PRD.md
├── .agents/
│   └── skills/
├── frontend/
│   ├── src/
│   │   ├── app/                 # routing, shell, demo persona context
│   │   ├── features/
│   │   │   ├── overview/
│   │   │   ├── inbox/
│   │   │   ├── processing/
│   │   │   ├── maker-review/
│   │   │   ├── checker-approval/
│   │   │   ├── erp-export/
│   │   │   ├── audit-trail/
│   │   │   └── copilot/
│   │   ├── components/           # shared layout, tables, status, evidence UI
│   │   └── api/                  # typed API client
│   └── tests/
├── backend/
│   ├── app/
│   │   ├── api/                  # FastAPI routers and boundary schemas
│   │   ├── domain/               # invoice, PO, approval, state, rule types
│   │   ├── services/             # workflow, validation, copilot orchestration
│   │   ├── providers/
│   │   │   ├── extraction/       # interface plus provider adapters
│   │   │   ├── storage/          # interface plus local demo adapter
│   │   │   └── erp/              # interface plus MockSapAdapter
│   │   ├── repositories/         # persistence interfaces/implementations
│   │   ├── models/               # persistence mappings
│   │   ├── audit/                # event creation and safe summaries
│   │   ├── jobs/                 # processing task abstraction
│   │   └── config.py
│   ├── migrations/
│   └── tests/
│       ├── unit/
│       ├── integration/
│       └── fixtures/             # synthetic invoices and POs only
├── sample-data/                  # synthetic workshop documents and seed records
└── scripts/                      # local setup, seed, and demo reset commands
```

Do not create folders until implementation scope and stack are approved. Keep demo data synthetic, and keep secrets out of this tree.

## 20. Security, privacy, and demo constraints

- Use synthetic workshop invoices and purchase orders unless data handling is explicitly approved.
- Keep uploaded files in private local storage. Restrict file types/size and validate content rather than trusting the filename.
- Do not expose direct storage paths or render active document content as HTML.
- Read provider secrets from environment configuration; do not commit `.env` files or log secret values.
- Send invoice content only to the configured extraction/Copilot provider. The provider and retention policy must be confirmed before using non-synthetic documents.
- Keep role checks and state transitions on the server.
- Show a persistent “Workshop demo. Mock ERP. No payments.” indicator in appropriate workflow screens.
- Do not represent the MVP as production-ready or the demo sign-off as a legally certified signature.

## 21. Demo data and evaluation

Seed a small, deterministic set of synthetic invoices and purchase orders. Include at least:

- One clean invoice that completes all stages and receives a mock SAP document number.
- One invoice with a correctable extraction/PO discrepancy that demonstrates maker review.
- One invoice with a blocking issue or provider error that demonstrates exception handling.

The specific scenarios and expected outcomes need workshop-owner confirmation. Do not use real vendor data in screenshots, recordings, logs, or evidence.

Measure demo success by whether a workshop participant can complete the happy path and explain a flagged case. Capture extraction quality by required-field exact match on the synthetic examples, but do not claim a generalized accuracy rate from a tiny workshop set.

## 22. Open assumptions to confirm

These are the decisions that affect implementation scope. Defaults below are proposed for an MVP, not facts from the workshop.

1. **Frameworks:** Approve React/TypeScript + FastAPI, or specify the workshop-mandated stack.
2. **AI provider:** Which model/OCR provider and credentials are available? Proposed design supports one configured provider behind an adapter. Confirm whether sample invoice bytes may be sent to it.
3. **Demo identity:** Use seeded Maker and Checker accounts with a visible persona switcher, or provide a workshop identity requirement? The server will still enforce separate identities.
4. **Document input:** Workshop flow says select an invoice in Inbox. Should the MVP support live upload, seeded samples only, or both? Proposed default is seeded samples first, with upload only if required by the workshop.
5. **PO matching:** Are invoices pre-linked to a PO in the inbox, or should matching be part of the AI workflow? Proposed default is pre-linked PO plus comparison, avoiding uncertain autonomous matching.
6. **Approval signature:** Is a typed demo sign-off sufficient, or does the workshop expect a drawn signature UI? Neither option will claim legal signature compliance.
7. **Validation policy:** What rounding tolerance and PO quantity/price variance thresholds should apply? Until specified, blocking arithmetic and supplier/currency mismatches are fixed; variance thresholds remain review warnings.
8. **Copilot provider/context:** Should Copilot use the same model provider as extraction? Proposed default is same configured provider, scoped to current invoice/PO and read-only.
9. **Demo data:** Can workshop sample invoices and expected extraction results be supplied? Proposed seed cases are synthetic and minimal.
10. **Persistence/runtime:** Is a single-machine local demo acceptable? Proposed default is local SQLite and local file storage. Hosting or multi-user concurrency would change the storage and job choices.

## 23. Definition of done for the MVP

- A participant can start at Overview and complete a seeded invoice through mock ERP export.
- AI extraction returns schema-valid invoice fields and visible source support where available.
- Validation checks totals and purchase-order consistency without asking an LLM to make approval decisions.
- Maker review and checker approval are separate, auditable actions by distinct demo identities.
- Only approved invoice versions can be exported; mock export is idempotent and returns a visible ERP document number.
- Audit history explains the important automated and human actions.
- Copilot is visible throughout the workflow, answers from scoped application context, and cannot mutate records.
- Processing, AI, storage, and mock ERP errors have visible recovery paths.
- No payment execution or live ERP connectivity exists in the MVP.
- Implementation checks and evidence follow `AGENTS.md` and the installed Software Factory skills.
