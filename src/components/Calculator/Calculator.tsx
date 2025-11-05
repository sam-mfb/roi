import { InputPanel } from './InputPanel';
import { ResultsPanel } from './ResultsPanel';
import { AssumptionsPanel } from './AssumptionsPanel';
import './Calculator.css';

export const Calculator = () => {
  return (
    <div className="calculator-container">
      <header className="calculator-header">
        <h1>Align ROI Calculator</h1>
        <p className="subtitle">Calculate your return on investment for digital litigation binders</p>
      </header>

      <div className="calculator-layout">
        <InputPanel />
        <ResultsPanel />
        <AssumptionsPanel />
      </div>
    </div>
  );
};
