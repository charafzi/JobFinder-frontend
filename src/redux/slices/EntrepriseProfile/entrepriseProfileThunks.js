import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosConfig';

const BASE_URL = '/api/entreprise';

export const fetchEntrepriseByEmail = createAsyncThunk(
  'entrepriseProfile/fetchEntrepriseByEmail',
  async (email) => {
    try {
      console.log('Making API request for email:', email);
      const response = await axiosInstance.get(`${BASE_URL}/${email}`);
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.log('API Error:', error.response?.data || error.message);
      throw error.response?.data || 'Failed to fetch entreprise data';
    }
  }
);

export const updateEntreprise = createAsyncThunk(
  'entrepriseProfile/updateEntreprise',
  async (entrepriseData) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}`, entrepriseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to update entreprise';
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'entrepriseProfile/uploadProfilePicture',
  async ({ id, file }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axiosInstance.post(
        `${BASE_URL}/profile-picture/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to upload profile picture';
    }
  }
);

export const getProfilePicture = createAsyncThunk(
  'entrepriseProfile/getProfilePicture',
  async (id) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/profile-picture/${id}`, {
        responseType: 'blob'
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      throw error.response?.data || 'Failed to get profile picture';
    }
  }
);

export const fetchSecteursActivites = createAsyncThunk(
  'entrepriseProfile/fetchSecteursActivites',
  async () => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/secteurs-activites`);
      return response.data;
    } catch (error) {
      throw error.response?.data || 'Failed to fetch secteurs d\'activité';
    }
  }
);
