import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  status: false, // Authentication status (true = logged in, false = not logged in)
  user: null,    // User data
  isLoading: true // Loading state for initial user fetch
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.status = true;
      state.user = action.payload;
      state.isLoading = false; // Loading complete after login
    },
    logout: (state) => {
      console.log('Logout action triggered.');
      state.status = false;
      state.user = null;
      state.isLoading = false; // Loading complete after logout
    },
    loggedIn: (state, action) => {
      console.log('Logged in action payload:', action.payload);
      state.status = true;
      state.user = action.payload;
      state.isLoading = false; // Loading complete after fetching current user
    }
  }
});

export const { login, logout, loggedIn } = authSlice.actions;
export default authSlice.reducer;