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
              label="Binders created per case per year"
              value={calc.bindersPerCase}
              fieldKey="bindersPerCase"
              description="Annual binder production rate per active case (multiplied by cases/year for total volume)"
            />
            <AssumptionField
              label="Copies per binder"
              value={calc.copiesPerBinder}
              fieldKey="copiesPerBinder"
              description="Number of physical copies produced for each binder (multiplies print, materials, shipping, storage costs)"
            />
            <AssumptionField
              label="Pages per binder"
              value={calc.pagesPerBinder}
              fieldKey="pagesPerBinder"
              description="Pages per copy (total pages printed = pages × copies × revisions)"
            />
            <AssumptionField
              label="Revisions per binder"
              value={calc.revisionsPerBinder}
              fieldKey="revisionsPerBinder"
              description="Number of times binder content is updated/reprinted (multiplies paralegal revision work and reprint costs)"
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
              description="Per page per copy (multiplied by pages × copies × (1 + revisions) for total print cost)"
            />
            <AssumptionField
              label="Binder materials (tabs, dividers, hardware)"
              value={calc.binderMaterials}
              fieldKey="binderMaterials"
              prefix="$"
              description="Per copy cost for physical binder components (multiplied by copies per binder)"
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
              description="Used to calculate cost savings from paralegal time freed (multiplied by hours saved)"
            />
            <AssumptionField
              label="Attorney net billable rate"
              value={calc.attorneyRate}
              fieldKey="attorneyRate"
              prefix="$"
              suffix="/hr"
              description="Net value per hour of billable work (billable rate minus cost). Used to value recovered attorney time."
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
              description="Time to create all copies of one binder initially (not multiplied by copies - all made together)"
            />
            <AssumptionField
              label="Paralegal hours per revision"
              value={calc.paralegalRevisionHours}
              fieldKey="paralegalRevisionHours"
              suffix="hrs"
              step={0.1}
              description="Time per revision to update all copies (multiplied by revisions per binder)"
            />
          </div>

          <div className="assumption-section">
            <h3>Logistics & Storage</h3>
            <AssumptionField
              label="Shipments per binder copy"
              value={calc.shipmentsPerBinder}
              fieldKey="shipmentsPerBinder"
              description="Number of courier shipments per copy (total shipments = shipments × copies)"
            />
            <AssumptionField
              label="Shipping cost per shipment"
              value={calc.shippingCostPerShipment}
              fieldKey="shippingCostPerShipment"
              prefix="$"
              description="Cost per courier delivery (multiplied by shipments × copies)"
            />
            <AssumptionField
              label="Storage/destruction cost per binder copy"
              value={calc.storageCost}
              fieldKey="storageCost"
              prefix="$"
              step={0.1}
              description="Annual cost per copy (blended: 50% stored @ $3/yr, 50% destroyed @ $2)"
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
              description="Percentage of initial build time saved with Align (multiplied by build hours × paralegal rate for cost savings)"
            />
            <AssumptionField
              label="Paralegal revision time reduced"
              value={calc.paralegalRevisionReduction * 100}
              fieldKey="paralegalRevisionReduction"
              suffix="%"
              step={1}
              isPercentage={true}
              description="Percentage of revision time saved (reduces both paralegal cost and print costs since fewer pages reprinted)"
            />
            <AssumptionField
              label="Attorney time saved per case"
              value={calc.attorneyTimeSaved}
              fieldKey="attorneyTimeSaved"
              suffix="hrs"
              step={0.1}
              description="Hours per case per year freed from admin work for billable activities (allocated across binders, multiplied by net billable rate)"
            />
            <AssumptionField
              label="Courier shipments avoided"
              value={calc.courierReduction * 100}
              fieldKey="courierReduction"
              suffix="%"
              step={1}
              isPercentage={true}
              description="Percentage of shipments eliminated via digital delivery (multiplied by shipments × cost per shipment × copies)"
            />
          </div>

          <div className="assumption-section">
            <h3>Adoption</h3>
            <AssumptionField
              label="Adoption rate"
              value={calc.adoptionRate * 100}
              fieldKey="adoptionRate"
              suffix="%"
              step={1}
              isPercentage={true}
              description="Percentage of active cases using Align (scales all benefits - e.g., 70% adoption on 100 cases = 70 cases worth of savings)"
            />
          </div>
        </div>
      )}
    </div>
  );
};
