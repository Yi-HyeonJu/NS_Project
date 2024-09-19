import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Calendar from './pages/Calendar';
import Home from './pages/Home';
import List from './pages/List';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/list' element={<List />} />
        <Route path='/calendar' element={<Calendar />} />
      </Routes>
    </Router>
  );
}

export default App;
