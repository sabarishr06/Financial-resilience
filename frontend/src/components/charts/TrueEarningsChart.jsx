import { useMemo } from 'react';
import './TrueEarningsChart.css';

function TrueEarningsChart({ data }) {
  const { maxValue, bars } = useMemo(() => {
    if (!data || data.length === 0) return { maxValue: 0, bars: [] };

    const max = Math.max(...data.map(d => Math.max(d.grossIncome, d.workCosts, d.trueEarnings)));
    const chartBars = data.map(item => {
      const grossHeight = (item.grossIncome / max) * 180;
      const workCostsHeight = (item.workCosts / max) * 180;
      const trueEarningsHeight = (item.trueEarnings / max) * 180;

      return {
        month: item.month,
        grossHeight,
        workCostsHeight,
        trueEarningsHeight,
        grossIncome: item.grossIncome,
        workCosts: item.workCosts,
        trueEarnings: item.trueEarnings
      };
    });
    return { maxValue: max, bars: chartBars };
  }, [data]);

  const averages = useMemo(() => {
    if (!data || data.length === 0) return { gross: 0, costs: 0, true: 0 };

    const sum = data.reduce((acc, item) => ({
      gross: acc.gross + item.grossIncome,
      costs: acc.costs + item.workCosts,
      true: acc.true + item.trueEarnings
    }), { gross: 0, costs: 0, true: 0 });

    return {
      gross: Math.round(sum.gross / data.length),
      costs: Math.round(sum.costs / data.length),
      true: Math.round(sum.true / data.length)
    };
  }, [data]);

  return (
    <div className="true-earnings-chart">
      <div className="chart-header">
        <h3 className="chart-title">Earnings Trend</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot gross-income"></div>
            <span>Gross Income</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot work-costs"></div>
            <span>Work Costs</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot true-earnings"></div>
            <span>True Earnings</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="bar-chart">
          {bars.map((bar, index) => (
            <div key={index} className="bar-group">
              <div className="bars-grouped">
                <div
                  className="bar gross-income"
                  style={{ height: `${bar.grossHeight}px` }}
                  title={`Gross: ₹${bar.grossIncome.toLocaleString()}`}
                >
                  <span className="bar-value">₹{(bar.grossIncome / 1000).toFixed(1)}k</span>
                </div>
                <div
                  className="bar work-costs"
                  style={{ height: `${bar.workCostsHeight}px` }}
                  title={`Work Costs: ₹${bar.workCosts.toLocaleString()}`}
                >
                  <span className="bar-value">₹{(bar.workCosts / 1000).toFixed(1)}k</span>
                </div>
                <div
                  className="bar true-earnings"
                  style={{ height: `${bar.trueEarningsHeight}px` }}
                  title={`True Earnings: ₹${bar.trueEarnings.toLocaleString()}`}
                >
                  <span className="bar-value">₹{(bar.trueEarnings / 1000).toFixed(1)}k</span>
                </div>
              </div>
              <div className="bar-label">{bar.month.split(' ')[0]}</div>
              <div className="bar-sub-label">{bar.month.split(' ')[1]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-footer">
        <div className="chart-stat">
          <div className="chart-stat-value gross-income">
            ₹{(averages.gross / 1000).toFixed(1)}k
          </div>
          <div className="chart-stat-label">Avg Gross Income</div>
        </div>
        <div className="chart-stat">
          <div className="chart-stat-value work-costs">
            ₹{(averages.costs / 1000).toFixed(1)}k
          </div>
          <div className="chart-stat-label">Avg Work Costs</div>
        </div>
        <div className="chart-stat">
          <div className="chart-stat-value true-earnings">
            ₹{(averages.true / 1000).toFixed(1)}k
          </div>
          <div className="chart-stat-label">Avg True Earnings</div>
        </div>
      </div>
    </div>
  );
}

export default TrueEarningsChart;
