type ActionNoticeProps = {
  message?: string;
  tone?: "success" | "error" | "info";
};

export function ActionNotice({ message, tone = "info" }: ActionNoticeProps) {
  if (!message) {
    return null;
  }

  const statusRole = tone === "error" ? "alert" : "status";
  const liveMode = tone === "error" ? "assertive" : "polite";

  return (
    <div className={`action-notice action-${tone}`} role={statusRole} aria-live={liveMode}>
      {message}
    </div>
  );
}

