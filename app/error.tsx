"use client";

type AppErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AppError({ error, reset }: AppErrorProps) {
  return (
    <div className="page-shell">
      <section className="section-shell stack-lg" aria-live="assertive">
        <div>
          <p className="eyebrow">Something went wrong</p>
          <h1>We could not load this view.</h1>
          <p className="hero-text">Please try again. If the issue continues, check the admin settings and data source status.</p>
        </div>
        <div className="stack-sm">
          <button type="button" className="button" onClick={() => reset()}>
            Try again
          </button>
          {error.message ? <p className="muted">{error.message}</p> : null}
        </div>
      </section>
    </div>
  );
}
