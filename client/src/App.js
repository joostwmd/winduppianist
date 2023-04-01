import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Song from './pages/Song';
import Home from './pages/Home';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            exact path='/'
            element={<Home />}
          />

          <Route
            exact path='/song'
            element={<Song />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
