import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveCases, setNumberOfUsers } from '../../store/calculatorSlice';

export const InputPanel = () => {
  const dispatch = useAppDispatch();
  const activeCases = useAppSelector((state) => state.calculator.activeCasesPerYear);
  const numberOfUsers = useAppSelector((state) => state.calculator.numberOfUsers);

  const handleCasesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    dispatch(setActiveCases(value));
  };

  const handleUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    dispatch(setNumberOfUsers(value));
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
          onChange={handleCasesChange}
          placeholder="Enter number of cases"
          className="cases-input"
        />
      </div>
      <div className="input-group">
        <label htmlFor="number-of-users">
          How many users will use Align?
        </label>
        <input
          id="number-of-users"
          type="number"
          min="0"
          value={numberOfUsers || ''}
          onChange={handleUsersChange}
          placeholder="Enter number of users"
          className="cases-input"
        />
      </div>
      <p className="helper-text">
        All other assumptions are pre-filled using Align's benchmark data from law firm examples.
      </p>
    </div>
  );
};
