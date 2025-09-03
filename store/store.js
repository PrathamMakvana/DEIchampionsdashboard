// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slice/authSlice";
import jobReducer from "./slice/jobSlice";
import gallery from "./slice/imageGallerySlice";

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["loading"], // do not persist loading
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // persist only auth with blacklist
  job: jobReducer,
  gallery: gallery,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist auth
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;
