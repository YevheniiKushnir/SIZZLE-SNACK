import { createSlice } from "@reduxjs/toolkit";

export const productList = createSlice({
  name: "productList",
  initialState: {
    items: [],
  },
  reducers: {
    setItems(state, action) {
      state.items = action.payload;
    },
  },
});

export const { setItems } = productList.actions;
export default productList.reducer;
