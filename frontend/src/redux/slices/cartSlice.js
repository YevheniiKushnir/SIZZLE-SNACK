import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalPrice: 0,
    items: [],
    totalAmount: 0,
  },
  reducers: {
    addPoduct(state, action) {
      const findItems = state.items.find(
        (obj) =>
          obj.product?.slug === action.payload.product.slug &&
          Object.keys(obj.properties).every(
            (prop) =>
              action.payload.properties.hasOwnProperty(prop) &&
              obj.properties[prop].value ===
                action.payload.properties[prop].value
          )
      );
      if (findItems) {
        findItems.amount++;
      } else {
        state.items.push({ ...action.payload, amount: 1 });
      }

      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.amount + sum;
      }, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.amount,
        0
      );
    },
    clearItems(state) {
      state.items = [];
      state.totalPrice = 0;
      state.totalAmount = 0;
    },
    removeProduct(state, action) {
      const findItems = state.items.find(
        (obj) =>
          obj.product?.slug === action.payload.product.slug &&
          Object.keys(obj.properties).every(
            (prop) =>
              action.payload.properties.hasOwnProperty(prop) &&
              obj.properties[prop].value ===
                action.payload.properties[prop].value
          )
      );
      if (findItems) {
        findItems.amount--;
      }
      if (findItems.amount <= 0) {
        state.items = state.items.filter((item) => item !== findItems);
      }
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.amount + sum;
      }, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.amount,
        0
      );
    },
    deleteProduct(state, action) {
      const findItems = state.items.find(
        (obj) =>
          obj.product?.slug === action.payload.product.slug &&
          Object.keys(obj.properties).every(
            (prop) =>
              action.payload.properties.hasOwnProperty(prop) &&
              obj.properties[prop].value ===
                action.payload.properties[prop].value
          )
      );
      if (findItems) {
        state.items = state.items.filter((item) => item !== findItems);
      }
      state.totalPrice = state.items.reduce((sum, obj) => {
        return obj.price * obj.amount + sum;
      }, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.amount,
        0
      );
    },
  },
});

export const { addPoduct, clearItems, removeProduct, deleteProduct } =
  cartSlice.actions;

export default cartSlice.reducer;
