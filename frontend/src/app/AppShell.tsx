import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import ApiStatus from "../components/ApiStatus";

const steps = [
  { label: "Overview", path: "/", number: "01" },
  { label: "Inbox", path: "/inbox", number: "02" },
  { label: "AI processing", path: "/processing", number: "03" },
  { label: "Maker review", path: "/maker-review", number: "04" },
  { label: "Checker approval", path: "/checker-approval", number: "05" },
  { label: "ERP export", path: "/erp-export", number: "06" },
  { label: "Audit trail", path: "/audit-trail", number: "07" },
];

export default function AppShell() {
  const [copilotOpen, setCopilotOpen] = useState(false);

  return (
    <div className="app-frame">
      <aside className="sidebar">
        <NavLink className="brand" to="/" aria-label="Invoice Agent overview">
          <span className="brand-mark">i</span>
          <span className="brand-name">invoice<span>agent</span></span>
        </NavLink>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="workflow-nav" aria-label="Workflow navigation">
          {steps.map((step) => (
            <NavLink
              key={step.path}
              to={step.path}
              end={step.path === "/"}
              className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
            >
              <span className="nav-number">{step.number}</span>
              <span>{step.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="demo-pill"><span /> Workshop demo</div>
          <p>Mock SAP/ERP<br />No payments</p>
        </div>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="breadcrumb">Accounts payable <span>/</span> Workshop</div>
          <div className="topbar-actions">
            <ApiStatus />
            <button className="copilot-trigger" onClick={() => setCopilotOpen(true)}>
              <span className="sparkle">✳</span> AI Copilot
            </button>
            <div className="persona"><span className="persona-avatar">DO</span><span>Demo operator</span><span className="chevron">⌄</span></div>
          </div>
        </header>
        <main className="page-content"><Outlet /></main>
      </div>

      {copilotOpen && <CopilotPanel onClose={() => setCopilotOpen(false)} />}
    </div>
  );
}

function CopilotPanel({ onClose }: { onClose: () => void }) {
  return (
    <div className="panel-backdrop" role="presentation" onClick={onClose}>
      <section
        className="copilot-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="copilot-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="panel-heading">
          <div><div className="panel-kicker">WORKSHOP ASSISTANT</div><h2 id="copilot-title">AI Copilot</h2></div>
          <button className="icon-button" aria-label="Close Copilot" onClick={onClose}>×</button>
        </div>
        <div className="copilot-empty">
          <span className="copilot-orb">✳</span>
          <h3>Here to help with this workflow</h3>
          <p>Once an AI provider is configured, Copilot can explain invoice fields and validation results. It will not approve or export invoices.</p>
        </div>
        <div className="copilot-input-wrap">
          <div className="copilot-input" aria-disabled="true">Copilot is not configured yet</div>
          <span className="input-hint">Read-only assistance · No invoice data sent</span>
        </div>
      </section>
    </div>
  );
}
