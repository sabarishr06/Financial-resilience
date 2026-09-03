import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Overview from './pages/Overview';
import Earnings from './pages/Earnings';
import Resilience from './pages/Resilience';
import Emergency from './pages/Emergency';
import Forecast from './pages/Forecast';
import Simulator from './pages/Simulator';
import AIGuide from './pages/AIGuide';
import DataInput from './pages/DataInput';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Overview />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="resilience" element={<Resilience />} />
          <Route path="emergency" element={<Emergency />} />
          <Route path="forecast" element={<Forecast />} />
          <Route path="simulator" element={<Simulator />} />
          <Route path="ai-guide" element={<AIGuide />} />
          <Route path="data-input" element={<DataInput />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
