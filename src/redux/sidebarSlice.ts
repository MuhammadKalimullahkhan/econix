import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isExpended: false,
};

const slice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    toggleSidebar: (state, _) => {
      state.isExpended = !state.isExpended;
    },
  },
});

export const { toggleSidebar } = slice.actions;
export default slice.reducer;
