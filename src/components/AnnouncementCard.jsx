export default function AnnouncementCard({ announcement, upcomingLandmarks, announcedIds }) {
  return (
    <section className="panel announcement-panel">
      <p className="eyebrow">Current announcement</p>

      {announcement ? (
        <div className="announcement-card">
          <div className="direction-pill">Look {announcement.side}</div>
          <h2>{announcement.landmark.name}</h2>
          <p>{announcement.text}</p>
        </div>
      ) : (
        <div className="empty-state">
          <h2>No alert yet</h2>
          <p>Start the ride. The first landmark will appear here when you enter its trigger zone.</p>
        </div>
      )}

      <div className="landmark-list">
        <h3>Landmarks on this route</h3>
        {upcomingLandmarks.map((landmark) => (
          <div className="landmark-row" key={landmark.id}>
            <div>
              <strong>{landmark.name}</strong>
              <p>{landmark.message}</p>
            </div>
            <span className={announcedIds.has(landmark.id) ? 'status done' : 'status'}>
              {announcedIds.has(landmark.id) ? 'Done' : 'Pending'}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
