import { createSlice } from "@reduxjs/toolkit";

export const filterSlice = createSlice({
  name: "filter",
  initialState: {
    categories: [{ title: "All", titleUkr: "Усе" }],
    sort: [
      { name: "Popularity", nameUkr: "Популярністю", property: "-rating" },
      {
        name: "Rising price",
        nameUkr: "Зростанням ціни",
        property: "price",
      },
      {
        name: "Price (Descending)",
        nameUkr: "Спаданням ціни",
        property: "-price",
      },
      {
        name: "Alphabetically",
        nameUkr: "Алфавітом",
        property: "title",
        propertyUkr: "titleUkr",
      },
    ],
    selectedCategory: { title: "All", titleUkr: "Усе" },
    selectedSort: {
      name: "Popularity",
      nameUkr: "Популярністю",
      property: "-rating",
    },
    searchValue: "",
    openedItem: "",
  },
  reducers: {
    setCategories(state, action) {
      state.categories = [state.categories[0], ...action.payload];
    },
    setSelectedCategory(state, action) {
      state.selectedCategory = action.payload;
    },
    setSelectedSort(state, action) {
      state.selectedSort = action.payload;
    },
    setSearchValue(state, action) {
      state.searchValue = action.payload;
    },
    setOpenedItem(state, action) {
      state.openedItem = action.payload;
    },
  },
});

export const {
  setCategories,
  setSelectedCategory,
  setSelectedSort,
  setSearchValue,
  setOpenedItem,
} = filterSlice.actions;

export default filterSlice.reducer;
