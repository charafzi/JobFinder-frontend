import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_BASE_URL} from "../../../config/axiosConfig";

export const searchOffres = createAsyncThunk(
    'offres/searchOffres',
    async (searchParams, { rejectWithValue })=>{
        try {
            console.log(searchParams)
            const response = await axios.post(API_BASE_URL+'/api/offre/search', searchParams);
            console.log(response.data)
            return response.data;
        }catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error while retrieving search result.');
        }
    }
)