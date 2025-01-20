import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../config/axiosConfig';
import { Buffer } from 'buffer';

// Formations
export const fetchFormations = createAsyncThunk(
  'candidatProfile/fetchFormations',
  async (candidatId) => {
    try {
      console.log('Fetching formations for candidat:', candidatId);
      const response = await axiosInstance.get(`/api/formation/candidat/${candidatId}`);
      console.log('Raw formations response:', response.data);

      // Mapper les champs pour correspondre au format attendu
      const formationsWithIds = response.data.map(formation => {
        // Vérifier si la formation a un ID
        if (!formation.id) {
          console.warn('Formation without ID:', formation);
        }
        
        // Nettoyer les données nulles
        return {
          id: formation.id || undefined,
          nomEcole: formation.ecole || formation.nomEcole || '',
          niveauEtude: formation.titre || formation.niveauEtude || '',
          dateDebut: formation.dateDebut || '',
          dateFin: formation.dateFin || '',
          candidatId: formation.candidatId
        };
      }).filter(formation => 
        // Filtrer les formations invalides
        formation.nomEcole && 
        formation.niveauEtude && 
        formation.dateDebut && 
        formation.dateFin
      );

      console.log('Mapped and filtered formations:', formationsWithIds);
      return formationsWithIds;
    } catch (error) {
      console.error('Error fetching formations:', error);
      throw error;
    }
  }
);

// Create Formation
export const createFormation = createAsyncThunk(
  'candidatProfile/createFormation',
  async (formationData) => {
    try {
      console.log('createFormation thunk - input:', formationData);
      
      const apiData = {
        nomEcole: formationData.nomEcole,
        niveauEtude: formationData.niveauEtude,
        dateDebut: formationData.dateDebut,
        dateFin: formationData.dateFin,
        candidatId: formationData.candidatId
      };

      console.log('createFormation thunk - API request:', apiData);
      const response = await axiosInstance.post('/api/formation', apiData);
      console.log('createFormation thunk - API response:', response.data);

      // Si la réponse est vide mais le statut est 200/201, on considère que c'est un succès
      if (response.status === 200 || response.status === 201) {
        // Si pas de données dans la réponse, on retourne les données envoyées
        if (!response.data || Object.keys(response.data).length === 0) {
          return {
            ...apiData,
            id: Date.now() // ID temporaire si nécessaire
          };
        }
        
        // Si on a des données, on les utilise
        const formationResponse = Array.isArray(response.data) ? response.data[0] : response.data;
        return {
          id: formationResponse.id || formationResponse._id || Date.now(),
          nomEcole: formationResponse.nomEcole || apiData.nomEcole,
          niveauEtude: formationResponse.niveauEtude || apiData.niveauEtude,
          dateDebut: formationResponse.dateDebut || apiData.dateDebut,
          dateFin: formationResponse.dateFin || apiData.dateFin,
          candidatId: formationResponse.candidatId || apiData.candidatId
        };
      }

      throw new Error('Erreur lors de la création de la formation');
    } catch (error) {
      console.error('Error in createFormation thunk:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
        throw new Error(error.response.data.message || 'Error creating formation');
      }
      throw error;
    }
  }
);

// Update Formation
export const updateFormation = createAsyncThunk(
  'candidatProfile/updateFormation',
  async ({ formationId, formationData }) => {
    try {
      console.log('updateFormation thunk - input:', { formationId, formationData });

      // Mapper les champs pour l'API
      const apiData = {
        nomEcole: formationData.nomEcole,
        niveauEtude: formationData.niveauEtude,
        dateDebut: formationData.dateDebut,
        dateFin: formationData.dateFin,
        candidatId: formationData.candidatId
      };

      console.log('updateFormation thunk - sending data:', apiData);
      const response = await axiosInstance.put(`/api/formation/${formationId}`, apiData);
      
      // Si la mise à jour réussit (code 204), on retourne les données mises à jour
      if (response.status === 204) {
        const updatedFormation = {
          ...formationData,
          id: formationId
        };
        console.log('updateFormation thunk - success, returning:', updatedFormation);
        return updatedFormation;
      }

      throw new Error('Unexpected response status: ' + response.status);
    } catch (error) {
      console.error('Error in updateFormation:', error);
      throw error;
    }
  }
);

// Expérience Thunks
export const createExperience = createAsyncThunk(
  'candidatProfile/createExperience',
  async (experienceData) => {
    try {
      console.log('createExperience thunk - input:', experienceData);
      
      const apiData = {
        poste: experienceData.poste,
        dateDebut: experienceData.dateDebut,
        dateFin: experienceData.dateFin,
        candidatId: experienceData.candidatId
      };

      console.log('createExperience thunk - API request:', apiData);
      const response = await axiosInstance.post('/api/experience', apiData);
      console.log('createExperience thunk - API response:', response.data);

      if (response.status === 200 || response.status === 201) {
        if (!response.data || Object.keys(response.data).length === 0) {
          return {
            ...apiData,
            id: Date.now()
          };
        }
        
        const experienceResponse = Array.isArray(response.data) ? response.data[0] : response.data;
        return {
          id: experienceResponse.id || experienceResponse._id || Date.now(),
          poste: experienceResponse.poste || apiData.poste,
          dateDebut: experienceResponse.dateDebut || apiData.dateDebut,
          dateFin: experienceResponse.dateFin || apiData.dateFin,
          candidatId: experienceResponse.candidatId || apiData.candidatId
        };
      }

      throw new Error('Erreur lors de la création de l\'expérience');
    } catch (error) {
      console.error('Error in createExperience thunk:', error);
      throw error;
    }
  }
);

export const updateExperience = createAsyncThunk(
  'candidatProfile/updateExperience',
  async ({ experienceId, experienceData }) => {
    try {
      console.log('updateExperience thunk - input:', { experienceId, experienceData });
      
      // S'assurer que tous les champs sont des types corrects
      const apiData = {
        poste: String(experienceData.poste || ''),
        dateDebut: String(experienceData.dateDebut || ''),
        dateFin: String(experienceData.dateFin || ''),
        candidatId: Number(experienceData.candidatId)
      };

      console.log('updateExperience thunk - API request:', apiData);
      console.log('updateExperience thunk - URL:', `/api/experience/${experienceId}`);
      
      const response = await axiosInstance.put(`/api/experience/${experienceId}`, apiData);
      console.log('updateExperience thunk - Response status:', response.status);
      console.log('updateExperience thunk - Response headers:', response.headers);
      console.log('updateExperience thunk - API response:', response.data);

      // Accepter 200, 201 et 204 comme codes de succès
      if ([200, 201, 204].includes(response.status)) {
        console.log('Experience update successful');
        return {
          id: experienceId,
          ...apiData
        };
      } else {
        console.error('Unexpected response status:', response.status);
        throw new Error('Erreur lors de la mise à jour de l\'expérience');
      }
    } catch (error) {
      console.error('Error in updateExperience thunk:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
        throw new Error(
          error.response.data?.message || 
          'Erreur lors de la mise à jour de l\'expérience'
        );
      }
      throw error;
    }
  }
);

export const deleteExperience = createAsyncThunk(
  'candidatProfile/deleteExperience',
  async (experienceId) => {
    try {
      console.log('deleteExperience thunk - deleting experience:', experienceId);
      const response = await axiosInstance.delete(`/api/experience/${experienceId}`);
      console.log('deleteExperience thunk - API response:', response.data);
      return experienceId;
    } catch (error) {
      console.error('Error in deleteExperience thunk:', error);
      throw error;
    }
  }
);

export const fetchExperiences = createAsyncThunk(
  'candidatProfile/fetchExperiences',
  async (candidatId) => {
    try {
      console.log('fetchExperiences thunk - fetching for candidat:', candidatId);
      const response = await axiosInstance.get(`/api/experience/candidat/${candidatId}`);
      console.log('fetchExperiences thunk - API response:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error in fetchExperiences thunk:', error);
      throw error;
    }
  }
);

// Experiences
export const fetchExperiencesOld = createAsyncThunk(
  'candidatProfile/fetchExperiencesOld',
  async (candidatId) => {
    try {
     // console.log('Fetching experiences for candidatId:', candidatId);
      const response = await axiosInstance.get(`/api/experience/candidat/${candidatId}`);
     // console.log('Experiences response:', response.data);
      return response.data;
    } catch (error) {
      //console.error('Error fetching experiences:', error);
      throw error;
    }
  }
);

// Langues
export const fetchLangues = createAsyncThunk(
  'candidatProfile/fetchLangues',
  async (candidatId) => {
    try {
      console.log('Fetching langues for candidat:', candidatId);
      const response = await axiosInstance.get(`/api/langues/candidat/${candidatId}`);
      console.log('Langues fetched:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching langues:', error);
      throw error;
    }
  }
);

export const createLangue = createAsyncThunk(
  'candidatProfile/createLangue',
  async (langueData) => {
    try {
      console.log('createLangue thunk - input:', langueData);
      
      if (!langueData.candidatId || isNaN(langueData.candidatId)) {
        console.error('Invalid candidatId:', langueData.candidatId);
        throw new Error('ID du candidat invalide');
      }

      const apiData = {
        nomLangue: String(langueData.nomLangue || '').trim(),
        niveau: String(langueData.niveau || '').trim(),
        candidatId: Number(langueData.candidatId)
      };

      console.log('createLangue thunk - API request:', apiData);
      console.log('createLangue thunk - URL:', '/api/langues');
      
      const response = await axiosInstance.post('/api/langues', apiData);
      
      console.log('createLangue thunk - Response status:', response.status);
      console.log('createLangue thunk - Response headers:', response.headers);
      console.log('createLangue thunk - API response:', response.data);

      if ([200, 201, 204].includes(response.status)) {
        console.log('Langue creation successful');
        return response.data;
      } else {
        console.error('Unexpected response status:', response.status);
        throw new Error('Erreur lors de la création de la langue');
      }
    } catch (error) {
      console.error('Error in createLangue thunk:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
        throw new Error(
          error.response.data?.message || 
          'Erreur lors de la création de la langue'
        );
      }
      throw error;
    }
  }
);

export const updateLangue = createAsyncThunk(
  'candidatProfile/updateLangue',
  async ({ langueId, langueData }) => {
    try {
      console.log('updateLangue thunk - input:', { langueId, langueData });
      
      const apiData = {
        nomLangue: String(langueData.nomLangue || '').trim(),
        niveau: String(langueData.niveau || '').trim(),
        candidatId: Number(langueData.candidatId)
      };

      console.log('updateLangue thunk - API request:', apiData);
      console.log('updateLangue thunk - URL:', `/api/langues/${langueId}`);
      
      const response = await axiosInstance.put(`/api/langues/${langueId}`, apiData);
      console.log('updateLangue thunk - Response status:', response.status);
      console.log('updateLangue thunk - API response:', response.data);

      // Accepter 200, 201 et 204 comme codes de succès
      if ([200, 201, 204].includes(response.status)) {
        console.log('Langue update successful');
        return {
          id: langueId,
          ...apiData
        };
      } else {
        console.error('Unexpected response status:', response.status);
        throw new Error('Erreur lors de la mise à jour de la langue');
      }
    } catch (error) {
      console.error('Error in updateLangue thunk:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        console.error('API Error Status:', error.response.status);
        throw new Error(
          error.response.data?.message || 
          'Erreur lors de la mise à jour de la langue'
        );
      }
      throw error;
    }
  }
);

export const deleteLangue = createAsyncThunk(
  'candidatProfile/deleteLangue',
  async (langueId) => {
    try {
      console.log('deleteLangue thunk - deleting langue with ID:', langueId);
      await axiosInstance.delete(`/api/langues/${langueId}`);
      console.log('deleteLangue thunk - langue deleted successfully');
      return langueId;
    } catch (error) {
      console.error('Error in deleteLangue thunk:', error);
      if (error.response) {
        console.error('API Error Response:', error.response.data);
        throw new Error(error.response.data.message || 'Error deleting langue');
      }
      throw error;
    }
  }
);

// Competences
export const fetchCompetences = createAsyncThunk(
  'candidatProfile/fetchCompetences',
  async (candidatId) => {
    try {
      //console.log('Fetching competences for candidatId:', candidatId);
      const response = await axiosInstance.get(`/api/competences/candidat/${candidatId}`);
      //console.log('Competences response:', response.data);
      return response.data;
    } catch (error) {
      //console.error('Error fetching competences:', error);
      throw error;
    }
  }
);

// About
export const fetchAbout = createAsyncThunk(
  'candidatProfile/fetchAbout',
  async (candidatId) => {
    try {
      //console.log('fetchAbout - Starting request for candidatId:', candidatId);
      //console.log('fetchAbout - API URL:', `/api/abouts/candidat/${candidatId}`);
      
      const response = await axiosInstance.get(`/api/abouts/candidat/${candidatId}`);
      
      //console.log('fetchAbout - Response status:', response.status);
      //console.log('fetchAbout - Response headers:', response.headers);
      //console.log('fetchAbout - Response data:', response.data);
      
      if (!response.data) {
        console.warn('fetchAbout - Response data is empty');
        return null;
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching about:', error);
      throw error;
    }
  }
);

export const updateAbout = createAsyncThunk(
  'candidatProfile/updateAbout',
  async ({ aboutId, description, candidatId }) => {
    try {
     // console.log('updateAbout - Starting request with:', { aboutId, description, candidatId });
      const response = await axiosInstance.put(`/api/abouts/${aboutId}`, {
        description,
        candidatId
      });
      //console.log('updateAbout - Response data:', response.data);
      return response.data;
    } catch (error) {
      //console.error('Error updating about:', error);
      throw error;
    }
  }
);

// Create Competence
export const createCompetence = createAsyncThunk(
  'candidatProfile/createCompetence',
  async (competenceData) => {
    try {
      const requestData = {
        nomCompetence: competenceData.nomCompetence,
        candidatId: competenceData.candidatId
      };
      console.log('Creating competence - Input data:', competenceData);
      console.log('Creating competence - Request data:', requestData);
      console.log('Creating competence - CandidatId type:', typeof competenceData.candidatId);
      
      const response = await axiosInstance.post('/api/competences', requestData);
      
      console.log('Competence created - Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating competence - Full error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error request config:', error.config);
      throw error;
    }
  }
);

// Update Competence
export const updateCompetence = createAsyncThunk(
  'candidatProfile/updateCompetence',
  async ({ competenceId, competenceData }) => {
    try {
      console.log('Updating competence:', competenceData);
      const response = await axiosInstance.put(`/api/competences/${competenceId}`, competenceData);
      console.log('Competence updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating competence:', error);
      throw error;
    }
  }
);

// Delete Formation
export const deleteFormation = createAsyncThunk(
  'candidatProfile/deleteFormation',
  async (formationId) => {
    try {
      console.log('Deleting formation:', formationId);
      await axiosInstance.delete(`/api/formation/${formationId}`);
      console.log('Formation deleted successfully');
      return formationId;
    } catch (error) {
      console.error('Error deleting formation:', error);
      throw error;
    }
  }
);

// Delete Experience
export const deleteExperienceOld = createAsyncThunk(
  'candidatProfile/deleteExperienceOld',
  async (experienceId) => {
    try {
      console.log('Deleting experience:', experienceId);
      const response = await axiosInstance.delete(`/api/experience/${experienceId}`);
      console.log('Experience deleted:', response.data);
      return experienceId;
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  }
);

// Delete Competence
export const deleteCompetence = createAsyncThunk(
  'candidatProfile/deleteCompetence',
  async (competenceId) => {
    try {
      console.log('Deleting competence:', competenceId);
      const response = await axiosInstance.delete(`/api/competences/${competenceId}`);
      console.log('Competence deleted:', response.data);
      return competenceId;
    } catch (error) {
      console.error('Error deleting competence:', error);
      throw error;
    }
  }
);

// Delete About
export const deleteAbout = createAsyncThunk(
  'candidatProfile/deleteAbout',
  async (aboutId) => {
    try {
      console.log('Deleting about:', aboutId);
      const response = await axiosInstance.delete(`/api/abouts/${aboutId}`);
      console.log('About deleted:', response.data);
      return aboutId;
    } catch (error) {
      console.error('Error deleting about:', error);
      throw error;
    }
  }
);

// Upload Profile Picture
export const uploadProfilePicture = createAsyncThunk(
  'candidatProfile/uploadProfilePicture',
  async ({ email, imageUri }) => {
    try {
      console.log('Uploading profile picture for candidat:', email);
      
      // Create form data
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'profile_picture.jpg'
      });

      console.log('FormData created:', formData);

      const response = await axiosInstance.post(
        `/api/candidat/profile-picture/${email}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          maxBodyLength: Infinity,
          maxContentLength: Infinity,
        }
      );

      console.log('Upload response:', response.data);
      return response.data;
    } catch (error) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        method: error.config?.method,
        url: error.config?.url
      });
      throw error;
    }
  }
);

// Get Profile Picture
export const getProfilePicture = createAsyncThunk(
  'candidatProfile/getProfilePicture',
  async (email) => {
    try {
      const response = await axiosInstance.get(
        `/api/candidat/profile-picture/${email}`,
        {
          responseType: 'arraybuffer'
        }
      );

      const base64 = Buffer.from(response.data, 'binary').toString('base64');
      return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  }
);