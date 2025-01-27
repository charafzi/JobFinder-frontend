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

export const getNotifications= createAsyncThunk(
	'notifications/getNotifications',
	async ({ userId, page, size }, { rejectWithValue })=>{
		try {
			const response = await axiosInstance.get('/api/notifications', {
				params: { userId, page, size}
			});
			return response.data;
		}catch (error) {
			return rejectWithValue(error.response?.data?.message || 'Error while retrieving notifications by user id.');
		}
	}
);

export const markNotificationSeen= createAsyncThunk(
	'notifications/markAsSeen',
	async (notificationId, { rejectWithValue })=>{
		try {
			const response = await axiosInstance.put('/api/notifications/'+notificationId+'/seen',);
			return response.data;
		}catch (error) {
			return rejectWithValue(error.response?.data?.message || 'Error while marking notification as seen.');
		}
	}
);


export const deleteNotification= createAsyncThunk(
	'notifications/deleteNotification',
	async (notificationId, { rejectWithValue })=>{
		try {
			const response = await axiosInstance.delete('/api/notifications/'+notificationId);
			return response.data;
		}catch (error) {
			return rejectWithValue(error.response?.data?.message || 'Error while deleting notification.');
		}
	}
);

export const getUnreadNotificationsCount = createAsyncThunk(
    'notifications/getUnreadCount',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/notifications/'+userId+'/unread-count');
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Error while getting unread notifications count.');
        }
    }
);