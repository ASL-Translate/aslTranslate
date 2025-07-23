import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // When the user moves around different pages the browser URL updates correctly
import { AslCardEdit } from './pages/asl_card_edit.js';
import { AslCardView } from './pages/asl_card_view.js';
import { AdminPanel } from './pages/admin_panel.js'
import { Translate } from './pages/translate.js'
import { NotFound } from './pages/notfound.js'
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
        <Route path="/translate/card_view" element={<AslCardView />} />
        <Route path="/admin/panel/card_edit" element={<AslCardEdit />} />

        {/* Catches unknown routes and displays 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
export default App;