import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';

import Home from './pages/Home';
import List from './pages/List';
import Schedule from './pages/Schedule';

const App = () => {
  return (
    <Router>
      <div>
        <nav className='p-4'>
          <Link to='/' className='mr-4'>
            인원 추가하기
          </Link>
          <Link to='/list' className='mr-4'>
            인원 목록
          </Link>
          <Link to='/schedule' className='mr-4'>
            근무표 만들기
          </Link>
        </nav>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/list' element={<List />} />
          <Route path='/schedule' element={<Schedule />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
