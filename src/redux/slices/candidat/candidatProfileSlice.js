import { createSlice } from '@reduxjs/toolkit';
import { fetchFormations, fetchExperiences } from './candidatProfileThunks';

const initialState = {
  formations: [],
  experiences: [],
  loading: {
    formations: false,
    experiences: false,
  },
  error: {
    formations: null,
    experiences: null,
  },
};

const candidatProfileSlice = createSlice({
  name: 'candidatProfile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Formations
    builder
      .addCase(fetchFormations.pending, (state) => {
        state.loading.formations = true;
        state.error.formations = null;
      })
      .addCase(fetchFormations.fulfilled, (state, action) => {
        state.formations = action.payload;
        state.loading.formations = false;
      })
      .addCase(fetchFormations.rejected, (state, action) => {
        state.loading.formations = false;
        state.error.formations = action.payload;
      });

    // Experiences
    builder
      .addCase(fetchExperiences.pending, (state) => {
        state.loading.experiences = true;
        state.error.experiences = null;
      })
      .addCase(fetchExperiences.fulfilled, (state, action) => {
        state.experiences = action.payload;
        state.loading.experiences = false;
      })
      .addCase(fetchExperiences.rejected, (state, action) => {
        state.loading.experiences = false;
        state.error.experiences = action.payload;
      });
  },
});

export default candidatProfileSlice.reducer;
