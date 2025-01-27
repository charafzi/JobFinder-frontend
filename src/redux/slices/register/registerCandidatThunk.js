import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosConfig";

export const registerCandidat = createAsyncThunk(
  "register/registerCandidat",
  async (candidatData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        "/api/auth/registerCandidat",
        candidatData
      );
      return response.data; // Retournez les données de la réponse
    } catch (error) {
      return rejectWithValue(error.response?.data || "Erreur inconnue");
    }
  }
);