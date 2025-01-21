import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchEntrepriseByEmail,
  updateEntreprise,
  uploadProfilePicture,
  getProfilePicture,
  fetchSecteursActivites
} from './entrepriseProfileThunks';

const initialState = {
  loading: false,
  error: null,
  entreprise: null,
  about: '',
  secteurActivites: [],
  adresse: null,
  profilePicture: null,
  secteursActivites: []
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
        state.secteurActivites = action.payload.secteurActivites || [];
        state.adresse = action.payload.adresse || null;
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
        state.secteurActivites = action.payload.secteurActivites || [];
        state.adresse = action.payload.adresse || null;
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
        state.profilePicture = action.payload;
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
      .addCase(fetchSecteursActivites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSecteursActivites.fulfilled, (state, action) => {
        state.loading = false;
        state.secteursActivites = action.payload;
      })
      .addCase(fetchSecteursActivites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { clearError, clearEntrepriseProfile } = entrepriseProfileSlice.actions;
export default entrepriseProfileSlice.reducer;
