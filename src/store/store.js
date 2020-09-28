import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import reducer from "./reducer";

const Store = function () {
  return configureStore({
    reducer,
    middleware: [...getDefaultMiddleware()],
  });
};
export default Store;
