import { declareComponent } from '@webflow/react';
import { Calculator } from './Calculator';
import { Provider } from 'react-redux';
import { store } from '../../store/store';

const WrappedCalculator = () => (
  <Provider store={store}>
    <Calculator />
  </Provider>
);

export default declareComponent(WrappedCalculator, {
  name: 'ROI Calculator',
  description: 'ROI Calculator component',
});
