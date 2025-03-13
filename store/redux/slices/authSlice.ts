import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { IClientDetails } from '@/helpers/types/client.type';
import { getStorageUser, getToken } from '@/helpers/services/auth';

// Add bootstrapUser thunk
export const bootstrapUser = createAsyncThunk(
  'auth/bootstrapUser',
  async (_, { dispatch }) => {
    try {
      const user = getStorageUser();
      const token = getToken();
      
      if (user && token) {
        dispatch(setUser(user));
        dispatch(setToken(token));
      }
      
      dispatch(setBootstraping(false));
    } catch (error) {
      console.error('Error bootstrapping user:', error);
      dispatch(setBootstraping(false));
    }
  }
);

interface AuthState {
  user: (IFreelancerDetails & IClientDetails) | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
}

const initialState: AuthState = {
  user: getStorageUser(),
  token: getToken(),
  isLoading: false,
  isBootstrapping: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setBootstraping: (state, action) => {
      state.isBootstrapping = action.payload;
    },
    setEmail: (state, action) => {
      if (state.user) {
        state.user.email_id = action.payload;
      }
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const {
  setUser,
  setToken,
  setLoading,
  setBootstraping,
  setEmail,
  clearAuth,
} = authSlice.actions;

export default authSlice.reducer;