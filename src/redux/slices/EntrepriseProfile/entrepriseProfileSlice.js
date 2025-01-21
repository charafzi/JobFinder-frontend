import { createSlice } from '@reduxjs/toolkit';
import {
  fetchEntrepriseByEmail,
  updateEntreprise,
  uploadProfilePicture,
  getProfilePicture,
  fetchSecteursActivite,
  updateEntrepriseSecteurs
} from './entrepriseProfileThunks';

const initialState = {
  loading: false,
  error: null,
  entreprise: null,
  about: '',
  adress: null,
  profilePicture: null,
  secteursActivites: [],
  loadingSecteursActivites: false,
  errorSecteursActivites: null
};

const entrepriseProfileSlice = createSlice({
  name: 'entrepriseProfile',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearEntrepriseProfile: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Entreprise
      .addCase(fetchEntrepriseByEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntrepriseByEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.entreprise = action.payload;
        state.about = action.payload.about || '';
        state.adress = action.payload.adress || null;
      })
      .addCase(fetchEntrepriseByEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Entreprise
      .addCase(updateEntreprise.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntreprise.fulfilled, (state, action) => {
        state.loading = false;
        state.entreprise = action.payload;
        state.about = action.payload.about || '';
        state.adress = action.payload.adress || null;
      })
      .addCase(updateEntreprise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Upload Profile Picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        if (state.entreprise) {
          state.entreprise.profilePicture = action.payload;
        }
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Get Profile Picture
      .addCase(getProfilePicture.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfilePicture.fulfilled, (state, action) => {
        state.loading = false;
        state.profilePicture = action.payload;
      })
      .addCase(getProfilePicture.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Secteurs d'Activité
      .addCase(fetchSecteursActivite.pending, (state) => {
        state.loadingSecteursActivites = true;
        state.errorSecteursActivites = null;
      })
      .addCase(fetchSecteursActivite.fulfilled, (state, action) => {
        state.loadingSecteursActivites = false;
        state.secteursActivites = action.payload;
      })
      .addCase(fetchSecteursActivite.rejected, (state, action) => {
        state.loadingSecteursActivites = false;
        state.errorSecteursActivites = action.error.message;
      })

      // Update Secteurs
      .addCase(updateEntrepriseSecteurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEntrepriseSecteurs.fulfilled, (state, action) => {
        state.loading = false;
        state.entreprise = action.payload;
      })
      .addCase(updateEntrepriseSecteurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearEntrepriseProfile } = entrepriseProfileSlice.actions;
export default entrepriseProfileSlice.reducer;