import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosConfig";

export const getCandidaturesByOffre = createAsyncThunk(
  "entrepriseCandidatures/getByOffreId",
  async ({ offreId, page, size }, { rejectWithValue }) => {
    try {
      if (!offreId) {
        return rejectWithValue("offreId is required");
      }
      console.log("candidature for " + offreId);
      const response = await axiosInstance.get(
        `/api/candidature/${offreId}?page=${page}&size=${size}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while retrieving candidaturesEntreprise by offre id."
      );
    }
  }
);

// Thunk pour accepter une candidature
export const acceptCandidature = createAsyncThunk(
  "entrepCandidatures/acceptCandidature",
  async ({ email, offreId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/api/candidature/accept",
        { email, offreId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { email, offreId, status: "ACCEPTE" };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while acceptinig this candidature."
      );
    }
  }
);

// Thunk pour refuser une candidature
export const declineCandidature = createAsyncThunk(
  "entrepCandidatures/declineCandidature",
  async ({ email, offreId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        "/api/candidature/dismiss",
        { email, offreId },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return { email, offreId, status: "REJETEE" };
    } catch (error) {
      showToast("Error", error.message);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while declining this candidature."
      );
    }
  }
);

// Thunk pour récupérer le nombre de candidatures pour les offres d'une entreprise
export const getNombreCandidaturesParEntreprise = createAsyncThunk(
  "candidatures/getNombreCandidaturesParEntreprise",
  async (entrepriseId, { rejectWithValue }) => {
    try {
      if (!entrepriseId) {
        return rejectWithValue("entrepriseId is required");
      }

      const response = await axiosInstance.get(
        `/api/candidature/entreprises/${entrepriseId}/count`
      );

      return response.data; // Le nombre de candidatures (un entier)
    } catch (error) {
      console.error("Error fetching number of candidatures:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while fetching number of candidatures."
      );
    }
  }
);

// Thunk pour récupérer le nombre de candidatures acceptées pour les offres d'une entreprise
export const getNombreCandidaturesAccepteesParEntreprise = createAsyncThunk(
  "candidatures/getNombreCandidaturesAccepteesParEntreprise",
  async (entrepriseId, { rejectWithValue }) => {
    try {
      if (!entrepriseId) {
        return rejectWithValue("entrepriseId is required");
      }

      const response = await axiosInstance.get(
        `/api/candidature/entreprises/${entrepriseId}/accepted/count`
      );

      return response.data; // Le nombre de candidatures acceptées (un entier)
    } catch (error) {
      console.error("Error fetching number of accepted candidatures:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while fetching number of accepted candidatures."
      );
    }
  }
);
