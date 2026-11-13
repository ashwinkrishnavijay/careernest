import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Job, JobFormData } from '../types/job';
import { jobService } from '../services/jobService';

interface JobState {
  jobs: Job[];
  currentJob: Job | null;
  employerJobs: Job[];
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  employerJobs: [],
  loading: false,
  error: null,
};

export const fetchJobs = createAsyncThunk<Job[], { keyword?: string; location?: string } | undefined, { rejectValue: string }>(
  'jobs/fetchJobs',
  async (filters, { rejectWithValue }) => {
    try {
      return await jobService.getAllJobs(filters?.keyword, filters?.location);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch job listings');
    }
  }
);

export const fetchJobById = createAsyncThunk<Job, string, { rejectValue: string }>(
  'jobs/fetchJobById',
  async (id, { rejectWithValue }) => {
    try {
      return await jobService.getJobById(id);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch job details');
    }
  }
);

export const createJob = createAsyncThunk<Job, JobFormData, { rejectValue: string }>(
  'jobs/createJob',
  async (data, { rejectWithValue }) => {
    try {
      return await jobService.createJob(data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create job');
    }
  }
);

export const updateJob = createAsyncThunk<Job, { id: string; data: JobFormData }, { rejectValue: string }>(
  'jobs/updateJob',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await jobService.updateJob(id, data);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update job');
    }
  }
);

export const deleteJob = createAsyncThunk<string, string, { rejectValue: string }>(
  'jobs/deleteJob',
  async (id, { rejectWithValue }) => {
    try {
      await jobService.deleteJob(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
    }
  }
);

export const fetchEmployerJobs = createAsyncThunk<Job[], void, { rejectValue: string }>(
  'jobs/fetchEmployerJobs',
  async (_, { rejectWithValue }) => {
    try {
      return await jobService.getEmployerJobs();
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch employer jobs');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    clearJobError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch jobs';
      })

      // Fetch Job By ID
      .addCase(fetchJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobById.fulfilled, (state, action: PayloadAction<Job>) => {
        state.loading = false;
        state.currentJob = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch job';
      })

      // Create Job
      .addCase(createJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.jobs.unshift(action.payload);
        state.employerJobs.unshift(action.payload);
      })

      // Update Job
      .addCase(updateJob.fulfilled, (state, action: PayloadAction<Job>) => {
        state.employerJobs = state.employerJobs.map((j) => (j.id === action.payload.id ? action.payload : j));
        state.jobs = state.jobs.map((j) => (j.id === action.payload.id ? action.payload : j));
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })

      // Delete Job
      .addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
        state.employerJobs = state.employerJobs.filter((j) => j.id !== action.payload);
        state.jobs = state.jobs.filter((j) => j.id !== action.payload);
      })

      // Fetch Employer Jobs
      .addCase(fetchEmployerJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployerJobs.fulfilled, (state, action: PayloadAction<Job[]>) => {
        state.loading = false;
        state.employerJobs = action.payload;
      })
      .addCase(fetchEmployerJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load employer jobs';
      });
  },
});

export const { clearCurrentJob, clearJobError } = jobSlice.actions;
export default jobSlice.reducer;
