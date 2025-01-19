import { createSlice } from "@reduxjs/toolkit";
import {
  acceptCandidature,
  declineCandidature,
  getCandidaturesByOffre,
} from "./candidaturesThunk";

const initialState = {
  candidatures: [],
  isLoading: false,
  error: null,
  totalPages: null,
  totalElements: 0,
  last: false,
  currentPage: 0,
};

const candidaturesSlice = createSlice({
  name: "entrepCandidatures",
  initialState: initialState,
  reducers: {
    updateCandidature: (state, action) => {
      const { email, offreId, status } = action.payload;
      state.candidatures = state.candidatures.map((candidature) =>
        candidature.candidat.email === email &&
        candidature.offreEmploi.offreId === offreId
          ? { ...candidature, status }
          : candidature
      );
    },
    clearCandidatures: (state) => {
      state.candidatures = [];
      state.isLoading = false;
      state.error = null;
      state.totalElements = 0;
      state.totalPages = 1;
      state.last = false;
      state.currentPage = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // Gestion de getCandidaturesByOffre
      .addCase(getCandidaturesByOffre.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCandidaturesByOffre.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.pageNo === 0) {
          state.candidatures = action.payload.content;
        } else {
          action.payload.content.forEach((newItem) => {
            if (
              !state.candidatures.some(
                (item) => item.candidat.id === newItem.candidat.id
              )
            ) {
              state.candidatures.push(newItem);
            }
          });
        }
        state.currentPage = action.payload.pageNo;
        state.totalPages = action.payload.totalPages;
        state.totalElements = action.payload.totalElements;
        state.last = action.payload.isLastPage;
      })
      .addCase(getCandidaturesByOffre.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          "Error occurred when trying to retrieving candidat applications. Please try again.";
        state.last = true;
      })
      // Gestion de acceptCandidature
      .addCase(acceptCandidature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(acceptCandidature.fulfilled, (state, action) => {
        state.isLoading = false;
        const { email, offreId, status } = action.payload;
        candidaturesSlice.caseReducers.updateCandidature(state, {
          payload: { email, offreId, status },
        });
      })
      .addCase(acceptCandidature.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          "Error occurred when trying to accept the application. Please try again.";
      })

      // Gestion de declineCandidature
      .addCase(declineCandidature.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(declineCandidature.fulfilled, (state, action) => {
        state.isLoading = false;
        const { email, offreId, status } = action.payload;
        candidaturesSlice.caseReducers.updateCandidature(state, {
          payload: { email, offreId, status },
        });
      })
      .addCase(declineCandidature.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload ??
          "Error occurred when trying to decline the application. Please try again.";
      });
  },
});

export const { clearCandidatures } = candidaturesSlice.actions;
export default candidaturesSlice.reducer;
