import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  userRole: localStorage.getItem("userRole") || null,
  loading: false
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    login: (state, action) => {
      const { userData, authToken, role } = action.payload;

      state.user = userData;
      state.token = authToken;
      state.userRole = role;
      state.loading = false;

      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userRole", role);
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.userRole = null;

      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("userRole");
    },

    loadUser: (state) => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");
      const storedRole = localStorage.getItem("userRole");

      if (storedToken && storedUser && storedRole) {
        state.token = storedToken;
        state.user = JSON.parse(storedUser);
        state.userRole = storedRole;
      }

      state.loading = false;
    }

  }
});

export const { login, logout, loadUser } = authSlice.actions;

export default authSlice.reducer;