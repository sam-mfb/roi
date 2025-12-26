import { useAppSelector } from '../../store/hooks';
import { selectResults } from '../../selectors/calculatorSelectors';
import { formatCurrency, formatNumber } from '../../utils/formatters';

export const ResultsPanel = () => {
  const results = useAppSelector(selectResults);

  const metrics = [
    {
      label: 'Hard Cost Savings',
      value: formatCurrency(results.hardCostSavings),
      description:
        'Direct cost reductions in printing, shipping, and materials',
      className: 'metric-card',
    },
    {
      label: 'Nonbillable Hours Saved',
      value: formatNumber(results.administrativeHours, 1),
      description:
        'Administrative time saved by paralegals and assistants (cost reduction)',
      className: 'metric-card',
      suffix: 'hours',
      subValue: formatCurrency(results.administrativeValue),
    },
    {
      label: 'Increased Billable Hours',
      value: formatNumber(results.attorneyHours, 1),
      description:
        'Attorney time freed for billable work (revenue opportunity)',
      className: 'metric-card',
      suffix: 'hours',
      subValue: formatCurrency(results.attorneyValue),
    },
    {
      label: 'Total Benefit',
      value: formatCurrency(results.totalBenefit),
      description: 'Total annual value generated from all savings',
      className: 'metric-card',
    },
  ];

  return (
    <div className='results-panel'>
      <h2>Annual Results</h2>
      <div className='metrics-grid'>
        {metrics.map((metric, index) => (
          <div key={index} className={metric.className}>
            <div className='metric-label'>{metric.label}</div>
            <div className='metric-content'>
              <div className='metric-value'>{metric.value}</div>
              {(metric.suffix || metric.subValue) && (
                <div className='metric-box'>
                  {metric.suffix && (
                    <span className='metric-suffix'> {metric.suffix}</span>
                  )}
                  {metric.subValue && (
                    <span className='metric-subvalue'>({metric.subValue})</span>
                  )}
                </div>
              )}
            </div>
            <div className='metric-description'>{metric.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
