export default function ModeSwitcher({ appMode, onChange }) {
  return (
    <section className="mode-shell" aria-label="App mode">
      <button
        className={appMode === 'travel' ? 'active' : ''}
        onClick={() => onChange('travel')}
      >
        <span>Travel Mode</span>
        <small>Fixed route alerts</small>
      </button>
      <button
        className={appMode === 'stationary' ? 'active' : ''}
        onClick={() => onChange('stationary')}
      >
        <span>Stationary Mode</span>
        <small>Nearby washrooms</small>
      </button>
    </section>
  );
}
