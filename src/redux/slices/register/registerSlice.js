import { createSlice } from "@reduxjs/toolkit";
import { getAllSecteurs, registerEntreprise } from "./registerEntrepriseThunk";
import { registerCandidat } from "./registerCandidatThunk";

const initialState = {
  loading: false,
  error: null,
  success: false,
  secteurs: [], // Ajoutez un état pour stocker les secteurs
  secteursLoading: false, // Ajoutez un état pour le chargement des secteurs
  secteursError: null, // Ajoutez un état pour les erreurs des secteurs
  temporaryCredentials: null,
};

const registerSlice = createSlice({
  name: "register",
  initialState: initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
    setTemporaryCredentials: (state, action) => {
      state.temporaryCredentials = action.payload;
    },
    clearTemporaryCredentials: (state) => {
      state.temporaryCredentials = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerEntreprise.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerEntreprise.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerEntreprise.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Gestion des états pour registerCandidat
      .addCase(registerCandidat.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerCandidat.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerCandidat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Gestion des états pour getAllSecteurs
      .addCase(getAllSecteurs.pending, (state) => {
        state.secteursLoading = true;
        state.secteursError = null;
      })
      .addCase(getAllSecteurs.fulfilled, (state, action) => {
        state.secteursLoading = false;
        state.secteurs = action.payload; // Stockez les secteurs récupérés
      })
      .addCase(getAllSecteurs.rejected, (state, action) => {
        state.secteursLoading = false;
        state.secteursError = action.payload;
      });
  },
});

export default registerSlice.reducer;
export const { resetAuthState, setTemporaryCredentials, clearTemporaryCredentials } = registerSlice.actions;
