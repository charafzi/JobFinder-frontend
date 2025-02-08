import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance, { API_BASE_URL } from "../../../config/axiosConfig";

export const getEntrepriseOffres = createAsyncThunk(
  "offres/getEntrepriseOffres",
  async (
    {
      entrepriseId,
      page = 0,
      size = 10,
      sortBy = "PUB_DATE",
      sortDirection = "DESC",
    },
    { rejectWithValue }
  ) => {
    try {
      if (!entrepriseId) {
        return rejectWithValue("entrepriseId is required");
      }

      if (page < 0 || size <= 0) {
        return rejectWithValue("Invalid pagination parameters");
      }

      console.warn(
        "Fetching offers for entrepriseId:",
        entrepriseId,
        "page:",
        page
      );

      const response = await axios.get(
        `${API_BASE_URL}/api/offre/byEntreprise/${entrepriseId}`,
        {
          params: {
            page,
            size,
            sortBy,
            sortDirection,
          },
        }
      );

      console.warn("Response data:", {
        totalPages: response.data.totalPages,
        pageNo: response.data.pageNo,
        content: response.data.content?.length,
      });

      return response.data;
    } catch (error) {
      console.error("Search error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error while retrieving search result."
      );
    }
  }
);

// Thunk pour récupérer le nombre d'offres d'une entreprise
export const getNombreOffresParEntreprise = createAsyncThunk(
  "offres/getNombreOffresParEntreprise",
  async (entrepriseId, { rejectWithValue }) => {
    try {
      if (!entrepriseId) {
        return rejectWithValue("entrepriseId is required");
      }

      const response = await axiosInstance.get(
        `/api/offre/${entrepriseId}/count`
      );

      return response.data; // Le nombre d'offres (un entier)
    } catch (error) {
      console.error("Error fetching number of offers:", error);
      return rejectWithValue(
        error.response?.data?.message ||
          "Error while fetching number of offers."
      );
    }
  }
);

// Nouveau thunk spécifique à l'accueil
export const getRecentEntrepriseOffres = createAsyncThunk(
  "offres/getRecentEntrepriseOffres",
  async (entrepriseId, { rejectWithValue }) => {
    try {
      if (!entrepriseId) {
        return rejectWithValue("entrepriseId is required");
      }

      console.warn("Fetching offers for entrepriseId:", entrepriseId);

      const response = await axios.get(
        `${API_BASE_URL}/api/offre/byEntreprise/${entrepriseId}`,
        {
          params: {
            page: 0,
            size: 3, // Récupérer seulement 3 offres
            sortBy: "PUB_DATE", // Trier par date de publication
            sortDirection: "DESC", // Les plus récentes en premier
          },
        }
      );

      console.warn("Response data:", {
        totalPages: response.data.totalPages,
        pageNo: response.data.pageNo,
        content: response.data.content?.length,
      });

      return response.data;
    } catch (error) {
      console.error("Search error:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error while retrieving search result."
      );
    }
  }
);
