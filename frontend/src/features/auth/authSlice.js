// Import utilities fom Redux Toolkit
// createSlice -> creates reducer + actions
// createAsyncThunk -> handles async logic (API calls)
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios"; // used to make HTTP requests
import api from "../../services/api";

/*
    Try to get already logged-in admin data from LocalStorage.
    This helps heep the admin logged in even after page refresh.
*/
const adminFromStorage = localStorage.getItem("adminInfo")
  ? JSON.parse(localStorage.getItem("adminInfo"))
  : null;

/*
    Initial state for authentication
    - adminInfo -> stores logged-in admin details
    - loading -> shows API requests status
    - error -> stores error messages from failed login
*/
const initialState = {
  adminInfo: adminFromStorage,
  loading: false,
  error: null,
};

/*
    Async thunk for admin login
    createAsyncThunk automatically creates:
    - pending
    - fulfilled
    - rejected action types
*/
export const loginAdmin = createAsyncThunk(
  "auth/login", // action type
  async ({ email, password }, thunkAPI) => {
    try {
      // Send login request to backend
      const { data } = await api.post("/api/auth/login", { email, password });

      //   Save admin data in LocalStorage for persistence
      localStorage.setItem("adminInfo", JSON.stringify(data));

      //   This data will be available in fulfilled reducer
      return data;
    } catch (error) {
      /*
        If request fails:
        - return custom error message from backend if available
        - otherwise return a default message
      */
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed!"
      );
    }
  }
);

/*
    Auth Slice
    - name -> slice name
    - initialState -> default state
    - reducers -> synchronous actions
    - extraReducers -> handles async thunk states
*/
const authSlice = createSlice({
  name: "auth",
  initialState,
  //   Synchronous reducers
  reducers: {
    /*
        Logout action
        - clears admin data from Redux state
        - removes admin data from LocalStorage
    */
    logout: (state) => {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
  },

  //   handling async thunk states
  extraReducers: (builder) => {
    builder
      // When login request starts
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      //   When login is successful
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.adminInfo = action.payload; // store admin info
      })

      // When login fails
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // store error message
      });
  },
});

// Export logout action for use in components
export const { logout } = authSlice.actions;

// Export reducer to be added in Redux store
export default authSlice.reducer;
