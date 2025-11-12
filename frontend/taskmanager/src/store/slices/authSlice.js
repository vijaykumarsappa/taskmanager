import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// const API_URL = "http://localhost:5000/api";
const API_URL =
  "https://taskmanager-aw1o-jp0dj8wht-vijay-kumars-projects-503eec07.vercel.app/api";

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        return rejectWithValue({
          message:
            "Cannot connect to server. Please make sure the backend is running.",
        });
      }
      return rejectWithValue(
        error.response?.data || {
          message: "An unexpected error occurred",
        }
      );
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signin`, userData);
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      if (error.code === "ERR_NETWORK") {
        return rejectWithValue({
          message:
            "Cannot connect to server. Please make sure the backend is running.",
        });
      }
      return rejectWithValue(
        error.response?.data || {
          message: "An unexpected error occurred",
        }
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token"),
    isLoading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Sign up failed";
      })

      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Sign in failed";
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
