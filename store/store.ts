// src/redux/store.ts
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { apiClient } from '@/helpers/http';
import authReducer, { AuthState } from './redux/authSlice';

// Create a type-safe storage object
const createNoopStorage = () => ({
  getItem: () => Promise.resolve(null),
  setItem: () => Promise.resolve(),
  removeItem: () => Promise.resolve(),
});

// Use redux-persist storage in browser, noop storage in SSR
const persistStorage = typeof window !== 'undefined' ? storage : createNoopStorage();

// Define RootState type
export interface RootState {
  auth: AuthState;
}

const persistConfig = {
  key: 'root',
  storage: persistStorage,
  whitelist: ['auth'],
  version: 1,
  debug: process.env.NODE_ENV !== 'production',
};

// Create root reducer
const rootReducer = combineReducers({
  auth: authReducer,
});

// Create persisted reducer
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

// Initialize persistor after store creation
export const persistor = persistStore(store, null, () => {
  const state = store.getState();
  if (state.auth?.token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${state.auth.token}`;
  }
});

export type AppDispatch = typeof store.dispatch;