import { useAppSelector } from '../../store/hooks';
import { selectResults } from '../../selectors/calculatorSelectors';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const ResultsPanel = () => {
  const results = useAppSelector(selectResults);

  const metrics = [
    {
      label: 'Annual Hard Cost Savings',
      value: formatCurrency(results.hardCostSavings),
      description: 'Direct cost reductions in printing, shipping, and materials',
      className: 'metric-card positive',
    },
    {
      label: 'Nonbillable Hours Saved',
      value: formatNumber(results.paralegalHours, 1),
      description: 'Paralegal time saved (cost reduction)',
      className: 'metric-card positive',
      suffix: 'hours',
    },
    {
      label: 'Increased Billable Hours',
      value: formatNumber(results.attorneyHours, 1),
      description: 'Attorney time freed for billable work (revenue opportunity)',
      className: 'metric-card positive',
      suffix: 'hours',
    },
    {
      label: 'Total Annual Benefit',
      value: formatCurrency(results.totalBenefit),
      description: 'Total annual value generated from all savings',
      className: 'metric-card highlight positive',
    },
  ];

  return (
    <div className="results-panel">
      <h2>Your Results</h2>
      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className={metric.className}>
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">
              {metric.value}
              {metric.suffix && <span className="metric-suffix"> {metric.suffix}</span>}
            </div>
            <div className="metric-description">{metric.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
