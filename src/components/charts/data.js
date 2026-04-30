export const kpiData = [
  {
    kpiName: 'Hospital Mortality Rate',
    kpiData: [
      { category: 'Q1', value: 2.0 },
      { category: 'Q2', value: 1.8 },
      { category: 'Q3', value: 2.2 },
      { category: 'Q4', value: 2.1 },
    ],
    chartType: 'Line', // Line chart to track the trend over time
    unit: '%' // Percentage display
  },
  {
    kpiName: 'Nosocomial Infection Rate',
    kpiData: [
      { category: 'Q1', value: 5.1 },
      { category: 'Q2', value: 4.9 },
      { category: 'Q3', value: 5.3 },
      { category: 'Q4', value: 4.8 },
    ],
    chartType: 'Line',
    unit: '%'
  },
  {
    kpiName: '30-Day Readmission Rate',
    kpiData: [
      { category: 'Q1', value: 12.3 },
      { category: 'Q2', value: 11.7 },
      { category: 'Q3', value: 13.0 },
      { category: 'Q4', value: 12.5 },
    ],
    chartType: 'Line',
    unit: '%'
  },
  {
    kpiName: 'Postoperative Complication Rate',
    kpiData: [
      { category: 'Q1', value: 8.1 },
      { category: 'Q2', value: 7.9 },
      { category: 'Q3', value: 8.5 },
      { category: 'Q4', value: 8.3 },
    ],
    chartType: 'Line',
    unit: '%'
  },
  {
    kpiName: 'Patient Satisfaction Score',
    kpiData: [
      { category: 'Q1', value: 85 },
      { category: 'Q2', value: 87 },
      { category: 'Q3', value: 86 },
      { category: 'Q4', value: 84 },
    ],
    chartType: 'Column',
    unit: '',
  },
  {
    kpiName: 'Bed Occupancy Rate',
    kpiData: [
      { category: 'Q1', value: 75 },
      { category: 'Q2', value: 78 },
      { category: 'Q3', value: 77 },
      { category: 'Q4', value: 76 },
    ],
    chartType: 'Line',
    unit: '%'
  },
  {
    kpiName: 'Average Length of Stay (ALOS)',
    kpiData: [
      { category: 'Q1', value: 4.5 },
      { category: 'Q2', value: 4.7 },
      { category: 'Q3', value: 4.6 },
      { category: 'Q4', value: 4.8 },
    ],
    chartType: 'Line',
    unit: 'days'
  },
  {
    kpiName: 'Bed Turnover Rate',
    kpiData: [
      { category: 'Q1', value: 20 },
      { category: 'Q2', value: 21 },
      { category: 'Q3', value: 19 },
      { category: 'Q4', value: 22 },
    ],
    chartType: 'Line',
    unit: '' // Number value
  },
  {
    kpiName: 'Operating Room Utilization Rate',
    kpiData: [
      { category: 'Q1', value: 85 },
      { category: 'Q2', value: 82 },
      { category: 'Q3', value: 88 },
      { category: 'Q4', value: 84 },
    ],
    chartType: 'Line',
    unit: '%'
  },
  {
    kpiName: 'Average Emergency Waiting Time',
    kpiData: [
      { category: 'Q1', value: 30 },
      { category: 'Q2', value: 32 },
      { category: 'Q3', value: 28 },
      { category: 'Q4', value: 31 },
    ],
    chartType: 'Bar',
    unit: 'minutes'
  },
  {
    kpiName: 'Gross Operating Margin',
    kpiData: [
      { category: 'Q1', value: 20 },
      { category: 'Q2', value: 22 },
      { category: 'Q3', value: 21 },
      { category: 'Q4', value: 19 },
    ],
    chartType: 'Line',
    unit: '%'
  },
  {
    kpiName: 'Cost per Admission',
    kpiData: [
      { category: 'Q1', value: 3500 },
      { category: 'Q2', value: 3400 },
      { category: 'Q3', value: 3600 },
      { category: 'Q4', value: 3550 },
    ],
    chartType: 'Bar',
    unit: 'USD'
  },
  {
    kpiName: 'Cost-to-Revenue Ratio',
    kpiData: [
      { category: 'Q1', value: 0.75 },
      { category: 'Q2', value: 0.78 },
      { category: 'Q3', value: 0.76 },
      { category: 'Q4', value: 0.77 },
    ],
    chartType: 'Line',
    unit: '' // Ratio value
  },
  {
    kpiName: 'Accounts Receivable Recovery Rate',
    kpiData: [
      { category: 'Collected', value: 95 },
      { category: 'Not Collected', value: 5 },
    ],
    chartType: 'Pie',
    unit: '%' // Shows how much is collected vs. not collected
  }
];
