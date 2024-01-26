import logo from './logo.svg';
import './App.css';
import Eventstab from './components/events';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Navbar from './components/navbar';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/events" element={<Eventstab />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
