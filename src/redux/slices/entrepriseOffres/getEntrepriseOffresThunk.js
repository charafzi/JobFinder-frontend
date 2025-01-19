import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE_URL } from "../../../config/axiosConfig";

export const getEntrepriseOffres = createAsyncThunk(
    'offres/getEntrepriseOffres',
    async ({ 
        entrepriseId,
        page = 0,
        size = 10,
        sortBy = 'publicationDate',
        sortDirection = 'DESC'
    }, { rejectWithValue }) => {
        try {

            if (!entrepriseId) {
                return rejectWithValue('entrepriseId is required');
            }

            if (page < 0 || size <= 0) {
                return rejectWithValue('Invalid pagination parameters');
            }


            console.warn("Fetching offers for entrepriseId:", entrepriseId, "page:", page);
            
            const response = await axios.get(
                `${API_BASE_URL}/api/offre/byEntreprise/${entrepriseId}`,
                {
                    params: {
                        page,
                        size,
                        sortBy,
                        sortDirection
                    }
                }
            );

            console.warn("Response data:", {
                totalPages: response.data.totalPages,
                pageNo: response.data.pageNo,
                content: response.data.content?.length
            });

            return response.data;
        } catch (error) {
            console.error("Search error:", error);
            return rejectWithValue(
                error.response?.data?.message || 
                'Error while retrieving search result.'
            );
        }
    }
);