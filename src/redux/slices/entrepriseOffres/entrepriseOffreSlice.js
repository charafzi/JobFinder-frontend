import { createSlice } from "@reduxjs/toolkit";
import { getEntrepriseOffres } from "./getEntrepriseOffresThunk";
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
