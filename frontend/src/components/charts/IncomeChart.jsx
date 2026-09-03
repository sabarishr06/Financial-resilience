import { useMemo } from 'react';
import './IncomeChart.css';

function IncomeChart({ data }) {
  const { maxValue, bars } = useMemo(() => {
    const max = Math.max(...data.map(d => Math.max(d.income, d.expenses)));
    const chartBars = data.map(item => {
      const incomeHeight = (item.income / max) * 180;
      const expensesHeight = (item.expenses / max) * 180;
      return {
        month: item.month,
        incomeHeight,
        expensesHeight,
        income: item.income,
        expenses: item.expenses
      };
    });
    return { maxValue: max, bars: chartBars };
  }, [data]);

  const totals = useMemo(() => {
    const totalIncome = data.reduce((sum, item) => sum + item.income, 0);
    const totalExpenses = data.reduce((sum, item) => sum + item.expenses, 0);
    return { income: totalIncome, expenses: totalExpenses };
  }, [data]);

  return (
    <div className="income-chart">
      <div className="chart-header">
        <h3 className="chart-title">Income vs Expenses</h3>
        <div className="chart-legend">
          <div className="legend-item">
            <div className="legend-dot income"></div>
            <span>Income</span>
          </div>
          <div className="legend-item">
            <div className="legend-dot expenses"></div>
            <span>Expenses</span>
          </div>
        </div>
      </div>

      <div className="chart-container">
        <div className="bar-chart">
          {bars.map((bar, index) => (
            <div key={index} className="bar-group">
              <div
                className="bar income"
                style={{ height: `${bar.incomeHeight}px` }}
              >
                <span className="bar-value">₹{bar.income.toLocaleString()}</span>
              </div>
              <div
                className="bar expenses"
                style={{ height: `${bar.expensesHeight}px` }}
              >
                <span className="bar-value">₹{bar.expenses.toLocaleString()}</span>
              </div>
              <div className="bar-label">{bar.month.split(' ')[0]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-footer">
        <div className="chart-stat">
          <div className="chart-stat-value income">
            ₹{(totals.income / data.length).toLocaleString()}
          </div>
          <div className="chart-stat-label">Avg Monthly Income</div>
        </div>
        <div className="chart-stat">
          <div className="chart-stat-value expenses">
            ₹{(totals.expenses / data.length).toLocaleString()}
          </div>
          <div className="chart-stat-label">Avg Monthly Expenses</div>
        </div>
        <div className="chart-stat">
          <div className="chart-stat-value">
            ₹{((totals.income - totals.expenses) / data.length).toLocaleString()}
          </div>
          <div className="chart-stat-label">Avg Monthly Savings</div>
        </div>
      </div>
    </div>
  );
}

export default IncomeChart;
