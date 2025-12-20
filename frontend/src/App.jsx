import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={AdminLogin} />
      </Routes>
    </Router>
  );
}
export default App;
