import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/redux/authSlice";
import sidebarReducer from "@/redux/sidebarSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sidebar: sidebarReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
