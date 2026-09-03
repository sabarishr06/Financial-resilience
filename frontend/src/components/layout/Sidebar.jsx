import { NavLink } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const navItems = [
    { path: '/', label: 'Overview', icon: '📊' },
    { path: '/earnings', label: 'Earnings', icon: '💰' },
    { path: '/resilience', label: 'Resilience', icon: '🛡️' },
    { path: '/emergency', label: 'Emergency', icon: '🚨' },
    { path: '/forecast', label: 'Forecast', icon: '📈' },
    { path: '/simulator', label: 'Simulator', icon: '🎮' },
    { path: '/ai-guide', label: 'AI Guide', icon: '🤖' },
    { path: '/data-input', label: 'Data Input', icon: '📝' }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Financial Resilience</h2>
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
