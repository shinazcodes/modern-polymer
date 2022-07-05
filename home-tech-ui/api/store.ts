import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import authReducer from "./Auth/authSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import customerReducer from "./Auth/customerSlice";
import technicianReducer from "./Auth/techniciansSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  customer: customerReducer,
  technician: technicianReducer,
});
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export type RootState = ReturnType<typeof rootReducer>;
export const persistor = persistStore(store);
