import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance, {API_BASE_URL} from "../../../config/axiosConfig";

export const getCandidaturesByUserId = createAsyncThunk(
    'candidaturesCandidat/getCandidaturesByUserId',
    async ({ id, page, size }, { rejectWithValue })=>{
        try {
            const response = await axiosInstance.get('/api/candidature/', {
                params: { id, page, size}
            });
            return response.data;
        }catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error while retrieving candidaturesCandidat by user id.');
        }
    }
);

export const checkIfAlreadyApplied = createAsyncThunk(
    'candidaturesCandidat/checkIfAlreadyApplied',
    async ({ userId, offreId }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_BASE_URL+'/api/candidature/check/'+userId+'/'+offreId);
            console.warn(response)
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error checking application status.');
        }
    }
);

export const applyToOffer = createAsyncThunk(
    'candidatures/apply',
    async (candidatureData, { rejectWithValue }) => {
        try {
            const formData = new FormData();
            formData.append('email', candidatureData.email);
            formData.append('offreId', candidatureData.offreId);
            formData.append('reponse', candidatureData.reponse);
            
            if (candidatureData.cvId) {
                formData.append('cvId', candidatureData.cvId);
            }
            if (candidatureData.newCv) {
                formData.append('newCv', candidatureData.newCv);
            }
            if (candidatureData.lettreMotivation) {
                formData.append('lettreMotivation', candidatureData.lettreMotivation);
            }

            const response = await axiosInstance.post('/api/candidature/postuler', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error submitting application.');
        }
    }
);

export const getDocumentById = createAsyncThunk(
    'candidatures/getDocument',
    async (docId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(API_BASE_URL+'/api/candidat/document/'+docId);
            return {
                id: docId,
                ...response.data
            };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error while retrieving document.');
        }
    }
);

export const getDocuments = createAsyncThunk(
    'candidatures/getDocuments',
    async (documentIds, { dispatch, rejectWithValue }) => {
        try {
            const documents = await Promise.all(
                documentIds.map(docId => dispatch(getDocumentById(docId)).unwrap())
            );
            return documents;
        } catch (error) {
            return rejectWithValue(error.message || 'Error retrieving documents.');
        }
    }
);
