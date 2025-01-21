import {createAsyncThunk} from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axiosConfig";

export const registerFCMToken = createAsyncThunk(
	'notifications/registerFCMToken',
	async ({userId,fcmToken},{rejectWithValue})=>{
		try {
			console.log("I will register")
			console.log(userId)
			console.log(fcmToken)
			const response = await axiosInstance.post('/api/notifications/register-fcmToken',{
				userId, fcmToken
			});
			console.log(response.data)
			return response.data;
		} catch (error) {
			console.error("FCM TOKEN ERROR")
			console.error(error)
			return rejectWithValue(error.response?.data || 'Error at registering FCM Token.');
		}
	}
);