import { createSlice } from "@reduxjs/toolkit";
import { Models } from "appwrite";

type AuthSlice = {
  isUserAuthenticated: boolean;
  user: Models.Document | null;
};
const initialState: AuthSlice = {
  isUserAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isUserAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isUserAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
