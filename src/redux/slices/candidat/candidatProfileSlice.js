import { createSlice } from "@reduxjs/toolkit";
import {
  fetchFormations,
  fetchExperiences,
  fetchLangues,
  fetchCompetences,
  fetchAbout,
  createFormation,
  updateFormation,
  deleteFormation,
  createExperience,
  updateExperience,
  deleteExperience,
  createLangue,
  updateLangue,
  deleteLangue,
  createCompetence,
  updateCompetence,
  deleteCompetence,
  updateAbout,
  deleteAbout,
  getProfilePicture,
  uploadProfilePicture,
} from "./candidatProfileThunks";

const initialState = {
  formations: [],
  experiences: [],
  langues: [],
  competences: [],
  about: null,
  profilePicture: null,
  profileVersion: 0,
  loading: {
    formations: false,
    experiences: false,
    langues: false,
    competences: false,
    about: false,
    profilePicture: false,
  },
  error: {
    formations: null,
    experiences: null,
    langues: null,
    competences: null,
    about: null,
    profilePicture: null,
  },
};

const candidatProfileSlice = createSlice({
  name: "candidatProfile",
  initialState,
  reducers: {
    resetProfile: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Formations
    builder
      .addCase(fetchFormations.pending, (state) => {
        state.loading.formations = true;
        state.error.formations = null;
      })
      .addCase(fetchFormations.fulfilled, (state, action) => {
        // Filtrer les formations invalides (sans ID ou champs requis)
        state.formations = action.payload.filter(
          (formation) =>
            formation &&
            formation.nomEcole &&
            formation.niveauEtude &&
            formation.dateDebut &&
            formation.dateFin
        );
        state.loading.formations = false;
      })
      .addCase(fetchFormations.rejected, (state, action) => {
        state.loading.formations = false;
        state.error.formations = action.error.message;
      })
      .addCase(createFormation.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          // Vérifier si la formation n'existe pas déjà
          const exists = state.formations.some(
            (f) => f.id === action.payload.id
          );
          if (!exists) {
            state.formations.push(action.payload);
          }
        }
      })
      .addCase(updateFormation.fulfilled, (state, action) => {
        if (action.payload && action.payload.id) {
          const index = state.formations.findIndex(
            (f) => f.id === action.payload.id
          );
          if (index !== -1) {
            // Mettre à jour la formation existante
            state.formations[index] = action.payload;
          }
        }
      })
      .addCase(deleteFormation.fulfilled, (state, action) => {
        if (action.payload) {
          state.formations = state.formations.filter(
            (f) => f.id !== action.payload
          );
        }
      })
      // Experiences
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
        state.error.experiences = action.error.message;
      })
      .addCase(createExperience.fulfilled, (state, action) => {
        state.experiences.push(action.payload);
      })
      .addCase(updateExperience.fulfilled, (state, action) => {
        const index = state.experiences.findIndex(
          (e) => e.id === action.payload.id
        );
        if (index !== -1) {
          state.experiences[index] = action.payload;
        }
      })
      .addCase(deleteExperience.fulfilled, (state, action) => {
        state.experiences = state.experiences.filter(
          (e) => e.id !== action.payload
        );
      })
      // Langues
      .addCase(fetchLangues.pending, (state) => {
        state.loading.langues = true;
        state.error.langues = null;
        console.log("Fetching langues - pending");
      })
      .addCase(fetchLangues.fulfilled, (state, action) => {
        console.log("Fetching langues - fulfilled:", action.payload);
        state.langues = action.payload;
        state.loading.langues = false;
      })
      .addCase(fetchLangues.rejected, (state, action) => {
        console.log("Fetching langues - rejected:", action.error);
        state.loading.langues = false;
        state.error.langues = action.error.message;
      })
      .addCase(createLangue.fulfilled, (state, action) => {
        console.log("Creating langue - fulfilled:", action.payload);
        state.langues.push(action.payload);
      })
      .addCase(updateLangue.fulfilled, (state, action) => {
        console.log("Updating langue - fulfilled:", action.payload);
        const index = state.langues.findIndex(
          (l) => l.id === action.payload.id
        );
        if (index !== -1) {
          state.langues[index] = action.payload;
        }
      })
      .addCase(deleteLangue.fulfilled, (state, action) => {
        console.log("Deleting langue - fulfilled, id:", action.payload);
        state.langues = state.langues.filter((l) => l.id !== action.payload);
      })
      // Competences
      .addCase(fetchCompetences.pending, (state) => {
        state.loading.competences = true;
        state.error.competences = null;
      })
      .addCase(fetchCompetences.fulfilled, (state, action) => {
        state.competences = action.payload;
        state.loading.competences = false;
      })
      .addCase(fetchCompetences.rejected, (state, action) => {
        state.loading.competences = false;
        state.error.competences = action.error.message;
      })
      .addCase(createCompetence.fulfilled, (state, action) => {
        state.competences.push(action.payload);
      })
      .addCase(updateCompetence.fulfilled, (state, action) => {
        const index = state.competences.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) {
          state.competences[index] = action.payload;
        }
      })
      .addCase(deleteCompetence.fulfilled, (state, action) => {
        state.competences = state.competences.filter(
          (c) => c.id !== action.payload
        );
      })
      // About
      .addCase(fetchAbout.pending, (state) => {
        console.log("fetchAbout.pending - Setting loading state");
        state.loading.about = true;
        state.error.about = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        console.log("fetchAbout.fulfilled - Received data:", action.payload);
        state.about = action.payload;
        state.loading.about = false;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        console.log("fetchAbout.rejected - Error:", action.error);
        state.loading.about = false;
        state.error.about = action.error.message;
      })
      .addCase(updateAbout.fulfilled, (state, action) => {
        console.log("updateAbout.fulfilled - Updated data:", action.payload);
        // Si about est un tableau, mettre à jour le premier élément
        if (Array.isArray(state.about)) {
          state.about = [action.payload];
        } else {
          state.about = action.payload;
        }
      })
      .addCase(deleteAbout.fulfilled, (state) => {
        state.about = null;
      })
      // Profile Picture
      .addCase(getProfilePicture.pending, (state) => {
        state.loading.profilePicture = true;
        state.error.profilePicture = null;
      })
      .addCase(getProfilePicture.fulfilled, (state, action) => {
        state.loading.profilePicture = false;
        state.profilePicture = action.payload;
      })
      .addCase(getProfilePicture.rejected, (state, action) => {
        state.loading.profilePicture = false;
        state.error.profilePicture = action.error.message;
      })
      // Ajoutez ce nouveau cas
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.profilePicture = action.payload; 
        state.profileVersion = Date.now(); // Stocke le timestamp actuel
        state.loading.profilePicture = false;
      })
      .addCase(uploadProfilePicture.pending, (state) => {
        state.loading.profilePicture = true;
        state.error.profilePicture = null;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.loading.profilePicture = false;
        state.error.profilePicture = action.error.message;
      });
  },
});

export const { resetProfile } = candidatProfileSlice.actions;
export default candidatProfileSlice.reducer;
