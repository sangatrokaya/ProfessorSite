import { BrowserRouter, Routes, Route } from "react-router-dom";

/* --------- LAYOUTS -------------- */
import PublicLayout from "./layout/PublicLayout.jsx";
import AdminLayout from "./layout/AdminLayout.jsx";

/* ------------- PUBLIC PAGES ---------- */
import Home from "./pages/public/Home.jsx";
import About from "./pages/public/About.jsx";
import Papers from "./pages/public/Papers.jsx";
import Courses from "./pages/public/Courses.jsx";
import Blogs from "./pages/public/Blogs.jsx";
import Videos from "./pages/public/Videos.jsx";
import Contact from "./pages/public/Contact.jsx";

/* ----------- ADMIN PAGES -------------- */
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminPapers from "./pages/admin/Papers.jsx";
import AdminCourses from "./pages/admin/Courses.jsx";
import AdminBlogs from "./pages/admin/Blogs.jsx";
import AdminVideos from "./pages/admin/Videos.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Section */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="papers" element={<Papers />} />
          <Route path="courses" element={<Courses />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="videos" element={<Videos />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Admin Section upto where Public can access */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Section */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="papers" element={<AdminPapers />} />
          <Route path="courses" element={<AdminCourses />} />
          <Route path="blogs" element={<AdminBlogs />} />
          <Route path="videos" element={<AdminVideos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
