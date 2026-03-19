"use client";

import { useEffect, useState } from "react";

type ActionToastProps = {
  message?: string;
  tone?: "success" | "error" | "info";
};

export function ActionToast({ message, tone = "info" }: ActionToastProps) {
  const [visible, setVisible] = useState(Boolean(message));

  useEffect(() => {
    setVisible(Boolean(message));

    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setVisible(false);
    }, 3200);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message]);

  if (!message || !visible) {
    return null;
  }

  return (
    <div className={`action-toast action-toast-${tone}`} role="status" aria-live="polite">
      {message}
    </div>
  );
}
