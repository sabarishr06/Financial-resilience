import './SectionHeader.css';

function SectionHeader({ title, subtitle, action }) {
  return (
    <div className={`section-header ${action ? 'with-action' : ''}`}>
      <div>
        <h2 className="section-title">{title}</h2>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
      </div>
      {action && action}
    </div>
  );
}

export default SectionHeader;
