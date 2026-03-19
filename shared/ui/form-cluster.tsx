import { ReactNode } from "react";

type FormClusterProps = {
  label: string;
  title: string;
  children: ReactNode;
};

export function FormCluster({ label, title, children }: FormClusterProps) {
  return (
    <div className="form-cluster">
      <div className="form-cluster-head">
        <p className="eyebrow">{label}</p>
        <h3>{title}</h3>
      </div>
      {children}
    </div>
  );
}

