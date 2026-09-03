import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import MetricCard from '../components/common/MetricCard';
import SectionHeader from '../components/common/SectionHeader';
import AlertCard from '../components/common/AlertCard';
import IncomeChart from '../components/charts/IncomeChart';
import ResilienceFactor from '../components/charts/ResilienceFactor';
import { mockUserData, mockFinancialData, mockHistoricalData, mockShockPreview } from '../data/mockData';

import './Overview.css';

function Overview() {
  const userName = mockUserData.name;
  const financial = mockFinancialData;
  const resilience = financial.resilience;
  const historical = mockHistoricalData;

  // Calculate True Earnings (income after work expenses)
  const trueEarnings = financial.trueEarnings || financial.income.total - financial.workExpenses.total;

  // Chart data from historical
  const chartData = useMemo(() => {
    if (!historical || historical.length === 0) return null;
    return historical;
  }, [historical]);

  // What if section data
  const shockPreview = mockShockPreview || {
    daysLost: 7,
    estimatedImpact: 1560,
    currentScore: 64,
    projectedScore: 47
  };

  // Attention card data
  const emergencyMonths = resilience.emergencyMonths;
  const recommendedMin = 3;
  const recommendedMax = 6;

  return (
    <div className="overview-page">
      {/* =========================
          1. Welcome / Status Header
          ========================= */}
      <header className="welcome-header">
        <div className="welcome-content">
          <div className="welcome-text">
            <h2 className="welcome-title">Good evening, {userName}</h2>
            <p className="welcome-subtitle">
              Here's how your financial resilience looks this month.
            </p>
          </div>
          <div className="welcome-avatar">JD</div>
        </div>
      </header>

      {/* =========================
          2. KEY METRIC CARDS
          ========================= */}
      <div className="metric-cards-row">
        <MetricCard
          label="True Earnings"
          value={`₹${trueEarnings.toLocaleString()}`}
          description="Income after work-related expenses"
          trend={{ type: 'positive', value: '↑ 12% this month' }}
        />
        <MetricCard
          label="Resilience Score"
          value={`${resilience.score} / 100`}
          description="Your financial health rating"
          trend={{ type: 'positive', value: '↑ 5 pts last month' }}
          highlight={true}
        />
        <MetricCard
          label="Emergency Coverage"
          value={`${resilience.emergencyMonths} months`}
          description="Months of expenses covered"
          trend={{ type: resilience.emergencyMonths >= 3 ? 'positive' : 'warning', value: `${resilience.emergencyMonths} of ${recommendedMin}-${recommendedMax} months target` }}
        />
        <MetricCard
          label="Income Stability"
          value={resilience.incomeStability}
          description="Based on income consistency over 6 months"
          trend={{ type: 'neutral', value: '' }}
        />
      </div>

      {/* =========================
          3. INCOME VS EXPENSES
          ========================= */}
      <SectionHeader
        title="Income & Expenses"
        subtitle="Recent financial trend"
        action={
          <NavLink to="/simulator" className="section-action">
            View Full Simulator →
          </NavLink>
        }
      />
      <IncomeChart data={chartData} />

      {/* =========================
          4. FINANCIAL RESILIENCE SECTION
          ========================= */}
      <SectionHeader
        title="Financial Resilience"
        subtitle="Understanding your risk factors"
      />
      <div className="resilience-section">
        <p className="resilience-intro">
          Your resilience score of {resilience.score}/100 reflects your ability to absorb financial shocks.
          The score considers multiple factors that contribute to your overall financial health.
        </p>
        <div className="resilience-factors">
          <ResilienceFactor name="Income Stability" value={resilience.factors.incomeStability} />
          <ResilienceFactor name="Emergency Coverage" value={resilience.factors.emergencyCoverage} />
          <ResilienceFactor name="Debt Burden" value={resilience.factors.debtBurden} />
          <ResilienceFactor name="Expense Health" value={resilience.factors.expenseHealth} />
        </div>
      </div>

      {/* =========================
          5. "WHAT IF?" SHOCK PREVIEW
          ========================= */}
      <SectionHeader
        title="💡 What If?"
        subtitle="Financial shock scenarios"
      />
      <div className="what-if-section">
        <AlertCard
          icon="💥"
          title={`What if you couldn't work for ${shockPreview.daysLost} days?`}
          message={`Estimated financial impact: ₹${shockPreview.estimatedImpact.toLocaleString()}`}
          action={`Your resilience score could fall from ${shockPreview.currentScore} → ${shockPreview.projectedScore}`}
        />
        <NavLink to="/simulator" className="explore-link">
          Explore Scenario →
        </NavLink>
      </div>

      {/* =========================
          6. EARLY WARNING / ATTENTION CARD
          ========================= */}
      <AlertCard
        icon="⚠️"
        title="Needs Attention"
        message={`Your emergency fund currently covers only ${resilience.emergencyMonths} months of essential expenses. Recommended target: ${recommendedMin}–${recommendedMax} months`}
        action={`Build savings to reach ${recommendedMin} months of expenses`}
      />

      {/* =========================
          7. QUICK ACTIONS
          ========================= */}
      <SectionHeader title="Quick Actions" />
      <div className="quick-actions">
        <NavLink to="/earnings" className="quick-action-card">
          <div className="quick-action-icon">💰</div>
          <div className="quick-action-label">View Earnings</div>
          <div className="quick-action-sublabel">Details</div>
        </NavLink>
        <NavLink to="/resilience" className="quick-action-card">
          <div className="quick-action-icon">🛡️</div>
          <div className="quick-action-label">Check Resilience</div>
          <div className="quick-action-sublabel">Analysis</div>
        </NavLink>
        <NavLink to="/forecast" className="quick-action-card">
          <div className="quick-action-icon">📈</div>
          <div className="quick-action-label">View Forecast</div>
          <div className="quick-action-sublabel">Projections</div>
        </NavLink>
        <NavLink to="/ai-guide" className="quick-action-card">
          <div className="quick-action-icon">🤖</div>
          <div className="quick-action-label">Ask AI Guide</div>
          <div className="quick-action-sublabel">Guidance</div>
        </NavLink>
      </div>
    </div>
  );
}

export default Overview;
