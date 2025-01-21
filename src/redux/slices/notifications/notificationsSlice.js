import {createSlice} from "@reduxjs/toolkit";
import {registerFCMToken} from "./notificationsThunks";

const initialState = {
	isLoading: false,
	error : null,
	notifications : []
}

const NotificationsSlice = createSlice({
	name : 'notifications',
	initialState : initialState,
	reducers : {
		clearNotifications: (state)=>{
			state.notifications = [];
			state.isLoading= false;
			state.error=null;
		},
	},
	extraReducers: (builder)=>{
		builder
			// register FCM Token
			.addCase(registerFCMToken.pending, (state)=>{
				state.isLoading = true;
			})
			.addCase(registerFCMToken.fulfilled, (state)=>{
				state.isLoading = false;
				state.error = null;
			})
			.addCase(registerFCMToken.rejected,(state,action)=>{
				state.isLoading = false;
				state.error = action.payload || 'Error occurred when registering FCM token for actual user.';
			})
	}
})

export const { clearNotifications } = NotificationsSlice.actions;
export default NotificationsSlice.reducer;