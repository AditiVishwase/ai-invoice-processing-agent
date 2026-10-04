import { useEffect, useState } from "react";
import { getHealth } from "../api/health";

type Status = "checking" | "online" | "offline";

export default function ApiStatus() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const controller = new AbortController();
    getHealth(controller.signal)
      .then(() => setStatus("online"))
      .catch((error: unknown) => {
        if (!controller.signal.aborted && !(error instanceof DOMException && error.name === "AbortError")) {
          setStatus("offline");
        }
      });
    return () => controller.abort();
  }, []);

  const label = status === "online" ? "API online" : status === "offline" ? "API offline" : "Checking API";
  return (
    <div className={`api-status ${status}`} aria-live="polite" title={label}>
      <span className="api-status-dot" />
      {label}
    </div>
  );
}
