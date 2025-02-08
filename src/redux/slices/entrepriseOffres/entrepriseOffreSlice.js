import { createSlice } from "@reduxjs/toolkit";
import {
  getEntrepriseOffres,
  getNombreOffresParEntreprise,
  getRecentEntrepriseOffres,
} from "./getEntrepriseOffresThunk";
import { createEntrepriseOffre } from "./createEntrepriseOffreThunk";

const initialState = {
  entrepriseOffresList: [],
  isLoading: false,
  error: null,
  entrepriseId: null,
  pageNo: 0,
  size: 3,
  sortBy: "PUB_DATE",
  sortDirection: "DESC",
  totalPages: null,
  last: false,
  nombreOffres: 0,
  entrepriseRecentList: [], // Nouvelle liste dédiée à l'accueil
  recentLoading: false,
};

const EntrepriseOffreSlice = createSlice({
  name: "entrepriseOffres",
  initialState,
  reducers: {
    addOffreToList: (state, action) => {
      state.entrepriseOffresList.push(action.payload);
    },
    setPage: (state, action) => {
      const newPage = parseInt(action.payload);
      if (Number.isInteger(newPage) && newPage >= 0) {
        state.pageNo = newPage;
      }
    },
    setEntrepriseId: (state, action) => {
      state.entrepriseId = action.payload;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    setSortDirection: (state, action) => {
      state.sortDirection = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetching offres
      .addCase(getEntrepriseOffres.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getEntrepriseOffres.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.pageNo === 0) {
          state.entrepriseOffresList = action.payload.content;
        } else {
          action.payload.content.forEach((newItem) => {
            if (
              !state.entrepriseOffresList.some((item) => item.id === newItem.id)
            ) {
              state.entrepriseOffresList.push(newItem);
            }
          });
        }
        state.pageNo = action.payload.pageNo;
        state.totalPages = action.payload.totalPages;
        state.last = action.payload.last;
      })
      .addCase(getEntrepriseOffres.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Une erreur est survenue";
        state.entrepriseOffresList = [];
        state.last = true;
      })
      .addCase(createEntrepriseOffre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEntrepriseOffre.fulfilled, (state, action) => {
        state.isLoading = false;
        state.entrepriseOffresList.unshift(action.payload);
      })
      .addCase(createEntrepriseOffre.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create job";
      })
      // Fetching number of offres
      .addCase(getNombreOffresParEntreprise.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getNombreOffresParEntreprise.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nombreOffres = action.payload; // Mettre à jour le nombre d'offres
      })
      .addCase(getNombreOffresParEntreprise.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch number of offers";
      })
      // Nouveau cas pour les offres récentes
      .addCase(getRecentEntrepriseOffres.pending, (state) => {
        state.recentLoading = true;
      })
      .addCase(getRecentEntrepriseOffres.fulfilled, (state, action) => {
        state.recentLoading = false;
        state.entrepriseRecentList = action.payload.content; // Écrase la liste existante
        state.totalPages = action.payload.totalPages;
      })
      .addCase(getRecentEntrepriseOffres.rejected, (state, action) => {
        state.recentLoading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addOffreToList,
  setPage,
  setEntrepriseId,
  setSortBy,
  setSortDirection,
} = EntrepriseOffreSlice.actions;
export default EntrepriseOffreSlice.reducer;
