import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../config/axiosConfig';

export const fetchFormations = createAsyncThunk(
  'candidatProfile/fetchFormations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/formation');
      return response.data;
    } catch (error) {
      console.error('Error fetching formations:', error);
      return rejectWithValue(error.response?.data || 'Error fetching formations');
    }
  }
);

export const fetchExperiences = createAsyncThunk(
  'candidatProfile/fetchExperiences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/api/experience');
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching experiences:', error);
      return rejectWithValue(error.response?.data || 'Error fetching experiences');
    }
  }
);


export const deleteExperience = createAsyncThunk(
  'candidatProfile/deleteExperience',
  async (experienceId) => {
    try {
      const response = await axiosInstance.delete(`/api/experience/${experienceId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const createExperience = createAsyncThunk(
  'candidatProfile/createExperience',
  async (experienceData) => {
    try {
      const response = await axiosInstance.post('/api/experience', experienceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const updateExperience = createAsyncThunk(
  'candidatProfile/updateExperience',
  async ({ experienceId, experienceData }) => {
    try {
      const response = await axiosInstance.put(`/api/experience/${experienceId}`, experienceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);