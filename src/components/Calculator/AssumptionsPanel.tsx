import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  updateAssumption,
  toggleAssumptions,
  resetToDefaults,
} from '../../store/calculatorSlice';
import type { CalculatorState } from '../../store/calculatorSlice';
import { useRef } from 'react';

interface AssumptionFieldProps {
  label: string;
  value: number;
  fieldKey: keyof CalculatorState;
  prefix?: string;
  suffix?: string;
  step?: number;
  description?: string;
  isPercentage?: boolean;
  sources?: { text: string; url: string }[];
}

const AssumptionField = ({
  label,
  value,
  fieldKey,
  prefix,
  suffix,
  step = 1,
  description,
  isPercentage = false,
  sources,
}: AssumptionFieldProps) => {
  const dispatch = useAppDispatch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value) || 0;
    // Convert percentage back to decimal for storage
    if (isPercentage) {
      newValue = newValue / 100;
    }
    dispatch(updateAssumption({ key: fieldKey, value: newValue }));
  };

  const increment = () => {
    inputRef.current?.stepUp();
    inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const decrement = () => {
    inputRef.current?.stepDown();
    inputRef.current?.dispatchEvent(new Event('input', { bubbles: true }));
  };

  return (
    <div className='assumption-field'>
      <label htmlFor={fieldKey}>
        {label}
        {description && (
          <span className='field-description'>{description}</span>
        )}
        {sources && sources.length > 0 && (
          <span className='field-sources'>
            Sources:{' '}
            {sources.map((source, idx) => (
              <span key={idx}>
                {idx > 0 && ', '}
                <a href={source.url} target='_blank' rel='noopener noreferrer'>
                  {source.text}
                </a>
              </span>
            ))}
          </span>
        )}
      </label>
      <div className='input-with-prefix number-field'>
        {prefix && <span className='prefix'>{prefix}</span>}
        <input
          ref={inputRef}
          id={fieldKey}
          type='number'
          value={value}
          onChange={handleChange}
          step={step}
          min='0'
          className={`${prefix ? 'number-field--prefix' : ''} ${
            suffix ? 'number-field--suffix' : ''
          }`}
        />
        <div className='spinner'>
          <button type='button' onClick={increment} aria-label='Increase'>
            <svg
              width='7'
              height='6'
              viewBox='0 0 7 6'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3.46484 -3.49691e-07L6.92895 5.25L0.000742656 5.25L3.46484 -3.49691e-07Z'
                fill='var(--_primitives---colors--purple, #2c024a)'
              />
            </svg>
          </button>
          <button type='button' onClick={decrement} aria-label='Decrease'>
            <svg
              width='7'
              height='6'
              viewBox='0 0 7 6'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M3.46484 5.25L0.000742453 1.75695e-07L6.92894 -4.29987e-07L3.46484 5.25Z'
                fill='var(--_primitives---colors--purple, #2c024a)'
              />
            </svg>
          </button>
        </div>
        {suffix && <span className='suffix'>{suffix}</span>}
      </div>
    </div>
  );
};

export const AssumptionsPanel = () => {
  const dispatch = useAppDispatch();
  const showAssumptions = useAppSelector(
    (state) => state.calculator.showAssumptions
  );
  const calc = useAppSelector((state) => state.calculator);

  const handleExport = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      assumptions: {
        activeCasesPerYear: calc.activeCasesPerYear,
        bindersPerCase: calc.bindersPerCase,
        pagesPerBinder: calc.pagesPerBinder,
        revisionsPerBinder: calc.revisionsPerBinder,
        copiesPerBinder: calc.copiesPerBinder,
        printCostPerPage: calc.printCostPerPage,
        binderMaterials: calc.binderMaterials,
        administrativeRate: calc.administrativeRate,
        attorneyRate: calc.attorneyRate,
        administrativeBuildHours: calc.administrativeBuildHours,
        administrativeRevisionHours: calc.administrativeRevisionHours,
        shipmentsPerBinder: calc.shipmentsPerBinder,
        shippingCostPerShipment: calc.shippingCostPerShipment,
        storageCost: calc.storageCost,
        administrativeTimeReduction: calc.administrativeTimeReduction,
        attorneyTimeSaved: calc.attorneyTimeSaved,
        physicalBindersReduction: calc.physicalBindersReduction,
        adoptionRate: calc.adoptionRate,
      },
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `align-roi-assumptions-${
      new Date().toISOString().split('T')[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className='assumptions-panel'>
      <div className='assumptions-header'>
        <button
          className='toggle-btn'
          onClick={() => dispatch(toggleAssumptions())}
        >
          {showAssumptions ? 'Hide' : 'Show'} Assumptions{' '}
          <svg
            width='7'
            height='6'
            viewBox='0 0 7 6'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            style={{
              marginTop: '4px',
              transform: `rotate(${showAssumptions ? '0deg' : '180deg'})`,
            }}
          >
            <path
              d='M3.46484 -3.49691e-07L6.92895 5.25L0.000742656 5.25L3.46484 -3.49691e-07Z'
              fill='#2C024A'
            />
          </svg>
        </button>
        {showAssumptions && (
          <div className='assumptions-actions'>
            <button
              className='reset-btn'
              onClick={() => dispatch(resetToDefaults())}
            >
              Reset to Defaults
            </button>
            <button className='export-btn' onClick={handleExport}>
              Export Assumptions
            </button>
          </div>
        )}
      </div>

      {showAssumptions && (
        <div className='assumptions-content'>
          <div className='assumption-section'>
            <h3>Case Composition</h3>
            <AssumptionField
              label='Binders created per case per year'
              value={calc.bindersPerCase}
              fieldKey='bindersPerCase'
              description='Annual binder production rate per active case (multiplied by cases/year for total volume)'
            />
            <AssumptionField
              label='Copies per binder'
              value={calc.copiesPerBinder}
              fieldKey='copiesPerBinder'
              description='Number of physical copies produced for each binder (multiplies print, materials, shipping, storage costs)'
            />
            <AssumptionField
              label='Pages per binder'
              value={calc.pagesPerBinder}
              fieldKey='pagesPerBinder'
              description='Pages per copy (total pages printed = pages × copies × revisions)'
            />
            <AssumptionField
              label='Revisions per binder'
              value={calc.revisionsPerBinder}
              fieldKey='revisionsPerBinder'
              description='Number of times binder content is updated/reprinted (multiplies paralegal revision work and reprint costs)'
            />
          </div>

          <div className='assumption-section'>
            <h3>Production Costs</h3>
            <AssumptionField
              label='Print cost per page'
              value={calc.printCostPerPage}
              fieldKey='printCostPerPage'
              prefix='$'
              step={0.01}
              description='Per page per copy (multiplied by pages × copies × (1 + revisions) for total print cost)'
              sources={[
                {
                  text: 'TonerBuzz',
                  url: 'https://www.tonerbuzz.com/blog/printing-costs/',
                },
                {
                  text: 'RTINGS',
                  url: 'https://www.rtings.com/printer/tests/printing/cost-per-print',
                },
              ]}
            />
            <AssumptionField
              label='Binder materials (tabs, dividers, hardware)'
              value={calc.binderMaterials}
              fieldKey='binderMaterials'
              prefix='$'
              description='Per copy cost for physical binder components (multiplied by copies per binder)'
              sources={[
                {
                  text: 'Walmart 3" Binders',
                  url: 'https://www.walmart.com/browse/walmart-for-business/3-inch-binders/6735581_3020544_5093993_3859294_8518720',
                },
                {
                  text: 'Staples Legal Tabs',
                  url: 'https://www.staples.com/buy/legal-exhibit-dividers-0alz03a',
                },
              ]}
            />
          </div>

          <div className='assumption-section'>
            <h3>Labor Rates</h3>
            <AssumptionField
              label='Administrative hourly rate'
              value={calc.administrativeRate}
              fieldKey='administrativeRate'
              prefix='$'
              suffix='/hr'
              description='Blended cost per hour for administrative staff (paralegals, assistants). Used to calculate cost savings from admin time freed.'
              sources={[
                {
                  text: 'BLS Occupational Outlook',
                  url: 'https://www.bls.gov/ooh/Legal/Paralegals-and-legal-assistants.htm',
                },
                {
                  text: 'BLS ECEC Benefits Data',
                  url: 'https://www.bls.gov/news.release/archives/ecec_09102024.pdf',
                },
              ]}
            />
            <AssumptionField
              label='Attorney net billable rate'
              value={calc.attorneyRate}
              fieldKey='attorneyRate'
              prefix='$'
              suffix='/hr'
              description='Net value per hour of billable work (billable rate minus cost). Used to value recovered attorney time.'
              sources={[
                {
                  text: 'Clio Legal Trends Report',
                  url: 'https://www.clio.com/resources/legal-trends/',
                },
                {
                  text: 'Thomson Reuters Legal Market 2025',
                  url: 'https://www.thomsonreuters.com/en-us/posts/wp-content/uploads/sites/20/2025/01/State-of-the-US-Legal-Market-Report-2025.pdf',
                },
              ]}
            />
          </div>

          <div className='assumption-section'>
            <h3>Administrative Effort (Physical Workflow)</h3>
            <AssumptionField
              label='Administrative hours to build one binder'
              value={calc.administrativeBuildHours}
              fieldKey='administrativeBuildHours'
              suffix='/hr'
              step={0.1}
              description='Time for admin staff to create all copies of one binder initially (not multiplied by copies - all made together)'
            />
            <AssumptionField
              label='Administrative hours per revision'
              value={calc.administrativeRevisionHours}
              fieldKey='administrativeRevisionHours'
              suffix='/hr'
              step={0.1}
              description='Time for admin staff per revision to update all copies (multiplied by revisions per binder)'
            />
          </div>

          <div className='assumption-section'>
            <h3>Logistics & Storage</h3>
            <AssumptionField
              label='Shipments per binder copy'
              value={calc.shipmentsPerBinder}
              fieldKey='shipmentsPerBinder'
              description='Number of courier shipments per copy (total shipments = shipments × copies)'
            />
            <AssumptionField
              label='Shipping cost per shipment'
              value={calc.shippingCostPerShipment}
              fieldKey='shippingCostPerShipment'
              prefix='$'
              description='Cost per courier delivery (multiplied by shipments × copies)'
              sources={[
                {
                  text: 'FedEx One Rate 2025',
                  url: 'https://www.fedex.com/content/dam/fedex/us-united-states/services/OneRate-Pricing_2025.pdf',
                },
              ]}
            />
            <AssumptionField
              label='Storage/destruction cost per binder copy'
              value={calc.storageCost}
              fieldKey='storageCost'
              prefix='$'
              step={0.1}
              description='Annual cost per copy (blended: 50% stored @ $3/yr, 50% destroyed @ $2)'
              sources={[
                {
                  text: 'Record Nations',
                  url: 'https://www.recordnations.com/resources/cost-document-storage/',
                },
                {
                  text: 'EY Storage Insights',
                  url: 'https://www.ey.com/en_us/insights/forensic-integrity-services/reduce-operating-costs-by-limiting-off-site-storage-use',
                },
                {
                  text: 'UVA Records Management',
                  url: 'https://recordsmanagement.virginia.edu/services-pricing',
                },
              ]}
            />
          </div>

          <div className='assumption-section'>
            <h3>Align Efficiency Gains</h3>
            <AssumptionField
              label='Administrative time reduced'
              value={calc.administrativeTimeReduction * 100}
              fieldKey='administrativeTimeReduction'
              suffix='%'
              step={1}
              isPercentage={true}
              description='Percentage of administrative time saved with Align (reduces total admin hours: build + revision work by paralegals and assistants)'
            />
            <AssumptionField
              label='Attorney time saved per case'
              value={calc.attorneyTimeSaved}
              fieldKey='attorneyTimeSaved'
              suffix='/hr'
              step={0.1}
              description='Hours per case per year freed from admin work for billable activities (allocated across binders, multiplied by net billable rate)'
            />
            <AssumptionField
              label='Physical binders avoided (going digital)'
              value={calc.physicalBindersReduction * 100}
              fieldKey='physicalBindersReduction'
              suffix='%'
              step={1}
              isPercentage={true}
              description='Percentage of binders delivered digitally instead of physically (reduces all physical costs: printing, materials, shipping, storage)'
            />
          </div>

          <div className='assumption-section'>
            <h3>Adoption</h3>
            <AssumptionField
              label='Adoption rate'
              value={calc.adoptionRate * 100}
              fieldKey='adoptionRate'
              suffix='%'
              step={1}
              isPercentage={true}
              description='Percentage of active cases using Align (scales all benefits - e.g., 70% adoption on 100 cases = 70 cases worth of savings)'
            />
          </div>
        </div>
      )}
    </div>
  );
};
