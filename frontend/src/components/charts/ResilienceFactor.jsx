import './ResilienceFactor.css';

function ResilienceFactor({ name, value }) {
  const getFactorClass = (score) => {
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  return (
    <div className="resilience-factor">
      <div className="factor-header">
        <span className="factor-name">{name}</span>
        <span className="factor-value">{value}</span>
      </div>
      <div className="factor-bar">
        <div
          className={`factor-fill ${getFactorClass(value)}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

export default ResilienceFactor;