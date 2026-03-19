"use client";

import { ReactNode } from "react";
import { useFormStatus } from "react-dom";

type SubmitButtonProps = {
  children: ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
};

export function SubmitButton({ children, pendingLabel, className = "button", disabled = false }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button type="submit" className={className} disabled={disabled || pending} aria-busy={pending}>
      {pending ? pendingLabel ?? "Working..." : children}
    </button>
  );
}
