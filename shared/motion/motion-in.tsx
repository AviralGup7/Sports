import { ReactNode } from "react";

type MotionInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  id?: string;
};

export function MotionIn({ children, className, id }: MotionInProps) {
  return (
    <div id={id} className={className}>
      {children}
    </div>
  );
}

