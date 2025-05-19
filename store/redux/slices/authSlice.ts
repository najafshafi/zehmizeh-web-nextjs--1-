import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { IClientDetails } from "@/helpers/types/client.type";
import { getStorageUser, getToken } from "@/helpers/services/auth";

// Check if we're in the browser
const isBrowser = typeof window !== "undefined";

// Add bootstrapUser thunk - now with better error handling
export const bootstrapUser = createAsyncThunk(
  "auth/bootstrapUser",
  async (_, { dispatch }) => {
    try {
      // Only try to get user data from localStorage in the browser
      if (isBrowser) {
        const user = getStorageUser();
        const token = getToken();

        if (user && token) {
          dispatch(setUser(user));
          dispatch(setToken(token));
        }
      }

      return { success: true };
    } catch (error) {
      console.error("Error bootstrapping user:", error);
      // Don't throw error, just return failed state
      return { success: false, error };
    }
  }
);

interface AuthState {
  user: (IFreelancerDetails & IClientDetails) | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
  initialized: boolean;
}

// For SSR, don't attempt to access localStorage
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isBootstrapping: true,
  initialized: false,
};

const authSlice = createSlice({
  name: "auth",
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
  extraReducers: (builder) => {
    builder
      .addCase(bootstrapUser.pending, (state) => {
        state.isBootstrapping = true;
      })
      .addCase(bootstrapUser.fulfilled, (state) => {
        state.isBootstrapping = false;
        state.initialized = true;
      })
      .addCase(bootstrapUser.rejected, (state) => {
        state.isBootstrapping = false;
        state.initialized = true;
      });
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
