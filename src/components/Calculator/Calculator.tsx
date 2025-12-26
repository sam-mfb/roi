import { InputPanel } from './InputPanel';
import { ResultsPanel } from './ResultsPanel';
import { AssumptionsPanel } from './AssumptionsPanel';
import './Calculator.css';
import { useRef } from 'react';
import { useIframeHeight } from '../../utils/useIframeHeight';

export const Calculator = () => {
  const containerRef = useRef<HTMLElement | null>(null);

  useIframeHeight(containerRef);

  return (
    <section ref={containerRef} className='calculator-section'>
      <div className='calculator-header'>
        <h2>Calculate Your Savings with Align</h2>
      </div>

      <div className='calculator-layout'>
        <InputPanel />
        <ResultsPanel />
        <AssumptionsPanel />
      </div>
    </section>
  );
};
