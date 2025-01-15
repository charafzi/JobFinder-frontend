import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../../config/axiosConfig";
import showToast from "../../../utils/showToast";

export const createEntrepriseOffre = createAsyncThunk(
  "entrepriseOffres/createOffre",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/offre`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        console.log("Job created successfully:", response.data);
        showToast("success", "Success", "Job created successfully!");
        return response.data;
      }
    } catch (error) {
      console.error("Error creating job:", error.response?.data || error.message);
      showToast("error", "Error", "Failed to create job. Please try again.");
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);