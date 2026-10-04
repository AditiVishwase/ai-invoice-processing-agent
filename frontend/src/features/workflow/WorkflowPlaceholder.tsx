import { Link } from "react-router-dom";

type WorkflowPlaceholderProps = { title: string; step: number };

export default function WorkflowPlaceholder({ title, step }: WorkflowPlaceholderProps) {
  return (
    <section className="placeholder-page">
      <div className="page-eyebrow"><span className="eyebrow-line" /> WORKSHOP WORKFLOW · STEP {String(step).padStart(2, "0")}</div>
      <h1>{title}</h1>
      <p>This screen is part of the approved invoice workflow. Its behavior will be added in the next implementation slice.</p>
      <Link to="/">Return to overview <span aria-hidden="true">↗</span></Link>
    </section>
  );
}
