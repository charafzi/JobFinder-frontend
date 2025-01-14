import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_BASE_URL} from "../../../config/axiosConfig";

export const searchOffres = createAsyncThunk(
    'offres/searchOffres',
    async (searchParams, { rejectWithValue })=>{
        try {
            const response = await axios.get(API_BASE_URL+'/api/offre/search', searchParams);
            return response.data;
        }catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error while retrieving search result.');
        }
    }
)