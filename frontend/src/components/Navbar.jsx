import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="w-full border-b bg-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Name */}
        <Link to="/" className="text-xl font-bold tracking-wide">
          Bhim Rokaya
        </Link>

        {/* Links */}
        <div className="flex gap-6 text-sm font-medium">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/papers">Papers & Pubs.</Link>
          <Link to="/courses">Courses</Link>
          <Link to="/blogs">Blogs</Link>
          <Link to="/videos">Videos</Link>
          <Link to="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
