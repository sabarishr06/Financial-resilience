import { NavLink } from 'react-router-dom';
import SectionHeader from '../components/common/SectionHeader';
import {
  mockTrueEarningsData,
  mockTrueEarningsHistory
} from '../data/mockData';
import TrueEarningsChart from '../components/charts/TrueEarningsChart';
import './Earnings.css';

function Earnings() {
  const data = mockTrueEarningsData;
  const history = mockTrueEarningsHistory;

  // Calculate percentages from data
  const gross = data.grossIncome;
  const costs = data.workCosts.total;
  const trueEarnings = data.trueEarnings;
  const rate = data.effectiveRate;
  const costPercent = (costs / gross) * 100;

  return (
    <div className="earnings-page">
      {/* =========================
          1. PAGE HEADER
          ========================= */}
      <header className="earnings-header">
        <div className="earnings-header-content">
          <h1 className="earnings-title">True Earnings</h1>
          <p className="earnings-subtitle">
            Understand what you actually earn after the cost of working.
          </p>
        </div>
      </header>

      <div className="explanatory-note">
        <p>
          Your gross income shows what you receive. True earnings shows what you actually keep after work-related costs.
        </p>
      </div>

      {/* =========================
          2. TRUE EARNINGS HERO CARD
          ========================= */}
      <section className="hero-card-section">
        <div className="hero-card true-earnings-hero">
          <div className="hero-label">True Earnings</div>
          <div className="hero-value">₹{trueEarnings.toLocaleString()}</div>
          <div className="hero-sub">this month</div>

          <div className="hero-divider" />

          <div className="hero-breakdown">
            <div className="breakdown-row">
              <span>Gross income</span>
              <span>₹{gross.toLocaleString()}</span>
            </div>
            <div className="breakdown-row cost-row">
              <span>Work costs</span>
              <span>−₹{costs.toLocaleString()}</span>
            </div>
            <div className="breakdown-row true-row">
              <span>True earnings</span>
              <span>₹{trueEarnings.toLocaleString()}</span>
            </div>
          </div>

          <div className="hero-rate">
            <span className="rate-label">Effective earnings rate:</span>
            <span className="rate-value">{rate}%</span>
          </div>
        </div>
      </section>

      {/* =========================
          3. INCOME SOURCES
          ========================= */}
      <section className="section-block">
        <SectionHeader title="Income Sources" subtitle="Where your gross income comes from" />
        <div className="source-cards">
          {data.incomeSources.map((src) => (
            <div className="source-card" key={src.name}>
              <div className="source-name">{src.name}</div>
              <div className="source-amount">₹{src.amount.toLocaleString()}</div>
              <div className="source-percent">{src.percentage}% of gross</div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================
          4. WORK COST BREAKDOWN
          ========================= */}
      <section className="section-block">
        <SectionHeader title="Work-Related Costs" subtitle="Expenses required to generate income" />
        <div className="cost-breakdown-card">
          <div className="cost-list">
            {data.workCostBreakdown.map((item) => (
              <div className="cost-row" key={item.name}>
                <div className="cost-name">{item.name}</div>
                <div className="cost-amount">₹{item.amount.toLocaleString()}</div>
                <div className="cost-percent">{item.percentage}%</div>
              </div>
            ))}
          </div>
          <div className="cost-total-row">
            <div className="cost-total-label">Total Work Costs</div>
            <div className="cost-total-value">₹{costs.toLocaleString()}</div>
          </div>
        </div>
      </section>

      {/* =========================
          5. EARNINGS TREND
          ========================= */}
      <section className="section-block">
        <SectionHeader
          title="Earnings Trend"
          subtitle="Six-month comparison of gross, costs, and true earnings"
        />
        <TrueEarningsChart data={history} />
      </section>

      {/* =========================
          6. KEY INSIGHT
          ========================= */}
      <section className="section-block">
        <div className="insight-card">
          <div className="insight-icon">💡</div>
          <div className="insight-body">
            <h3 className="insight-title">Your work costs reduced your income by {costPercent.toFixed(1)}% this month.</h3>
            <p className="insight-text">{data.keyInsight.explanation}</p>
          </div>
        </div>
      </section>

      {/* =========================
          7. EFFECTIVE HOURLY EARNINGS
          ========================= */}
      <section className="section-block">
        <div className="hourly-card">
          <div className="hourly-label">Effective Hourly Earnings</div>
          <div className="hourly-value">₹{Math.round(data.trueEarnings / data.workingHours.totalHours * 100) / 100}/hour</div>
          <div className="hourly-note">
            Based on ₹{data.trueEarnings.toLocaleString()} true earnings across {data.workingHours.totalHours} estimated working hours.
          </div>
        </div>
      </section>

      {/* =========================
          8. IMPROVEMENT OPPORTUNITY
          ========================= */}
      <section className="section-block">
        <SectionHeader title="Where could you improve?" subtitle="Largest contributors to work costs" />
        <div className="improvement-cards">
          {data.improvementAreas.map((area) => (
            <div className="improvement-card" key={area.name}>
              <div className="improvement-name">{area.name}</div>
              <div className="improvement-amount">₹{area.amount.toLocaleString()}</div>
              <div className="improvement-note">{area.reason}</div>
            </div>
          ))}
        </div>
        <p className="improvement-note-text">
          These are the areas contributing most to your work costs.
        </p>
      </section>

      {/* =========================
          9. NAVIGATION / ACTION
          ========================= */}
      <section className="section-block action-section">
        <NavLink to="/resilience" className="action-link">
          Analyze My Resilience →
        </NavLink>
      </section>
    </div>
  );
}

export default Earnings;
