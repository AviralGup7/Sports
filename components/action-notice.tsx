type ActionNoticeProps = {
  message?: string;
  tone?: "success" | "error" | "info";
};

export function ActionNotice({ message, tone = "info" }: ActionNoticeProps) {
  if (!message) {
    return null;
  }

  return <div className={`action-notice action-${tone}`}>{message}</div>;
}
