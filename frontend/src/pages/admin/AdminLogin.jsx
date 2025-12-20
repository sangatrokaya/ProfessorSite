import { useEffect, useState } from "react"; // React hooks for local state and side effects
import { useDispatch, useSelector } from "react-redux"; // Redux hooks to dispatch actions and real state
import { loginAdmin } from "../../features/auth/authSlice"; // Async login action from auth slice
import { useNavigate } from "react-router-dom"; // Hook for programmatic navigation

const AdminLogin = () => {
  /*
        Local component state
        - email -> stores admin email input
        - password -> stores admin password input
    */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //   Redux dispatch function
  const dispatch = useDispatch();

  //   React router navigation function
  const navigate = useNavigate();

  /*
    Extract authentication related state from Redux store
    - adminInfo -> logged-in admin data
    - loading -> shows login request status
    - error -> stores error message if login fails
  */
  const { adminInfo, loading, error } = useSelector((state) => state.auth);

  /*
    useEffect runs whenever adminInfo changes.
    If adminInfo exists, it means Login was successful,
    so redirect admin to dashboard.
  */
  useEffect(() => {
    if (adminInfo) {
      navigate("/admin/dashboard");
    }
  }, [adminInfo, navigate]);

  /*
    Form Submit Handler
    - prevents page reload
    - dispatches loginAdmin async action with credentials
  */
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(loginAdmin({ email, password }));
  };
  return (
    <div style={{ maxWidth: "400px", margin: "100px auto" }}>
      <h2>Admin Login</h2>

      {/* Show error message if login fails */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={submitHandler}>
        {/* Email input */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <br />
        <br />

        {/* Password input */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <br />
        <br />

        {/* Submit button */}
        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
