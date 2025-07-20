import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // When the user moves around different pages the browser URL updates correctly
import { AdminPanel } from './pages/admin_panel.js'
import { Translate } from './pages/translate.js'
import { Admin } from './pages/admin.js'
import { Home } from './pages/home.js'

function App() {
  return (
    // HTML content is loaded based on the route loaded
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
export default App;