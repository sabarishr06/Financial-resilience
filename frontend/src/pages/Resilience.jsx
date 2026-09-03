import { NavLink } from 'react-router-dom';
import {
  mockFinancialData,
  mockTrueEarningsData,
  mockTrueEarningsHistory
} from '../data/mockData';
import TrueEarningsChart from '../components/charts/TrueEarningsChart';
import './Resilience.css';

function Resilience() {
  // Source data
  const fin = mockFinancialData;
  const earnings = mockTrueEarningsData;
  const history = mockTrueEarningsHistory;

  // --- DISPLAY CALCULATIONS (simple derived values only) ---
  // The final resilience score is currently mock; backend will compute the real one.
  const overallScore = fin.resilience.score;
  const factors = fin.resilience.factors;

  const emergencyFund = fin.emergencyFund;
  const essentialExpenses = fin.essentialMonthlyExpenses;
  const monthlyDebt = fin.monthlyDebtObligations;
  const trueEarnings = fin.trueEarningsCurrent;

  // Emergency coverage in months
  const emergencyMonths = emergencyFund / essentialExpenses;

  // Essential expense coverage: trueEarnings / essentialExpenses * 100
  const expenseCoveragePercent = (trueEarnings / essentialExpenses) * 100;

  // Income variation (using historical gross income range)
  const grossIncomes = history.map(h => h.grossIncome);
  const minMonth = Math.min(...grossIncomes);
  const maxMonth = Math.max(...grossIncomes);
  const avgGross = Math.round(grossIncomes.reduce((a, b) => a + b, 0) / grossIncomes.length);

  // Income stability score variation range (display only)
  const incomeRange = maxMonth - minMonth;
  const incomeRangePct = (incomeRange / avgGross) * 100;
  const variationLabel =
    incomeRangePct < 10 ? 'Low' : incomeRangePct < 25 ? 'Moderate' : 'High';

  // Debt burden ratio: monthlyDebt / trueEarnings
  const debtBurdenRatio = (monthlyDebt / trueEarnings) * 100;
  const debtLabel =
    debtBurdenRatio < 15 ? 'Light' : debtBurdenRatio < 30 ? 'Moderate' : 'Heavy';

  // Shock preview (-30% to true earnings)
  const shockPct = 30;
  const shockedTrueEarnings = trueEarnings * (1 - shockPct / 100);
  const monthlyGap = shockedTrueEarnings - essentialExpenses;
  const monthsCovered = monthlyGap < 0 ? emergencyFund / Math.abs(monthlyGap) : Infinity;

  // Status helpers
  const getScoreStatus = (score) => {
    if (score >= 70) return { label: 'Strong', tone: 'high' };
    if (score >= 40) return { label: 'Moderate', tone: 'medium' };
    return { label: 'Low', tone: 'low' };
  };
  const overallStatus = getScoreStatus(overallScore);

  const getOverallStatusText = () => {
    if (overallScore >= 70) return 'Strongly Resilient';
    if (overallScore >= 40) return 'Moderately Resilient';
    return 'Limited Resilience';
  };

  const getOverallMessage = () => {
    if (overallScore >= 70) {
      return 'You have meaningful financial protection, but a prolonged income disruption could still create pressure on your finances.';
    }
    if (overallScore >= 40) {
      return 'You have some financial protection, but a prolonged income disruption could put pressure on your finances.';
    }
    return 'Your current safety net is thin. Even a short income disruption could meaningfully impact your ability to cover essential expenses.';
  };

  // Coverage visual fill (relative to 6 month upper range of "suggested" zone)
  const targetLow = 3;
  const targetHigh = 6;
  const coverageFillPct = Math.min(100, (emergencyMonths / targetHigh) * 100);

  return (
    <div className="resilience-page">
      {/* =========================
          1. PAGE HEADER
          ========================= */}
      <header className="resilience-header">
        <div className="resilience-header-content">
          <h1 className="resilience-title">Financial Resilience</h1>
          <p className="resilience-subtitle">
            Understand how prepared you are for income disruption.
          </p>
        </div>
      </header>

      <div className="explanatory-note">
        <p>
          Your resilience score combines income stability, emergency coverage, expenses and debt to
          estimate how well you could handle a financial shock. This is an indicative estimate,
          not a guaranteed prediction of future outcomes.
        </p>
      </div>

      {/* =========================
          2. RESILIENCE SCORE HERO
          ========================= */}
      <section className="hero-card-section">
        <div className={`resilience-hero ${overallStatus.tone}`}>
          <div className="hero-label">Resilience Score</div>
          <div className="hero-score">
            <span className="hero-score-value">{overallScore}</span>
            <span className="hero-score-max">/ 100</span>
          </div>
          <div className={`hero-status status-${overallStatus.tone}`}>
            {getOverallStatusText()}
          </div>
          <div className="hero-divider" />
          <p className="hero-message">{getOverallMessage()}</p>
          <p className="hero-disclaimer">
            Illustrative only — based on current reported figures and a basic model.
          </p>
        </div>
      </section>

      {/* =========================
          3. SCORE BREAKDOWN
          ========================= */}
      <section className="section-block">
        <div className="block-title">
          <h2 className="block-h2">Score Breakdown</h2>
          <p className="block-sub">What contributes to your overall resilience</p>
        </div>
        <div className="factor-grid">
          {[
            {
              key: 'incomeStability',
              name: 'Income Stability',
              score: factors.incomeStability,
              explanation: 'How consistent your income has been over recent months.'
            },
            {
              key: 'emergencyCoverage',
              name: 'Emergency Coverage',
              score: factors.emergencyCoverage,
              explanation: `Your emergency fund currently covers about ${emergencyMonths.toFixed(1)} months of essential expenses.`
            },
            {
              key: 'expenseHealth',
              name: 'Expense Health',
              score: factors.expenseHealth,
              explanation: 'How comfortably your true earnings cover your essential monthly expenses.'
            },
            {
              key: 'debtBurden',
              name: 'Debt Burden',
              score: factors.debtBurden,
              explanation: 'How much of your usable income goes toward debt payments each month.'
            }
          ].map((f) => {
            const status = getScoreStatus(f.score);
            return (
              <div className={`factor-card factor-${status.tone}`} key={f.key}>
                <div className="factor-card-top">
                  <div className="factor-name">{f.name}</div>
                  <div className={`factor-score-pill status-${status.tone}`}>
                    {f.score} / 100
                  </div>
                </div>
                <div
                  className="factor-bar"
                  role="progressbar"
                  aria-valuenow={f.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${f.name} score: ${f.score} out of 100`}
                >
                  <div
                    className={`factor-fill factor-fill-${status.tone}`}
                    style={{ width: `${f.score}%` }}
                  />
                </div>
                <div className="factor-explanation">{f.explanation}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================
          4. EMERGENCY FUND COVERAGE
          ========================= */}
      <section className="section-block">
        <div className="block-title">
          <h2 className="block-h2">Emergency Fund Coverage</h2>
          <p className="block-sub">How long your emergency savings would last at essential spending</p>
        </div>
        <div className="coverage-card">
          <div className="coverage-stats">
            <div className="coverage-stat">
              <div className="coverage-label">Current Emergency Fund</div>
              <div className="coverage-value">₹{emergencyFund.toLocaleString()}</div>
            </div>
            <div className="coverage-stat">
              <div className="coverage-label">Essential Monthly Expenses</div>
              <div className="coverage-value">₹{essentialExpenses.toLocaleString()}</div>
            </div>
            <div className="coverage-stat highlight-stat">
              <div className="coverage-label">Coverage</div>
              <div className="coverage-value-large">
                {emergencyMonths.toFixed(1)} <span className="coverage-unit">months</span>
              </div>
            </div>
          </div>

          <div className="coverage-bar-wrap">
            <div className="coverage-bar-labels">
              <span>0</span>
              <span className="coverage-target-label">
                Suggested resilience range: {targetLow}–{targetHigh} months
              </span>
              <span>{targetHigh}+</span>
            </div>
            <div
              className="coverage-bar"
              role="progressbar"
              aria-valuenow={Math.round(coverageFillPct)}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Emergency fund covers ${emergencyMonths.toFixed(1)} months of essential expenses`}
            >
              <div
                className="coverage-bar-fill"
                style={{ width: `${coverageFillPct}%` }}
              />
              <div
                className="coverage-bar-zone"
                style={{ left: `${(targetLow / targetHigh) * 100}%`, width: `${((targetHigh - targetLow) / targetHigh) * 100}%` }}
                aria-hidden="true"
              />
            </div>
            <div className="coverage-bar-legend">
              <span>Current: <strong>{emergencyMonths.toFixed(1)} months</strong></span>
              <span>Common planning range: {targetLow}–{targetHigh} months</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          5. INCOME STABILITY
          ========================= */}
      <section className="section-block">
        <div className="block-title">
          <h2 className="block-h2">Income Stability</h2>
          <p className="block-sub">How much your income has varied over the past six months</p>
        </div>
        <div className="stability-card">
          <div className="stability-stats">
            <div className="stability-stat">
              <div className="stability-label">Average monthly gross income</div>
              <div className="stability-value">₹{avgGross.toLocaleString()}</div>
            </div>
            <div className="stability-stat">
              <div className="stability-label">Income variation</div>
              <div className={`stability-value-tag tag-${variationLabel.toLowerCase()}`}>
                {variationLabel}
              </div>
            </div>
            <div className="stability-stat">
              <div className="stability-label">Lowest month</div>
              <div className="stability-value">₹{minMonth.toLocaleString()}</div>
            </div>
            <div className="stability-stat">
              <div className="stability-label">Highest month</div>
              <div className="stability-value">₹{maxMonth.toLocaleString()}</div>
            </div>
          </div>
          <TrueEarningsChart data={history} />
        </div>
      </section>

      {/* =========================
          6. EXPENSE PRESSURE
          ========================= */}
      <section className="section-block">
        <div className="block-title">
          <h2 className="block-h2">Expense Pressure</h2>
          <p className="block-sub">How your essential expenses compare with what you actually take home</p>
        </div>
        <div className="expense-card">
          <div className="expense-stats">
            <div className="expense-stat">
              <div className="expense-label">Essential monthly expenses</div>
              <div className="expense-value">₹{essentialExpenses.toLocaleString()}</div>
            </div>
            <div className="expense-stat">
              <div className="expense-label">True earnings</div>
              <div className="expense-value">₹{trueEarnings.toLocaleString()}</div>
            </div>
            <div className={`expense-stat coverage-stat-${expenseCoveragePercent >= 100 ? 'green' : expenseCoveragePercent >= 80 ? 'amber' : 'red'}`}>
              <div className="expense-label">Essential expense coverage</div>
              <div className="expense-value-coverage">
                {expenseCoveragePercent.toFixed(1)}%
              </div>
            </div>
          </div>
          <p className="expense-explanation">
            Your current true earnings are only slightly above your essential monthly expenses.
            This means a small drop in income could quickly remove the buffer you have for non-essential
            spending and savings.
          </p>
          <p className="expense-disclaimer">
            Indicative only — based on currently reported income and essential expenses.
          </p>
        </div>
      </section>

      {/* =========================
          7. DEBT BURDEN
          ========================= */}
      <section className="section-block">
        <div className="block-title">
          <h2 className="block-h2">Debt Burden</h2>
          <p className="block-sub">How much of your usable income goes toward debt payments</p>
        </div>
        <div className="debt-card">
          <div className="debt-stats">
            <div className="debt-stat">
              <div className="debt-label">Monthly debt obligations</div>
              <div className="debt-value">₹{monthlyDebt.toLocaleString()}</div>
            </div>
            <div className="debt-stat">
              <div className="debt-label">Debt burden</div>
              <div className={`debt-tag tag-${debtLabel.toLowerCase()}`}>{debtLabel}</div>
            </div>
            <div className="debt-stat">
              <div className="debt-label">Share of true earnings</div>
              <div className="debt-value">{debtBurdenRatio.toFixed(1)}%</div>
            </div>
          </div>
          <p className="debt-explanation">
            Debt payments currently consume part of your monthly usable income, which reduces the
            amount you can set aside for emergencies or absorb an income shock.
          </p>
        </div>
      </section>

      {/* =========================
          8. SHOCK SURVIVAL PREVIEW
          ========================= */}
      <section className="section-block">
        <div className="block-title">
          <h2 className="block-h2">What Happens If Your Income Drops?</h2>
          <p className="block-sub">A quick preview of a simple income shock scenario</p>
        </div>
        <div className={`shock-card ${monthlyGap < 0 ? 'shock-warning' : 'shock-safe'}`}>
          <div className="shock-scenario">
            <div className="shock-scenario-label">Income reduction</div>
            <div className="shock-scenario-value">−{shockPct}%</div>
          </div>
          <div className="shock-grid">
            <div className="shock-stat">
              <div className="shock-label">Estimated true earnings</div>
              <div className="shock-value">₹{Math.round(shockedTrueEarnings).toLocaleString()}</div>
            </div>
            <div className="shock-stat">
              <div className="shock-label">Essential expenses</div>
              <div className="shock-value">₹{essentialExpenses.toLocaleString()}</div>
            </div>
            <div className={`shock-stat ${monthlyGap < 0 ? 'shock-negative' : 'shock-positive'}`}>
              <div className="shock-label">Estimated monthly gap</div>
              <div className="shock-value">
                {monthlyGap < 0
                  ? `−₹${Math.abs(Math.round(monthlyGap)).toLocaleString()}`
                  : `+₹${Math.round(monthlyGap).toLocaleString()}`}
              </div>
            </div>
          </div>
          <div className="shock-footer">
            {monthlyGap < 0 ? (
              <p className="shock-message">
                Your emergency fund could cover this gap for approximately{' '}
                <strong>{monthsCovered.toFixed(1)} months</strong>.
              </p>
            ) : (
              <p className="shock-message">
                At this reduction level, your true earnings would still cover essential expenses
                and you would not need to draw on your emergency fund.
              </p>
            )}
            <p className="shock-disclaimer">
              Illustrative preview only — the full simulator provides more detailed scenarios.
            </p>
          </div>
          <div className="shock-cta">
            <NavLink to="/simulator" className="shock-link">
              Explore Full Simulator →
            </NavLink>
          </div>
        </div>
      </section>

      {/* =========================
          9. RESILIENCE FACTORS
          ========================= */}
      <section className="section-block">
        <div className="block-title">
          <h2 className="block-h2">Resilience Factors</h2>
          <p className="block-sub">A quick summary of what is helping and what is reducing your resilience</p>
        </div>
        <div className="factor-summary">
          <div className="factor-column helping-column">
            <h3 className="factor-column-title helping-title">What is helping you</h3>
            <ul className="factor-list">
              {earnings.incomeSources.length > 1 && (
                <li className="factor-item helping-item">
                  <span className="factor-bullet helping-bullet" aria-hidden="true">✓</span>
                  <span>Multiple income sources</span>
                </li>
              )}
              {emergencyFund > 0 && (
                <li className="factor-item helping-item">
                  <span className="factor-bullet helping-bullet" aria-hidden="true">✓</span>
                  <span>Some emergency savings set aside</span>
                </li>
              )}
              {trueEarnings > essentialExpenses && (
                <li className="factor-item helping-item">
                  <span className="factor-bullet helping-bullet" aria-hidden="true">✓</span>
                  <span>True earnings currently cover essential expenses</span>
                </li>
              )}
            </ul>
          </div>

          <div className="factor-column reducing-column">
            <h3 className="factor-column-title reducing-title">What is reducing resilience</h3>
            <ul className="factor-list">
              {variationLabel !== 'Low' && (
                <li className="factor-item reducing-item">
                  <span className="factor-bullet reducing-bullet" aria-hidden="true">⚠</span>
                  <span>Income variability month to month</span>
                </li>
              )}
              {emergencyMonths < targetLow && (
                <li className="factor-item reducing-item">
                  <span className="factor-bullet reducing-bullet" aria-hidden="true">⚠</span>
                  <span>Limited emergency coverage</span>
                </li>
              )}
              {earnings.workCosts.total > 0 && (
                <li className="factor-item reducing-item">
                  <span className="factor-bullet reducing-bullet" aria-hidden="true">⚠</span>
                  <span>Work-related costs reduce usable income</span>
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>

      {/* =========================
          10. ACTIONABLE NEXT STEP
          ========================= */}
      <section className="section-block action-section">
        <div className="action-card">
          <h2 className="action-title">Build My Emergency Buffer →</h2>
          <p className="action-sub">
            Strengthen the part of your resilience that absorbs income shocks first.
          </p>
          <NavLink to="/emergency" className="action-button">
            Go to Emergency Planning
          </NavLink>
        </div>
      </section>
    </div>
  );
}

export default Resilience;
