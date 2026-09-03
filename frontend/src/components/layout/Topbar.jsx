import './Topbar.css';

function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h1>Dashboard</h1>
      </div>
      <div className="topbar-right">
        <div className="notification-badge">
          <span>🔔</span>
          <div className="notification-dot"></div>
        </div>
        <div className="user-profile">
          <div className="user-avatar">JD</div>
          <div className="user-info">
            <span className="user-name">John Doe</span>
            <span className="user-role">User</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
