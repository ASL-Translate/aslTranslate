import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // When the user moves around different pages the browser URL updates correctly
import { Admin } from './pages/admin.js'
import { Home } from './pages/home.js'

function App() {
  return (
    // HTML content is loaded based on the route loaded
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
}
export default App;