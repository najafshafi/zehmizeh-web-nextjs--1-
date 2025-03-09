import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: any | null;
  isLoading: boolean;
  isBootstrapping: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isBootstrapping: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBootstrapping: (state, action: PayloadAction<boolean>) => {
      state.isBootstrapping = action.payload;
    },
    signout: (state) => {
      state.user = null;
      state.isLoading = false;
    },
  },
});

export const { setUser, setLoading, setBootstrapping, signout } = authSlice.actions;
export default authSlice.reducer;