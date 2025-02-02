import axiosInstance from '../../../config/axiosConfig';
import { API_BASE_URL } from '../../../config/axiosConfig';
import { createAsyncThunk } from '@reduxjs/toolkit';

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
      console.log('Données envoyées au serveur:', entrepriseData);
      
      // S'assurer que l'adresse est dans le bon format
      if (entrepriseData.adress) {
        entrepriseData = {
          ...entrepriseData,
          adress: {
            adress: entrepriseData.adress.adress || '',
            city: entrepriseData.adress.city || '',
            latitude: entrepriseData.adress.latitude || 0,
            longitude: entrepriseData.adress.longitude || 0
          }
        };
      }

      const response = await axiosInstance.put(`${BASE_URL}`, entrepriseData);
      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error.response?.data);
      throw error.response?.data || 'Failed to update entreprise';
    }
  }
);

export const getProfilePicture = createAsyncThunk(
  'entrepriseProfile/getProfilePicture',
  async (id) => {
    try {
      const response = await axiosInstance.get(`/api/entreprise/profile-picture/${id}`, {
        responseType: 'blob',
        headers: {
          Accept: 'image/*'
        }
      });

      const blob = response.data;
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      throw error;
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'entrepriseProfile/uploadProfilePicture',
  async ({ formData, entrepriseId }) => {
    try {
      await axiosInstance({
        method: 'post',
        url: `/api/entreprise/profile-picture/${entrepriseId}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return true;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchSecteursActivite = createAsyncThunk(
  'entrepriseProfile/fetchSecteursActivite',
  async () => {
    try {
      //console.log('Fetching secteurs d\'activité...');
      const response = await axiosInstance.get(`${BASE_URL}/secteurs-activites`);
      //console.log('Secteurs d\'activité received:', response.data);
      return response.data;
    } catch (error) {
      //console.error('Error fetching secteurs d\'activité:', error);
      throw error.response?.data || 'Failed to fetch secteurs d\'activité';
    }
  }
);

export const updateEntrepriseSecteurs = createAsyncThunk(
  'entrepriseProfile/updateSecteurs',
  async ({ entrepriseId, secteurIds }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/api/entreprise/${entrepriseId}/secteurs`;
      //console.log('Making request to:', url);
      //console.log('Request payload:', secteurIds);

      const response = await axiosInstance.put(url, secteurIds);
      
      //console.log('Response status:', response.status);
      //console.log('Response data:', response.data);
      
      return response.data;
    } catch (error) {
      console.error('Full error object:', error);
      console.error('Error config:', error.config);
      console.error('Error response:', error.response);
      
      if (error.response) {
        // Le serveur a répondu avec un statut d'erreur
        console.error('Server error data:', error.response.data);
        console.error('Server error status:', error.response.status);
        console.error('Server error headers:', error.response.headers);
      } else if (error.request) {
        // La requête a été faite mais pas de réponse
        console.error('No response received:', error.request);
      } else {
        // Une erreur s'est produite lors de la configuration de la requête
        console.error('Request setup error:', error.message);
      }
      
      return rejectWithValue(error.response?.data || 'Une erreur est survenue');
    }
  }
);