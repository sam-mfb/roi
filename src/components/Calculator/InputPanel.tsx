import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveCases } from '../../store/calculatorSlice';
import { useRef } from 'react';

export const InputPanel = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();
  const activeCases = useAppSelector(
    (state) => state.calculator.activeCasesPerYear
  );

  const handleCasesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    dispatch(setActiveCases(value));
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
    <div className='input-group'>
      <label htmlFor='active-cases'>
        How many active cases do you handle each year?
      </label>
      <div className='number-field'>
        <input
          ref={inputRef}
          id='active-cases'
          type='number'
          min='0'
          value={activeCases || ''}
          onChange={handleCasesChange}
          placeholder='Enter number of cases'
          className='cases-input'
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
      </div>
      <p className='helper-text'>
        All other assumptions are pre-filled using Align's benchmark data from
        law firm examples.
      </p>
    </div>
  );
};
