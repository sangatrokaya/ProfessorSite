import { Navigate } from "react-router-dom"; // Navigate is used for programmatic redirection
import { useSelector } from "react-redux"; // useSelector allows access to Redux store state

/*
    ProtectedRoute component
    - wraps protected pages (admin-only routes)
    - checks if admin is authenticated
*/
const ProtectedRoute = ({ children }) => {
  /*
        Extract adminInfo from auth slice
        If adminInfo exists -> admin is Logged in
        If null -> admin is not authenticated
    */
  const { adminInfo } = useSelector((state) => state.auth);

  /*
    If admin is NOT logged in:
    - Redirect to admin login page
    - replace prevenets going back to protected page
  */
  if (!adminInfo) {
    return <Navigate to="/admin/login" replace />;
  }

  /*
    If admin is logged in:
    - Render the protected components
  */
  return children;
};

export default ProtectedRoute;
