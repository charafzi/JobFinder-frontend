import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosConfig";

export const getCandidaturesByOffre = createAsyncThunk(
  "entrepriseCandidatures/getByOffreId",
  async ({ offreId, page, size }, { rejectWithValue }) => {
    try {
      console.log("candidature for "+ offreId);
      const response = await axiosInstance.get(`/api/candidature/${offreId}`, {
        params: { page, size },
      });
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
      return {email, offreId, status: "REJETEE"};
    } catch (error) {
      showToast("Error", error.message);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while declining this candidature."
      );
    }
  }
);
