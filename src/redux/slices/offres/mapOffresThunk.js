import { createAsyncThunk } from '@reduxjs/toolkit';
import  {API_BASE_URL} from "../../../config/axiosConfig";
import axios from "axios";

export const getOffresNearby = createAsyncThunk(
    'offres/getOffresNearby',
    async ({ lat, lng, radius }, { rejectWithValue })=>{
        try {
            const response = await axios.get(API_BASE_URL+'/api/offre/nearby', {
                params: { latitude: lat, longitude: lng, radius }
            });
            console.log({ lat, lng, radius })
            console.log("I GOT:::::::::::::::::::::: from "+API_BASE_URL+'/api/offre/nearby');
            console.log(response.data)
            return response.data;

        }catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error while retrieving offres nearby.');
        }
    }
)