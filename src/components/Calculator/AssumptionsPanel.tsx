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

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `align-roi-assumptions-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
          <div className="assumptions-actions">
            <button
              className="export-btn"
              onClick={handleExport}
            >
              Export Assumptions
            </button>
            <button
              className="reset-btn"
              onClick={() => dispatch(resetToDefaults())}
            >
              Reset to Defaults
            </button>
          </div>
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
              label="Administrative hourly rate"
              value={calc.administrativeRate}
              fieldKey="administrativeRate"
              prefix="$"
              suffix="/hr"
              description="Blended cost per hour for administrative staff (paralegals, assistants). Used to calculate cost savings from admin time freed."
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
            <h3>Administrative Effort (Physical Workflow)</h3>
            <AssumptionField
              label="Administrative hours to build one binder"
              value={calc.administrativeBuildHours}
              fieldKey="administrativeBuildHours"
              suffix="hrs"
              step={0.1}
              description="Time for admin staff to create all copies of one binder initially (not multiplied by copies - all made together)"
            />
            <AssumptionField
              label="Administrative hours per revision"
              value={calc.administrativeRevisionHours}
              fieldKey="administrativeRevisionHours"
              suffix="hrs"
              step={0.1}
              description="Time for admin staff per revision to update all copies (multiplied by revisions per binder)"
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
              label="Administrative time reduced"
              value={calc.administrativeTimeReduction * 100}
              fieldKey="administrativeTimeReduction"
              suffix="%"
              step={1}
              isPercentage={true}
              description="Percentage of administrative time saved with Align (reduces total admin hours: build + revision work by paralegals and assistants)"
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
              label="Physical binders avoided (going digital)"
              value={calc.physicalBindersReduction * 100}
              fieldKey="physicalBindersReduction"
              suffix="%"
              step={1}
              isPercentage={true}
              description="Percentage of binders delivered digitally instead of physically (reduces all physical costs: printing, materials, shipping, storage)"
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
