import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Home from './pages/Home';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="pages">
          <Routes>
            <Route
              path="/" // root path
              element={<Home />} // Home.js
            />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
