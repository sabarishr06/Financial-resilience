import './AlertCard.css';

function AlertCard({ icon = '⚠️', title, message, action, type = 'warning' }) {
  return (
    <div className={`alert-card ${type}`}>
      <div className="alert-icon">{icon}</div>
      <div className="alert-content">
        <h3 className="alert-title">{title}</h3>
        <p className="alert-message">{message}</p>
        {action && <p className="alert-action">{action}</p>}
      </div>
    </div>
  );
}

export default AlertCard;
