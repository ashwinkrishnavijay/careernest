import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Application, ApplicationFormData, ApplicationStatusUpdatePayload } from '../types/application';
import { applicationService } from '../services/applicationService';

interface ApplicationState {
  myApplications: Application[];
  employerApplications: Application[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ApplicationState = {
  myApplications: [],
  employerApplications: [],
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,
};

export const submitApplication = createAsyncThunk<
  Application,
  { jobId: string; data: ApplicationFormData },
  { rejectValue: string }
>('applications/submitApplication', async ({ jobId, data }, { rejectWithValue }) => {
  try {
    return await applicationService.applyForJob(jobId, data);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to submit application');
  }
});

export const fetchSeekerApplications = createAsyncThunk<Application[], void, { rejectValue: string }>(
  'applications/fetchSeekerApplications',
  async (_, { rejectWithValue }) => {
    try {
      return await applicationService.getMyApplications();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch your applications');
    }
  }
);

export const fetchEmployerApplications = createAsyncThunk<Application[], string | undefined, { rejectValue: string }>(
  'applications/fetchEmployerApplications',
  async (jobId, { rejectWithValue }) => {
    try {
      return await applicationService.getEmployerApplications(jobId);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch candidate applications');
    }
  }
);

export const updateApplicationStatus = createAsyncThunk<
  Application,
  { id: string; payload: ApplicationStatusUpdatePayload },
  { rejectValue: string }
>('applications/updateApplicationStatus', async ({ id, payload }, { rejectWithValue }) => {
  try {
    return await applicationService.updateApplicationStatus(id, payload);
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to update application status');
  }
});

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {
    clearApplicationError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit application
      .addCase(submitApplication.pending, (state) => {
        state.submitting = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(submitApplication.fulfilled, (state, action: PayloadAction<Application>) => {
        state.submitting = false;
        state.myApplications.unshift(action.payload);
        state.successMessage = 'Application submitted successfully! Confirmation SMS dispatched.';
      })
      .addCase(submitApplication.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload || 'Application failed';
      })

      // Fetch Seeker Applications
      .addCase(fetchSeekerApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSeekerApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
        state.loading = false;
        state.myApplications = action.payload;
      })
      .addCase(fetchSeekerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load applications';
      })

      // Fetch Employer Applications
      .addCase(fetchEmployerApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerApplications.fulfilled, (state, action: PayloadAction<Application[]>) => {
        state.loading = false;
        state.employerApplications = action.payload;
      })
      .addCase(fetchEmployerApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load candidate applications';
      })

      // Update Application Status
      .addCase(updateApplicationStatus.fulfilled, (state, action: PayloadAction<Application>) => {
        state.employerApplications = state.employerApplications.map((app) =>
          app.id === action.payload.id ? action.payload : app
        );
        state.successMessage = `Candidate status updated to ${action.payload.status}. SMS notification dispatched!`;
      });
  },
});

export const { clearApplicationError, clearSuccessMessage } = applicationSlice.actions;
export default applicationSlice.reducer;
