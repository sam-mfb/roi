import { useAppSelector } from '../../store/hooks';
import { selectResults } from '../../selectors/calculatorSelectors';
import { formatCurrency, formatNumber, formatPercentage } from '../../utils/formatters';

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
      label: 'Annual Labor Hours Recovered',
      value: formatNumber(results.laborHours, 1),
      description: 'Time saved for paralegals and attorneys',
      className: 'metric-card positive',
      suffix: 'hours',
    },
    {
      label: 'Net Annual Benefit',
      value: formatCurrency(results.netBenefit),
      description: 'Total value after Align costs',
      className: results.netBenefit >= 0 ? 'metric-card highlight positive' : 'metric-card highlight negative',
    },
    {
      label: 'ROI',
      value: formatPercentage(results.roi, 1),
      description: 'Return on investment percentage',
      className: results.roi >= 0 ? 'metric-card positive' : 'metric-card negative',
    },
    {
      label: 'Payback Period',
      value: results.paybackMonths > 0 ? formatNumber(results.paybackMonths, 1) : 'N/A',
      description: 'Months to recover your investment',
      className: 'metric-card',
      suffix: results.paybackMonths > 0 ? 'months' : '',
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
