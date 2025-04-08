// // src/redux/authSlice.ts
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { apiClient } from '@/helpers/http/index';
// import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
// import { IClientDetails } from '@/helpers/types/client.type';
// import { saveAuthStorage } from '@/helpers/services/auth';
// import toast from 'react-hot-toast';
// import moment from 'moment-timezone';

// interface AuthState {
//   user: (IFreelancerDetails & IClientDetails) | null;
//   token: string | null;
//   isLoading: boolean;
//   isBoostraping: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: false,
//   isBoostraping: true,
// };

// // Async thunk to fetch user data
// export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
//   try {
//     const response = await apiClient.get('/user/get');
//     if (response.data.status) {
//       return response.data.data;
//     }
//     throw new Error('Failed to fetch user');
//   } catch (error: any) {
//     return rejectWithValue(error.message || 'Failed to fetch user');
//   }
// });

// // Async thunk for login
// export const login = createAsyncThunk('auth/login', async (formdata: any, { rejectWithValue }) => {
//   try {
//     const response = await apiClient.post('/auth/login', formdata);
//     if (response.data.status) {
//       return response.data.data;
//     }
//     return rejectWithValue(response.data.message);
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Login failed');
//   }
// });

// // Async thunk for logout
// export const logout = createAsyncThunk('auth/logout', async () => {
//   await apiClient.get('/auth/logout');
// });

// // Async thunk for two-factor authentication
// export const twoFactor = createAsyncThunk(
//   'auth/twoFactor',
//   async ({ formdata, email }: { formdata: any; email: string }, { rejectWithValue }) => {
//     try {
//       formdata.email_id = email;
//       const response = await apiClient.post('/auth/otp', formdata);
//       if (response.data.status) {
//         return response.data.data;
//       }
//       return rejectWithValue(response.data.message);
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Two-factor authentication failed');
//     }
//   }
// );

// // Async thunk for registration
// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (payload: any, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post('/auth/register', payload);
//       if (response.data.status) {
//         return response.data.data;
//       }
//       return rejectWithValue(response.data.message);
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//     setToken: (state, action) => {
//       state.token = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//     setBootstraping: (state, action) => {
//       state.isBoostraping = action.payload;
//     },
//     setEmail: (state, action) => {
//       if (state.user) {
//         state.user.email_id = action.payload;
//       } else {
//         state.user = { email_id: action.payload } as any;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch User
//       .addCase(fetchUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.isLoading = false;
//         state.isBoostraping = false;
//       })
//       .addCase(fetchUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isBoostraping = false;
//         toast.error(action.payload as string);
//       })
//       // Login
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         const { user, token } = action.payload;
//         state.user = user;
//         state.token = token;
//         state.isLoading = false;
//         saveAuthStorage({ token, user });
//         const currentTimezone = moment.tz.guess();
//         if (user.timezone !== currentTimezone) {
//           apiClient.put('/user/edit', { timezone: currentTimezone });
//         }
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         toast.error(action.payload as string);
//       })
//       // Logout
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       })
//       // Two-Factor
//       .addCase(twoFactor.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(twoFactor.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.meta.arg.formdata.action === 'verify_otp' && action.meta.arg.formdata.type === 'new_registration') {
//           state.token = action.payload.token;
//           localStorage.setItem('token', action.payload.token);
//         }
//         toast.success('Two-factor authentication successful');
//       })
//       .addCase(twoFactor.rejected, (state, action) => {
//         state.isLoading = false;
//         toast.error(action.payload as string);
//       })
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.token = action.payload.token;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.isLoading = false;
//         toast.error(action.payload as string);
//       });
//   },
// });

// export const { setUser, setToken, setLoading, setBootstraping, setEmail } = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { apiClient } from '@/helpers/http/index';
// import { IFreelancerDetails } from '@/helpers/types/freelancer.type';
// import { IClientDetails } from '@/helpers/types/client.type';
// import { saveAuthStorage, getToken } from '@/helpers/services/auth';
// import toast from 'react-hot-toast';
// import moment from 'moment-timezone';

// interface AuthState {
//   user: (IFreelancerDetails & IClientDetails) | null;
//   token: string | null;
//   isLoading: boolean;
//   isBootstrapping: boolean;
// }

// const initialState: AuthState = {
//   user: null,
//   token: null,
//   isLoading: false,
//   isBootstrapping: true,
// };

// // Async thunk to bootstrap user (check token and fetch user data)
// export const bootstrapUser = createAsyncThunk('auth/bootstrapUser', async (_, { dispatch, rejectWithValue }) => {
//   const token = getToken(); // Fetch token from storage (e.g., cookie or localStorage)
//   if (token) {
//     try {
//       const response = await apiClient.get('/user/get', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       if (response.data.status) {
//         return response.data.data; // Return user data
//       }
//       throw new Error('Invalid token');
//     } catch (error: any) {
//       console.error('Bootstrap failed:', error);
//       return rejectWithValue(error.message || 'Failed to bootstrap user');
//     }
//   }
//   return null; // No token, no bootstrap
// });

// // Async thunk to fetch user data
// export const fetchUser = createAsyncThunk('auth/fetchUser', async (_, { rejectWithValue }) => {
//   try {
//     const response = await apiClient.get('/user/get');
//     if (response.data.status) {
//       return response.data.data;
//     }
//     throw new Error('Failed to fetch user');
//   } catch (error: any) {
//     return rejectWithValue(error.message || 'Failed to fetch user');
//   }
// });

// // Async thunk for login
// export const login = createAsyncThunk('auth/login', async (formdata: any, { rejectWithValue }) => {
//   try {
//     const response = await apiClient.post('/auth/login', formdata);
//     if (response.data.status) {
//       return response.data.data;
//     }
//     return rejectWithValue(response.data.message);
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data?.message || 'Login failed');
//   }
// });

// // Async thunk for logout
// export const logout = createAsyncThunk('auth/logout', async () => {
//   await apiClient.get('/auth/logout');
// });

// // Async thunk for two-factor authentication
// export const twoFactor = createAsyncThunk(
//   'auth/twoFactor',
//   async ({ formdata, email }: { formdata: any; email: string }, { rejectWithValue }) => {
//     try {
//       formdata.email_id = email;
//       const response = await apiClient.post('/auth/otp', formdata);
//       if (response.data.status) {
//         return response.data.data;
//       }
//       return rejectWithValue(response.data.message);
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Two-factor authentication failed');
//     }
//   }
// );

// // Async thunk for registration
// export const registerUser = createAsyncThunk(
//   'auth/register',
//   async (payload: any, { rejectWithValue }) => {
//     try {
//       const response = await apiClient.post('/auth/register', payload);
//       if (response.data.status) {
//         return response.data.data;
//       }
//       return rejectWithValue(response.data.message);
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data?.message || 'Registration failed');
//     }
//   }
// );

// const authSlice = createSlice({
//   name: 'auth',
//   initialState,
//   reducers: {
//     setUser: (state, action) => {
//       state.user = action.payload;
//     },
//     setToken: (state, action) => {
//       state.token = action.payload;
//     },
//     setLoading: (state, action) => {
//       state.isLoading = action.payload;
//     },
//     setBootstraping: (state, action) => {
//       state.isBootstrapping = action.payload;
//     },
//     setEmail: (state, action) => {
//       if (state.user) {
//         state.user.email_id = action.payload;
//       } else {
//         state.user = { email_id: action.payload } as any;
//       }
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Bootstrap User
//       .addCase(bootstrapUser.pending, (state) => {
//         state.isBootstrapping = true;
//       })
//       .addCase(bootstrapUser.fulfilled, (state, action) => {
//         state.isBootstrapping = false;
//         if (action.payload) {
//           const { user, token } = action.payload;
//           state.user = user;
//           state.token = token || getToken(); // Use token from response or storage
//           saveAuthStorage({ token: state.token, user: state.user });
//           const currentTimezone = moment.tz.guess();
//           if (user?.timezone !== currentTimezone) {
//             apiClient.put('/user/edit', { timezone: currentTimezone });
//           }
//         }
//       })
//       .addCase(bootstrapUser.rejected, (state, action) => {
//         state.isBootstrapping = false;
//         toast.error(action.payload as string);
//       })
//       // Fetch User
//       .addCase(fetchUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchUser.fulfilled, (state, action) => {
//         state.user = action.payload;
//         state.isLoading = false;
//         state.isBoostraping = false;
//       })
//       .addCase(fetchUser.rejected, (state, action) => {
//         state.isLoading = false;
//         state.isBoostraping = false;
//         toast.error(action.payload as string);
//       })
//       // Login
//       .addCase(login.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(login.fulfilled, (state, action) => {
//         const { user, token } = action.payload;
//         state.user = user;
//         state.token = token;
//         state.isLoading = false;
//         saveAuthStorage({ token, user });
//         const currentTimezone = moment.tz.guess();
//         if (user.timezone !== currentTimezone) {
//           apiClient.put('/user/edit', { timezone: currentTimezone });
//         }
//       })
//       .addCase(login.rejected, (state, action) => {
//         state.isLoading = false;
//         toast.error(action.payload as string);
//       })
//       // Logout
//       .addCase(logout.fulfilled, (state) => {
//         state.user = null;
//         state.token = null;
//         localStorage.removeItem('token');
//         localStorage.removeItem('user');
//       })
//       // Two-Factor
//       .addCase(twoFactor.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(twoFactor.fulfilled, (state, action) => {
//         state.isLoading = false;
//         if (action.meta.arg.formdata.action === 'verify_otp' && action.meta.arg.formdata.type === 'new_registration') {
//           state.token = action.payload.token;
//           localStorage.setItem('token', action.payload.token);
//         }
//         toast.success('Two-factor authentication successful');
//       })
//       .addCase(twoFactor.rejected, (state, action) => {
//         state.isLoading = false;
//         toast.error(action.payload as string);
//       })
//       // Register
//       .addCase(registerUser.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(registerUser.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.token = action.payload.token;
//       })
//       .addCase(registerUser.rejected, (state, action) => {
//         state.isLoading = false;
//         toast.error(action.payload as string);
//       });
//   },
// });

// export const { setUser, setToken, setLoading, setBootstraping, setEmail } = authSlice.actions;
// export default authSlice.reducer;

// src/redux/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { apiClient } from "@/helpers/http/index";
import { IFreelancerDetails } from "@/helpers/types/freelancer.type";
import { IClientDetails } from "@/helpers/types/client.type";
import { saveAuthStorage } from "@/helpers/services/auth";
import toast from "react-hot-toast";
import moment from "moment-timezone";

interface AuthState {
  user: (IFreelancerDetails & IClientDetails) | null;
  token: string | null;
  isLoading: boolean;
  isBoostraping: boolean;
}

interface LoginPayload {
  email_id: string;
  password: string;
  terms_agreement: boolean;
  stay_signedin?: boolean;
}

interface TwoFactorPayload {
  formdata: {
    action: "send_otp" | "verify_otp";
    type: "new_registration" | "login";
    otp?: string;
  };
  email: string;
}

interface RegisterPayload {
  email_id: string;
  password: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  terms_agreement: boolean;
  user_type: "freelancer" | "client";
}

interface AuthResponse {
  user: IFreelancerDetails & IClientDetails;
  token: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  isBoostraping: true,
};

// Async thunk to fetch user data
export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/user/get");
      if (response.data.status) {
        return response.data.data;
      }
      throw new Error("Failed to fetch user");
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch user");
    }
  }
);

// Async thunk for login
export const login = createAsyncThunk<
  AuthResponse,
  LoginPayload,
  { rejectValue: string }
>("auth/login", async (formdata, { rejectWithValue }) => {
  try {
    const response = await apiClient.post<{
      status: boolean;
      data: AuthResponse;
      message: string;
    }>("/auth/login", formdata);
    if (response.data.status) {
      return response.data.data;
    }
    return rejectWithValue(response.data.message);
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Async thunk for logout
export const logout = createAsyncThunk("auth/logout", async () => {
  await apiClient.get("/auth/logout");
});

// Async thunk for two-factor authentication
export const twoFactor = createAsyncThunk(
  "auth/twoFactor",
  async (
    { formdata, email }: { formdata: any; email: string },
    { rejectWithValue }
  ) => {
    try {
      formdata.email_id = email;
      const response = await apiClient.post("/auth/otp", formdata);
      if (response.data.status) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Two-factor authentication failed"
      );
    }
  }
);

// Async thunk for registration
export const registerUser = createAsyncThunk(
  "auth/register",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", payload);
      if (response.data.status) {
        return response.data.data;
      }
      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (
      state,
      action: PayloadAction<(IFreelancerDetails & IClientDetails) | null>
    ) => {
      state.user = action.payload;
    },
    setToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setBootstraping: (state, action: PayloadAction<boolean>) => {
      state.isBoostraping = action.payload;
    },
    setEmail: (state, action: PayloadAction<string>) => {
      if (state.user) {
        state.user.email_id = action.payload;
      } else {
        state.user = { email_id: action.payload } as IFreelancerDetails &
          IClientDetails;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
        state.isBoostraping = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isBoostraping = false;
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
        // Add email property to user object before saving to storage
        const userWithEmail = {
          ...user,
          email: user.email_id, // Map email_id to email for storage
        };
        saveAuthStorage({ token, user: userWithEmail });
        const currentTimezone = moment.tz.guess();
        if (user.timezone !== currentTimezone) {
          apiClient.put("/user/edit", { timezone: currentTimezone });
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        toast.error(action.payload as string);
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      // Two-Factor
      .addCase(twoFactor.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(twoFactor.fulfilled, (state, action) => {
        state.isLoading = false;
        if (
          action.meta.arg.formdata.action === "verify_otp" &&
          action.meta.arg.formdata.type === "new_registration"
        ) {
          state.token = action.payload.token;
          localStorage.setItem("token", action.payload.token);
        }
        toast.success("Two-factor authentication successful");
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

export const { setUser, setToken, setLoading, setBootstraping, setEmail } =
  authSlice.actions;
export default authSlice.reducer;
