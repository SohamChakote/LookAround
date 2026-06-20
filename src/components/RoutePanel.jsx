import { formatMeters } from '../utils/geo.js';

export default function RoutePanel({
  routes,
  selectedRouteId,
  onRouteChange,
  mode,
  setMode,
  isRunning,
  onStart,
  onPause,
  onReset,
  progressMeters,
  totalDistanceMeters,
  demoSpeed,
  setDemoSpeed,
  voiceEnabled,
  setVoiceEnabled,
  gpsError
}) {
  const progressPercent = totalDistanceMeters
    ? Math.min(100, Math.round((progressMeters / totalDistanceMeters) * 100))
    : 0;

  return (
    <section className="panel route-panel">
      <div className="panel-heading">
        <p className="eyebrow">Fixed-route tour guide</p>
        <h1>Scenic Transit Guide</h1>
        <p className="subtitle">
          Pick a route, start a demo ride, and get landmark alerts as you pass interesting places.
        </p>
      </div>

      <label className="field">
        <span>Route</span>
        <select value={selectedRouteId} onChange={(event) => onRouteChange(event.target.value)}>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mode-toggle" aria-label="Ride mode">
        <button className={mode === 'demo' ? 'active' : ''} onClick={() => setMode('demo')}>
          Demo ride
        </button>
        <button className={mode === 'gps' ? 'active' : ''} onClick={() => setMode('gps')}>
          GPS mode
        </button>
      </div>

      {mode === 'demo' && (
        <label className="field">
          <span>Demo speed</span>
          <select value={demoSpeed} onChange={(event) => setDemoSpeed(Number(event.target.value))}>
            <option value={35}>Slow</option>
            <option value={85}>Medium</option>
            <option value={160}>Fast</option>
          </select>
        </label>
      )}

      <label className="checkbox-row">
        <input
          type="checkbox"
          checked={voiceEnabled}
          onChange={(event) => setVoiceEnabled(event.target.checked)}
        />
        <span>Speak announcements out loud</span>
      </label>

      <div className="actions">
        {!isRunning ? (
          <button className="primary" onClick={onStart}>Start</button>
        ) : (
          <button onClick={onPause}>Pause</button>
        )}
        <button onClick={onReset}>Reset</button>
      </div>

      <div className="progress-block">
        <div className="progress-label">
          <span>Route progress</span>
          <strong>{progressPercent}%</strong>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>
        <small>{formatMeters(progressMeters)} / {formatMeters(totalDistanceMeters)}</small>
      </div>

      {gpsError && <p className="error-text">{gpsError}</p>}
    </section>
  );
}
