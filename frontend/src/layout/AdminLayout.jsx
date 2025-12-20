import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-3">
          <p className="cursor-pointer">Dashboard</p>
          <p
            className="cursor-pointer"
            onClick={() => navigate("/admin/papers")}
          >
            Papers & Publications
          </p>
          <p
            className="cursor-pointer"
            onClick={() => navigate("/admin/courses")}
          >
            Courses
          </p>
          <p
            className="cursor-pointer"
            onClick={() => navigate("/admin/blogs")}
          >
            Blogs
          </p>
          <p className="cursor-pointer">Videos</p>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 bg-slate-100">
        {/* Header */}
        <header className="bg-white shadow px-6 py-4">
          <h1 className="text-lg font-semibold">Dashboard</h1>
        </header>

        <section className="p-6">
          <Outlet />
        </section>
      </main>
    </div>
  );
};

export default AdminLayout;
