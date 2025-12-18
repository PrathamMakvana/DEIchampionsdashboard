import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import authReducer from "./slice/authSlice";
import jobReducer from "./slice/jobSlice";
import gallery from "./slice/imageGallerySlice";
import notificationReducer from "./slice/notificationSlice";
import estimateReducer from "./slice/estimateSlice";
import userSettingsReducer from "./slice/userSettingSlice";
import termsReducer from "./slice/termsSlice";

import inquiryReducer from "./slice/inquirySlice";

const authPersistConfig = {
  key: "auth",
  storage,
  blacklist: ["loading"],
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer), 
  job: jobReducer,
  gallery: gallery,
  notification: notificationReducer,
  estimate: estimateReducer,
  userSettings: userSettingsReducer,
  terms: termsReducer,
  inquiry: inquiryReducer,
});

// Persist config for the root
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;
