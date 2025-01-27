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
      console.log('Fetching profile picture for id:', id);
      const response = await axiosInstance.get(`/api/entreprise/profile-picture/${id}`, {
        responseType: 'blob',
        headers: {
          Accept: 'image/*'
        }
      });
      
      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      console.log('Response data type:', response.headers['content-type']);
      console.log('Full response:', JSON.stringify({
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
        data: response.data
      }, null, 2));

      if (!response.data) {
        console.error('No data received in response');
        throw new Error('No data received');
      }

      // Create a blob URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64data = reader.result;
          console.log('Successfully converted image to base64');
          resolve(base64data);
        };
        reader.onerror = () => {
          console.error('Error reading blob data');
          reject(new Error('Failed to read blob data'));
        };
        reader.readAsDataURL(response.data);
      });
    } catch (error) {
      console.error('Detailed error in getProfilePicture:', {
        error: error,
        response: error.response,
        message: error.message,
        stack: error.stack
      });
      throw error;
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'entrepriseProfile/uploadProfilePicture',
  async ({ formData, entrepriseId }) => {
    try {
      // Vérifier que l'ID est un nombre valide
      const id = parseInt(entrepriseId);
      if (isNaN(id)) {
        throw new Error('ID invalide');
      }

      // Utiliser exactement la même URL que dans Postman
      const response = await axiosInstance({
        method: 'post',
        url: `/api/entreprise/profile-picture/${id}`,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Erreur uploadProfilePicture:', error);
      throw error.response?.data || error.message || 'Failed to upload profile picture';
    }
  }
);

export const fetchSecteursActivite = createAsyncThunk(
  'entrepriseProfile/fetchSecteursActivite',
  async () => {
    try {
      console.log('Fetching secteurs d\'activité...');
      const response = await axiosInstance.get(`${BASE_URL}/secteurs-activites`);
      console.log('Secteurs d\'activité received:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching secteurs d\'activité:', error);
      throw error.response?.data || 'Failed to fetch secteurs d\'activité';
    }
  }
);

export const updateEntrepriseSecteurs = createAsyncThunk(
  'entrepriseProfile/updateSecteurs',
  async ({ entrepriseId, secteurIds }, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}/api/entreprise/${entrepriseId}/secteurs`;
      console.log('Making request to:', url);
      console.log('Request payload:', secteurIds);

      const response = await axiosInstance.put(url, secteurIds);
      
      console.log('Response status:', response.status);
      console.log('Response data:', response.data);
      
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

// export const fetchSecteursActivites = createAsyncThunk(
//   'entrepriseProfile/fetchSecteursActivites',
//   async () => {
//     try {
//       const response = await axiosInstance.get(`${BASE_URL}/secteurs-activites`);
//       return response.data;
//     } catch (error) {
//       throw error.response?.data || 'Failed to fetch secteurs d\'activité';
//     }
//   }
// );