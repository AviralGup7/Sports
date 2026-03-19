export default function Loading() {
  return (
    <div className="route-buffer-screen" aria-live="polite" aria-busy="true">
      <div className="route-buffer-core">
        <span className="route-buffer-ring" />
        <span className="route-buffer-ring route-buffer-ring-delayed" />
        <div className="route-buffer-copy">
          <p className="eyebrow">Switching Arena</p>
          <strong>Loading next board</strong>
        </div>
      </div>
    </div>
  );
}
