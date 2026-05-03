import { configureStore } from "@reduxjs/toolkit";
import authReducer from './AuthSlice.jsx'
export const store = configureStore({
  reducer: { auth: authReducer },
})