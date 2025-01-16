import {createAsyncThunk} from "@reduxjs/toolkit";
import axios from "axios";
import {API_BASE_URL} from "../../../config/axiosConfig";

export const getCandidaturesByUserId = createAsyncThunk(
    'candidaturesCandidat/getCandidaturesByUserId',
    async ({ id, page, size }, { rejectWithValue })=>{
        try {
            const response = await axios.get(API_BASE_URL+'/api/candidature/', {
                params: { id,page,size}
            });
            return response.data;
        }catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error while retrieving candidaturesCandidat bu user id.');
        }
    }
)
