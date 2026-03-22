"use client";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  return (
    <section className="operations-hero stack-lg" aria-live="assertive">
      <div>
        <p className="eyebrow">Admin issue</p>
        <h1>The control room hit an error.</h1>
        <p className="hero-text">Try the action again. If this keeps happening, check environment readiness and fallback status in Settings.</p>
      </div>
      <div className="stack-sm">
        <button type="button" className="button" onClick={() => reset()}>
          Retry admin view
        </button>
        {error.message ? <p className="muted">{error.message}</p> : null}
      </div>
    </section>
  );
}
