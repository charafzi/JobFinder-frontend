import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../../config/axiosConfig';

export const fetchJobs = createAsyncThunk(
    'jobs/fetchJobs',
    async (enterpriseId) => {
      try {
        const apiURL = API_BASE_URL + `/api/enterprises/${enterpriseId}/jobs`;
        const response = await fetch(apiURL);
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    }
  );

  export const createJob = createAsyncThunk(
    'jobs/createJob',
    async (jobData) => {
      try {
        const apiURL = API_BASE_URL + '/api/offre';
        const response = await fetch(apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(jobData),
        });
        const data = await response.json();
        return data;
      } catch (error) {
        throw error;
      }
    }
  );

  const jobSlice = createSlice({
    name: 'jobs',
    initialState: {
      offres: [],
      status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
      error: null,
      lastUpdated: null,
    },
    reducers: {
      resetJobState: (state) => {
        state.status = 'idle';
        state.error = null;
      },
    },
    extraReducers: (builder) => {
      builder
        .addCase(fetchJobs.pending, (state) => {
          state.status = 'loading';
        })
        .addCase(fetchJobs.fulfilled, (state, action) => {
          state.status = 'succeeded';
          state.offres = action.payload;
          state.lastUpdated = new Date().toISOString();
        })
        .addCase(fetchJobs.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message;
        })
        .addCase(createJob.fulfilled, (state, action) => {
          state.offres.unshift(action.payload);
          state.lastUpdated = new Date().toISOString();
        });
    },
  });
  

export const selectAllJobs = (state) => state.jobs.offres;
export const selectRecentJobs = (state) => state.jobs.offres.slice(0, 3);
export const selectJobsStatus = (state) => state.jobs.status;
export const selectJobsError = (state) => state.jobs.error;

export const { resetJobState } = jobSlice.actions;
export default jobSlice.reducer;