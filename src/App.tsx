import { Provider } from 'react-redux';
import './App.css';
import { Calculator } from './components/Calculator/Calculator';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <Calculator />
    </Provider>
  );
}

export default App;
