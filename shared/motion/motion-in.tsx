import { ReactNode } from "react";

type MotionInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
};

export function MotionIn({ children, className }: MotionInProps) {
  return <div className={className}>{children}</div>;
}

