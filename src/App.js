import logo from './logo.svg';
import './App.css';
import Eventstab from './components/events';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/login';
import Navbar from './components/navbar';
import Connectoreq from './components/connectoreq';
import Conferencestab from './components/conferences';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/events" element={<Eventstab />} />
          <Route exact path="/connectors" element={<Connectoreq/>} />
          <Route exact path="/conferences" element={<Conferencestab/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
