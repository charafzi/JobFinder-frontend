import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_BASE_URL} from "../../../config/axiosConfig";

export const searchOffres = createAsyncThunk(
    'offres/searchOffres',
    async (searchParams, { rejectWithValue }) => {
        try {
            console.warn("Search params:", searchParams);
            const response = await axios.post(API_BASE_URL+'/api/offre/search', searchParams);
            console.warn("Response data:", {
                totalPages: response.data.totalPages,
                pageNo: response.data.pageNo,
                content: response.data.content?.length
            });
            return response.data;
        } catch (error) {
            console.error("Search error:", error);
            return rejectWithValue(error.response?.data?.message || 'Error while retrieving search result.');
        }
    }
);