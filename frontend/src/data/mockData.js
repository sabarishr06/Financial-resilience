// Mock financial data for development and testing

export const mockUserData = {
  userId: 'user_123',
  name: 'John Doe',
  lastUpdated: '2026-09-03'
};

export const mockFinancialData = {
  // Monthly income breakdown
  income: {
    salary: 5000,
    freelance: 1200,
    investments: 300,
    other: 200,
    total: 6700
  },

  // Monthly expenses
  expenses: {
    housing: 1500,
    utilities: 300,
    transportation: 400,
    food: 600,
    healthcare: 200,
    entertainment: 250,
    other: 350,
    total: 3600
  },

  // Work-related expenses (for resilience calculation)
  workExpenses: {
    transportation: 200,
    equipment: 100,
    professional: 150,
    total: 450
  },

  // Savings and assets
  savings: {
    emergencyFund: 12000,
    savingsAccount: 8000,
    investments: 15000,
    total: 35000
  },

  // Debt information
  debt: {
    creditCard: 2500,
    studentLoan: 15000,
    carLoan: 8000,
    total: 25500
  },

  // Resilience metrics
  resilience: {
    score: 64,
    emergencyMonths: 2.4,
    incomeStability: 'Medium',
    debtToIncome: 0.38,
    savingsRate: 0.22,
    riskLevel: 'Moderate',
    // Sub-scores for resilience breakdown
    factors: {
      incomeStability: 72,
      emergencyCoverage: 45,
      debtBurden: 68,
      expenseHealth: 61
    }
  },

  // True earnings (income after work expenses)
  trueEarnings: 6700 - 450, // 6250 (legacy calc; use mockTrueEarningsData for gig worker values)

  // Resilience-specific fields for the Resilience page (gig/informal worker values)
  emergencyFund: 48000,
  essentialMonthlyExpenses: 20000,
  monthlyDebtObligations: 4500,
  incomeVariationLabel: 'Moderate',
  lowestMonthIncome: 26500,
  highestMonthIncome: 30000,
  averageMonthlyGrossIncome: 28300,
  trueEarningsCurrent: 23500,
  shockScenarioReductionPercent: 30,
  incomeSourcesCount: 3
};

// Historical data for charts (last 6 months)
export const mockHistoricalData = [
  { month: 'Mar 2026', income: 6500, expenses: 3400, savings: 3100 },
  { month: 'Apr 2026', income: 6400, expenses: 3550, savings: 2850 },
  { month: 'May 2026', income: 6700, expenses: 3600, savings: 3100 },
  { month: 'Jun 2026', income: 6800, expenses: 3650, savings: 3150 },
  { month: 'Jul 2026', income: 6600, expenses: 3700, savings: 2900 },
  { month: 'Aug 2026', income: 6700, expenses: 3600, savings: 3100 }
];

// Forecast data (next 6 months projection)
export const mockForecastData = [
  { month: 'Sep 2026', projected: 6800, optimistic: 7200, pessimistic: 6400 },
  { month: 'Oct 2026', projected: 6900, optimistic: 7400, pessimistic: 6500 },
  { month: 'Nov 2026', projected: 7000, optimistic: 7600, pessimistic: 6600 },
  { month: 'Dec 2026', projected: 7100, optimistic: 7800, pessimistic: 6700 },
  { month: 'Jan 2027', projected: 7200, optimistic: 8000, pessimistic: 6800 },
  { month: 'Feb 2027', projected: 7300, optimistic: 8200, pessimistic: 6900 }
];

// Emergency scenarios
export const mockEmergencyScenarios = [
  {
    id: 1,
    name: 'Job Loss',
    impact: 'High',
    monthsCovered: 3.3,
    recommendation: 'Build emergency fund to 6 months'
  },
  {
    id: 2,
    name: 'Medical Emergency',
    impact: 'Medium',
    monthsCovered: 5.2,
    recommendation: 'Review health insurance coverage'
  },
  {
    id: 3,
    name: 'Car Breakdown',
    impact: 'Low',
    monthsCovered: 12,
    recommendation: 'Adequate reserves available'
  }
];

// Shock scenario preview for dashboard
export const mockShockPreview = {
  scenario: 'Unable to work for 7 days',
  daysLost: 7,
  estimatedImpact: 1560, // ~7 days of daily income (6700/30 * 7)
  currentScore: 64,
  projectedScore: 47,
  description: 'Your resilience score could fall significantly if you miss a week of work'
};

// True Earnings data (gig/informal worker specific)
export const mockTrueEarningsData = {
  // Current month earnings breakdown
  grossIncome: 30000,
  workCosts: {
    fuelTransportation: 3000,
    platformFees: 1500,
    equipment: 1000,
    phoneData: 500,
    other: 500,
    total: 6500
  },
  trueEarnings: 23500, // grossIncome - workCosts.total
  effectiveRate: 78.3, // percentage of gross income retained

  // Income sources breakdown
  incomeSources: [
    { name: 'Delivery / Gig Work', amount: 18000, percentage: Math.round((18000 / 30000) * 1000) / 10 },
    { name: 'Freelance', amount: 7000, percentage: Math.round((7000 / 30000) * 1000) / 10 },
    { name: 'Other Work', amount: 5000, percentage: Math.round((5000 / 30000) * 1000) / 10 }
  ],

  // Work costs breakdown (for pie/bar visualization)
  workCostBreakdown: [
    { name: 'Fuel / Transportation', amount: 3000, percentage: Math.round((3000 / 6500) * 1000) / 10 },
    { name: 'Platform Fees', amount: 1500, percentage: Math.round((1500 / 6500) * 1000) / 10 },
    { name: 'Equipment', amount: 1000, percentage: Math.round((1000 / 6500) * 1000) / 10 },
    { name: 'Phone / Data', amount: 500, percentage: Math.round((500 / 6500) * 1000) / 10 },
    { name: 'Other', amount: 500, percentage: Math.round((500 / 6500) * 1000) / 10 }
  ],

  // Working hours estimate
  workingHours: {
    hoursPerDay: 8,
    daysPerMonth: 22,
    totalHours: 176,
    effectiveHourlyRate: Math.round((30000 - 6500) / 176 * 100) / 100 // trueEarnings / totalHours
  },

  // Key insight
  keyInsight: {
    costReductionPercent: 21.7, // (workCosts / grossIncome) * 100
    message: 'Your work costs reduced your income by 21.7% this month.',
    explanation: 'For every ₹100 you earned, approximately ₹22 went toward the cost of working.'
  },

  // Improvement opportunities (sorted by amount)
  improvementAreas: [
    { name: 'Fuel / Transportation', amount: 3000, reason: 'Largest work-related cost' },
    { name: 'Platform Fees', amount: 1500, reason: 'Second-largest cost' },
    { name: 'Equipment', amount: 1000, reason: 'Consider sharing or renting equipment' }
  ]
};

// Historical True Earnings data (last 6 months)
export const mockTrueEarningsHistory = [
  { month: 'Apr 2026', grossIncome: 28000, workCosts: 5800, trueEarnings: 22200 },
  { month: 'May 2026', grossIncome: 26500, workCosts: 5500, trueEarnings: 21000 },
  { month: 'Jun 2026', grossIncome: 29000, workCosts: 6200, trueEarnings: 22800 },
  { month: 'Jul 2026', grossIncome: 27500, workCosts: 6000, trueEarnings: 21500 },
  { month: 'Aug 2026', grossIncome: 28500, workCosts: 6300, trueEarnings: 22200 },
  { month: 'Sep 2026', grossIncome: 30000, workCosts: 6500, trueEarnings: 23500 }
];

export const mockAIRecommendations = [
  {
    id: 1,
    category: 'Savings',
    priority: 'High',
    title: 'Increase Emergency Fund',
    description: 'Your emergency fund covers 2.4 months of expenses. Aim for 6 months to improve resilience.',
    action: 'Save an additional ₹500/month'
  },
  {
    id: 2,
    category: 'Debt',
    priority: 'Medium',
    title: 'Pay Down Credit Card',
    description: 'High-interest credit card debt is impacting your financial health.',
    action: 'Allocate $300/month to credit card payments'
  },
  {
    id: 3,
    category: 'Income',
    priority: 'Medium',
    title: 'Diversify Income Sources',
    description: 'You have good freelance income. Consider growing this stream.',
    action: 'Explore additional freelance opportunities'
  }
];
