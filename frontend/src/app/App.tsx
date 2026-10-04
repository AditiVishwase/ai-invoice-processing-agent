import { Route, Routes } from "react-router-dom";
import AppShell from "./AppShell";
import OverviewPage from "../features/overview/OverviewPage";
import WorkflowPlaceholder from "../features/workflow/WorkflowPlaceholder";

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<OverviewPage />} />
        <Route path="inbox" element={<WorkflowPlaceholder title="Inbox" step={2} />} />
        <Route path="processing" element={<WorkflowPlaceholder title="AI processing" step={3} />} />
        <Route path="maker-review" element={<WorkflowPlaceholder title="Maker review" step={4} />} />
        <Route path="checker-approval" element={<WorkflowPlaceholder title="Checker approval" step={5} />} />
        <Route path="erp-export" element={<WorkflowPlaceholder title="ERP export" step={6} />} />
        <Route path="audit-trail" element={<WorkflowPlaceholder title="Audit trail" step={7} />} />
      </Route>
    </Routes>
  );
}
