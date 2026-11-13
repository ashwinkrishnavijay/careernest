import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, AuthResponse } from '../types/auth';
import { authService, LoginPayload, RegisterPayload } from '../services/authService';

const getInitialUser = (): User | null => {
  const stored = localStorage.getItem('careernest_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

const getInitialToken = (): string | null => {
  return localStorage.getItem('careernest_token');
};

const initialState: AuthState = {
  user: getInitialUser(),
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<AuthResponse, LoginPayload, { rejectValue: string }>(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('careernest_token', response.token);
      localStorage.setItem('careernest_user', JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        role: response.role,
        companyName: response.companyName,
      }));
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed. Please check your credentials.';
      return rejectWithValue(msg);
    }
  }
);

export const registerUser = createAsyncThunk<AuthResponse, RegisterPayload, { rejectValue: string }>(
  'auth/registerUser',
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      localStorage.setItem('careernest_token', response.token);
      localStorage.setItem('careernest_user', JSON.stringify({
        id: response.id,
        name: response.name,
        email: response.email,
        phone: response.phone,
        role: response.role,
        companyName: response.companyName,
      }));
      return response;
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      return rejectWithValue(msg);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('careernest_token');
      localStorage.removeItem('careernest_user');
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
          role: action.payload.role,
          companyName: action.payload.companyName,
        };
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = {
          id: action.payload.id,
          name: action.payload.name,
          email: action.payload.email,
          phone: action.payload.phone,
          role: action.payload.role,
          companyName: action.payload.companyName,
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
