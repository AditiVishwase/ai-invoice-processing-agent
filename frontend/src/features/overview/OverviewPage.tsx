import { Link } from "react-router-dom";

const workflow = [
  { number: "01", title: "Inbox", text: "Choose an invoice and its purchase order." },
  { number: "02", title: "AI processing", text: "Extract fields and check the invoice." },
  { number: "03", title: "Maker review", text: "Review values and resolve exceptions." },
  { number: "04", title: "Checker approval", text: "A second person records approval." },
  { number: "05", title: "ERP export", text: "Send the approved record to mock SAP." },
  { number: "06", title: "Audit trail", text: "Review every automated and human step." },
];

export default function OverviewPage() {
  return (
    <div className="overview-page">
      <div className="page-eyebrow"><span className="eyebrow-line" /> AP AUTOMATION WORKSHOP</div>
      <section className="hero">
        <div className="hero-copy">
          <h1>Invoice processing,<br /><em>with people in control.</em></h1>
          <p className="hero-description">Follow an invoice from AI extraction through two-person approval and a mock ERP export. Review the evidence at every step.</p>
          <Link className="primary-button" to="/inbox">Start the demo <span aria-hidden="true">↗</span></Link>
          <div className="hero-note"><span className="note-dot" /> Workshop environment <span className="note-divider">·</span> Mock SAP/ERP <span className="note-divider">·</span> No payments
          </div>
        </div>
        <div className="hero-art" aria-label="Invoice moves through AI extraction and human approval">
          <div className="art-glow" />
          <div className="invoice-card">
            <div className="invoice-card-top"><span className="mini-mark">i</span><span className="invoice-label">INVOICE</span><span className="status-chip">READY</span></div>
            <div className="invoice-lines"><i /><i /><i /><i /></div>
            <div className="invoice-total"><span>Invoice total</span><strong>₹ 48,250.00</strong></div>
            <div className="invoice-stamp"><span>AI</span><div><b>Fields extracted</b><small>Evidence attached</small></div><span className="stamp-check">✓</span></div>
          </div>
          <div className="approval-node maker-node"><span className="node-check">✓</span><div><b>Maker review</b><small>Human verified</small></div></div>
          <div className="approval-node checker-node"><span className="node-check">✓</span><div><b>Checker approval</b><small>Second-person control</small></div></div>
          <div className="art-caption">One invoice <span>·</span> Fully traceable</div>
        </div>
      </section>

      <section className="workflow-section">
        <div className="section-heading">
          <div><div className="section-kicker">THE WORKFLOW</div><h2>From inbox to ERP, step by step</h2></div>
          <span className="step-count">06 STEPS</span>
        </div>
        <div className="workflow-grid">
          {workflow.map((step, index) => (
            <article className="workflow-card" key={step.number}>
              <div className="workflow-card-top"><span className="workflow-number">{step.number}</span>{index === 1 && <span className="ai-badge">AI</span>}</div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="overview-footer"><span>Designed for a guided workshop demo</span><span>Extraction assists. People decide.</span></footer>
    </div>
  );
}
