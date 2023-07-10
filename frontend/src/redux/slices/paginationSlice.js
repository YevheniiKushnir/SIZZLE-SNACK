import { createSlice } from "@reduxjs/toolkit";

export const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    filteredItems: [],
    isLoading: true,
    itemsPerPage: 8,
    currentItems: [],
    itemOffset: 0,
    activePage: 0,
    pageCount: 1,
  },
  reducers: {
    setFilteredItems(state, action) {
      state.filteredItems = action.payload;
    },
    setLoading(state, action) {
      state.isLoading = action.payload;
    },
    setCurrentItems(state, action) {
      state.currentItems = action.payload;
      state.pageCount = Math.ceil(
        state.filteredItems.length / state.itemsPerPage
      );
      state.activePage = state.itemOffset / state.itemsPerPage;
    },
    setItemOffset(state, action) {
      state.itemOffset = action.payload;
    },
    setActivePage(state, action) {
      state.activePage = action.payload;
      state.itemOffset = action.payload * state.itemsPerPage;
    },
  },
});

export const {
  setFilteredItems,
  setLoading,
  setCurrentItems,
  setItemOffset,
  setActivePage,
} = paginationSlice.actions;
export default paginationSlice.reducer;
