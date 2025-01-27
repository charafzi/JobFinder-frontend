import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosConfig";

export const registerEntreprise = createAsyncThunk(
  "auth/registerEntreprise",
  async (data, { rejectWithValue }) => {
    try {
      const apiRegisterEntreprise = "/api/auth/registerEntreprise";
      const request = {
        nom: data.name,
        adress: {
          city: data.city,
          adress: data.adress,
        },
        phoneNumber: data.phoneNumber,
        email: data.email,
        password: data.password,
        secteurIds: data.secteursActivites,
      };
      const response = await axiosInstance.post(apiRegisterEntreprise, request);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error during registering your account. Please try again."
      );
    }
  }
);

export const getAllSecteurs = createAsyncThunk(
    "register/getAllSecteurs",
    async (_, { rejectWithValue }) => {
      try {
        console.log("Fetching secteurs...");
        const response = await axiosInstance.get("/api/entreprise/secteurs-activites"); // Remplacez par votre endpoint API
        console.log("Secteurs fetched:", response.data);
        return response.data;
      } catch (error) {
        console.log("Error fetching secteurs:", error);
        return rejectWithValue(error.response.data);
      }
    }
  );
