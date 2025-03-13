import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiClient } from '@/helpers/http/index';
import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
import { IClientDetails } from '@/helpers/types/client.type';
import { saveAuthStorage, getToken, getStorageUser, clearAuthStorage } from '@/helpers/services/auth';
import toast from 'react-hot-toast';
import moment from 'moment-timezone';

interface AuthState {
  user: (IFreelancerDetails & IClientDetails) | null;
  token: string | null;
  isLoading: boolean;
  isBootstrapping: boolean;
}

interface LoginPayload {
  email_id: string;
  password: string;
  stay_signedin: boolean;
  terms_agreement: boolean;
}

interface TwoFactorPayload {
  formdata: {
    email_id: string;
    otp: string;
    action: string;
    type: string;
  };
  email: string;
}

interface RegisterPayload {
  email_id: string;
  password: string;
  name: string;
  terms_agreement: boolean;
}

const initialState: AuthState = {
  user: getStorageUser(),
  token: getToken(),
  isLoading: false,
  isBootstrapping: true,
};

// Async thunk to bootstrap user
export const bootstrapUser = createAsyncThunk('auth/bootstrapUser', async (_, { rejectWithValue }) => {
  const token = getToken();
  if (!token) {
    return null;
  }

  try {
    const response = await apiClient.get('/user/get');
    
    if (!response.data || !response.data.id) {
      throw new Error('Invalid user data received');
    }

    // Update timezone if needed
    const currentTimezone = moment.tz.guess();
    if (response.data.timezone !== currentTimezone) {
      try {
        await apiClient.put('/user/edit', { timezone: currentTimezone });
      } catch (timezoneError) {
        console.error('Failed to update timezone:', timezoneError);
      }
    }

    return {
      user: response.data,
      token: token
    };
  } catch (error) {
    console.error('Bootstrap failed:', error);
    
    // Handle specific error cases
    if (error instanceof Error) {
      if (error.message.includes('401') || error.message.includes('403')) {
        clearAuthStorage();
        return rejectWithValue('Session expired - please login again');
      }
      if (error.message.includes('network')) {
        return rejectWithValue('Network error - please check your connection');
      }
      return rejectWithValue(error.message);
    }
    
    return rejectWithValue('Failed to restore user session');
  }
});

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
  try {
    const response = await apiClient.get('/user/get');
    return response.data;
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Failed to fetch user');
  }
});

// Async thunk for login
export const login = createAsyncThunk('auth/login', async (payload: LoginPayload, { rejectWithValue }) => {
  try {
    const response = await apiClient.post('/auth/login', payload);
    if (response.data.status) {
      const { user, token } = response.data.data;
      if (token && user) {
        saveAuthStorage({ token, user });
      }
      return response.data.data;
    }
    return rejectWithValue(response.data.message || 'Login failed');
  } catch (error) {
    if (error instanceof Error) {
      return rejectWithValue(error.message);
    }
    return rejectWithValue('Login failed');
  }
});

// Async thunk for logout
export const logout = createAsyncThunk('auth/logout', async () => {
  try {
    await apiClient.get('/auth/logout');
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    clearAuthStorage();
  }
});

// Async thunk for two-factor authentication
export const twoFactor = createAsyncThunk(
  'auth/twoFactor',
  async ({ formdata, email }: TwoFactorPayload, { rejectWithValue }) => {
    try {
      formdata.email_id = email;
      const response = await apiClient.post('/auth/otp', formdata);
      if (response.data.status) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Two-factor authentication failed');
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Two-factor authentication failed');
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/register', payload);
      if (response.data.status) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message || 'Registration failed');
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Registration failed');
    }
  }
);

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
      clearAuthStorage();
    },
  },
  extraReducers: (builder) => {
    builder
      // Bootstrap User
      .addCase(bootstrapUser.pending, (state) => {
        state.isBootstrapping = true;
        state.isLoading = true;
      })
      .addCase(bootstrapUser.fulfilled, (state, action) => {
        state.isBootstrapping = false;
        state.isLoading = false;
        if (action.payload) {
          const { user, token } = action.payload;
          state.user = user;
          state.token = token;
          if (token && user) {
            saveAuthStorage({ token, user });
          }
        }
      })
      .addCase(bootstrapUser.rejected, (state, action) => {
        state.isBootstrapping = false;
        state.isLoading = false;
        state.user = null;
        state.token = null;
        clearAuthStorage();
        toast.error(action.payload as string);
      })
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isBootstrapping = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isBootstrapping = false;
        toast.error(action.payload as string);
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { user, token } = action.payload;
        state.user = user;
        state.token = token;
        state.isLoading = false;
        if (token && user) {
          saveAuthStorage({ token, user });
          const currentTimezone = moment.tz.guess();
          if (user.timezone !== currentTimezone) {
            apiClient.put('/user/edit', { timezone: currentTimezone });
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.token = null;
        toast.error(action.payload as string);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        clearAuthStorage();
      })
      // Two-Factor
      .addCase(twoFactor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(twoFactor.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.meta.arg.formdata.action === 'verify_otp' && action.meta.arg.formdata.type === 'new_registration') {
          state.token = action.payload.token;
          localStorage.setItem('token', action.payload.token);
        }
        toast.success('Two-factor authentication successful');
      })
      .addCase(twoFactor.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload as string);
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload as string);
      });
  },
});

export const { setUser, setToken, setLoading, setBootstraping, setEmail, clearAuth } = authSlice.actions;

export default authSlice.reducer;