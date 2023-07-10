import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import filter from "./slices/filterSlice";
import productList from "./slices/productListSlice";
import pagination from "./slices/paginationSlice";
import cart from "./slices/cartSlice";
import user from "./slices/userSlice";
import order from "./slices/orderSlice";

const persistConfig = {
  key: "cart",
  storage,
};

const cartReducer = persistReducer(persistConfig, cart);

const rootReducer = combineReducers({
  filter,
  productList,
  pagination,
  cart: cartReducer,
  user,
  order,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: [thunk],
});

const persistor = persistStore(store);
// persistor.purge()
export { store, persistor };
