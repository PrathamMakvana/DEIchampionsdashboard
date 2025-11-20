// src/redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slice/authSlice";
import jobReducer from "./slice/jobSlice";
import gallery from "./slice/imageGallerySlice";
import notificationReducer from "./slice/notificationSlice";
import inquiryReducer from "./slice/inquirySlice";
import userSettingsReducer from "./slice/userSettingSlice";

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["loading"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), // persist only auth with blacklist
  job: jobReducer,
  gallery: gallery,
  notification: notificationReducer,
  inquiry: inquiryReducer,
  userSettings: userSettingsReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;
