import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { updateAssumption, toggleAssumptions, resetToDefaults } from '../../store/calculatorSlice';
import type { CalculatorState } from '../../store/calculatorSlice';

interface AssumptionFieldProps {
  label: string;
  value: number;
  fieldKey: keyof CalculatorState;
  prefix?: string;
  suffix?: string;
  step?: number;
  description?: string;
  isPercentage?: boolean;
}

const AssumptionField = ({ label, value, fieldKey, prefix, suffix, step = 1, description, isPercentage = false }: AssumptionFieldProps) => {
  const dispatch = useAppDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = parseFloat(e.target.value) || 0;
    // Convert percentage back to decimal for storage
    if (isPercentage) {
      newValue = newValue / 100;
    }
    dispatch(updateAssumption({ key: fieldKey, value: newValue }));
  };

  return (
    <div className="assumption-field">
      <label htmlFor={fieldKey}>
        {label}
        {description && <span className="field-description">{description}</span>}
      </label>
      <div className="input-with-prefix">
        {prefix && <span className="prefix">{prefix}</span>}
        <input
          id={fieldKey}
          type="number"
          value={value}
          onChange={handleChange}
          step={step}
          min="0"
        />
        {suffix && <span className="suffix">{suffix}</span>}
      </div>
    </div>
  );
};

export const AssumptionsPanel = () => {
  const dispatch = useAppDispatch();
  const showAssumptions = useAppSelector((state) => state.calculator.showAssumptions);
  const calc = useAppSelector((state) => state.calculator);

  return (
    <div className="assumptions-panel">
      <div className="assumptions-header">
        <button
          className="toggle-btn"
          onClick={() => dispatch(toggleAssumptions())}
        >
          {showAssumptions ? '▼' : '▶'} {showAssumptions ? 'Hide' : 'Show'} Assumptions
        </button>
        {showAssumptions && (
          <button
            className="reset-btn"
            onClick={() => dispatch(resetToDefaults())}
          >
            Reset to Defaults
          </button>
        )}
      </div>

      {showAssumptions && (
        <div className="assumptions-content">
          <div className="assumption-section">
            <h3>Case Composition</h3>
            <AssumptionField
              label="Binders per case"
              value={calc.bindersPerCase}
              fieldKey="bindersPerCase"
            />
            <AssumptionField
              label="Pages per binder"
              value={calc.pagesPerBinder}
              fieldKey="pagesPerBinder"
            />
            <AssumptionField
              label="Revisions per binder"
              value={calc.revisionsPerBinder}
              fieldKey="revisionsPerBinder"
            />
          </div>

          <div className="assumption-section">
            <h3>Production Costs</h3>
            <AssumptionField
              label="Print cost per page"
              value={calc.printCostPerPage}
              fieldKey="printCostPerPage"
              prefix="$"
              step={0.01}
            />
            <AssumptionField
              label="Tabs & dividers per binder"
              value={calc.tabsPerBinder}
              fieldKey="tabsPerBinder"
              prefix="$"
            />
            <AssumptionField
              label="Binder hardware"
              value={calc.binderHardware}
              fieldKey="binderHardware"
              prefix="$"
            />
          </div>

          <div className="assumption-section">
            <h3>Labor Rates</h3>
            <AssumptionField
              label="Paralegal hourly rate"
              value={calc.paralegalRate}
              fieldKey="paralegalRate"
              prefix="$"
              suffix="/hr"
            />
            <AssumptionField
              label="Attorney net billable rate"
              value={calc.attorneyRate}
              fieldKey="attorneyRate"
              prefix="$"
              suffix="/hr"
              description="Billable rate minus avg cost per attorney"
            />
          </div>

          <div className="assumption-section">
            <h3>Labor Effort (Physical Workflow)</h3>
            <AssumptionField
              label="Paralegal hours to build one binder"
              value={calc.paralegalBuildHours}
              fieldKey="paralegalBuildHours"
              suffix="hrs"
              step={0.1}
            />
            <AssumptionField
              label="Paralegal hours per revision"
              value={calc.paralegalRevisionHours}
              fieldKey="paralegalRevisionHours"
              suffix="hrs"
              step={0.1}
            />
            <AssumptionField
              label="Attorney hours lost per revision"
              value={calc.attorneyRevisionHours}
              fieldKey="attorneyRevisionHours"
              suffix="hrs"
              step={0.1}
            />
            <AssumptionField
              label="Attorney hours to locate/transport binders"
              value={calc.attorneyLocateHours}
              fieldKey="attorneyLocateHours"
              suffix="hrs"
              step={0.1}
            />
          </div>

          <div className="assumption-section">
            <h3>Logistics & Storage</h3>
            <AssumptionField
              label="Shipments per binder"
              value={calc.shipmentsPerBinder}
              fieldKey="shipmentsPerBinder"
            />
            <AssumptionField
              label="Shipping cost per shipment"
              value={calc.shippingCostPerShipment}
              fieldKey="shippingCostPerShipment"
              prefix="$"
            />
            <AssumptionField
              label="Storage/destruction cost (blended)"
              value={calc.storageCost}
              fieldKey="storageCost"
              prefix="$"
              step={0.1}
              description="50% stored @ $3/yr, 50% destroyed @ $2"
            />
          </div>

          <div className="assumption-section">
            <h3>Align Efficiency Gains</h3>
            <AssumptionField
              label="Paralegal binder build time reduced"
              value={calc.paralegalBuildReduction * 100}
              fieldKey="paralegalBuildReduction"
              suffix="%"
              step={1}
              isPercentage={true}
            />
            <AssumptionField
              label="Paralegal revision time reduced"
              value={calc.paralegalRevisionReduction * 100}
              fieldKey="paralegalRevisionReduction"
              suffix="%"
              step={1}
              isPercentage={true}
            />
            <AssumptionField
              label="Attorney time saved per case"
              value={calc.attorneyTimeSaved}
              fieldKey="attorneyTimeSaved"
              suffix="hrs"
              step={0.1}
            />
            <AssumptionField
              label="Courier shipments avoided"
              value={calc.courierReduction * 100}
              fieldKey="courierReduction"
              suffix="%"
              step={1}
              isPercentage={true}
            />
          </div>

          <div className="assumption-section">
            <h3>Adoption & Cost</h3>
            <AssumptionField
              label="Adoption rate"
              value={calc.adoptionRate * 100}
              fieldKey="adoptionRate"
              suffix="%"
              step={1}
              isPercentage={true}
            />
            <AssumptionField
              label="Align cost per user (annual)"
              value={calc.alignCostPerUser}
              fieldKey="alignCostPerUser"
              prefix="$"
            />
          </div>
        </div>
      )}
    </div>
  );
};
