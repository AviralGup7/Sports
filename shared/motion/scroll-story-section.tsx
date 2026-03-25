import { ReactNode } from "react";

type ScrollStorySectionProps = {
  children: ReactNode;
  className?: string;
  variant?: "hero" | "section" | "bracket" | "news";
};

const variantTravel = {
  hero: 48,
  section: 28,
  bracket: 34,
  news: 24
} as const;

export function ScrollStorySection({ children, className, variant = "section" }: ScrollStorySectionProps) {
  return (
    <div className={className ? `scroll-story-section scroll-story-section-${variant} ${className}` : `scroll-story-section scroll-story-section-${variant}`}>
      {children}
    </div>
  );
}
