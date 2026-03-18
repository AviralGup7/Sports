type ActionNoticeProps = {
  message?: string;
  tone?: "success" | "error" | "info";
};

export function ActionNotice({ message, tone = "info" }: ActionNoticeProps) {
  if (!message) {
    return null;
  }

  const statusRole = tone === "error" ? "alert" : "status";

  return (
    <div className={`action-notice action-${tone}`} role={statusRole} aria-live="polite">
      {message}
    </div>
  );
}
