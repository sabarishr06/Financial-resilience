import './MetricCard.css';

function MetricCard({ label, value, description, trend, highlight = false }) {
  return (
    <div className={`metric-card ${highlight ? 'highlight' : ''}`}>
      <div className="metric-label">{label}</div>
      <div className="metric-value">{value}</div>
      {description && <div className="metric-description">{description}</div>}
      {trend && (
        <div className={`metric-trend ${trend.type}`}>
          {trend.type === 'positive' && '↑'}
          {trend.type === 'negative' && '↓'}
          {trend.value}
        </div>
      )}
    </div>
  );
}

export default MetricCard;
