import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveCases } from '../../store/calculatorSlice';

export const InputPanel = () => {
  const dispatch = useAppDispatch();
  const activeCases = useAppSelector((state) => state.calculator.activeCasesPerYear);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    dispatch(setActiveCases(value));
  };

  return (
    <div className="input-panel">
      <h2>Calculate Your ROI</h2>
      <div className="input-group">
        <label htmlFor="active-cases">
          How many active cases do you handle each year?
        </label>
        <input
          id="active-cases"
          type="number"
          min="0"
          value={activeCases || ''}
          onChange={handleChange}
          placeholder="Enter number of cases"
          className="cases-input"
        />
        <p className="helper-text">
          All other assumptions are pre-filled using Align's benchmark data from law firm examples.
        </p>
      </div>
    </div>
  );
};
