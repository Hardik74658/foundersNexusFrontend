import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice'; // Import the authSlice reducer

const store = configureStore({
    reducer: {
        auth: authReducer, // Add the auth reducer
    },
});

export default store;