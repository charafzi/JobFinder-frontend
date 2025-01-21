import {createSlice} from "@reduxjs/toolkit";
import {deleteNotification, getNotifications, getUnreadNotificationsCount, markNotificationSeen, registerFCMToken} from "./notificationsThunks";


const initialState = {
	isLoading: false,
	error : null,
	notifications : [],
	pageNo: 0,
	totalPages : null,
	last: false,
	currentPage : 0,
	unreadCount: 0,
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
		incrementReadCount :(state,action)=> {
			console.warn("--------------> read count before : "+state.unreadCount);
			state.unreadCount += 1;
			console.warn("--------------> read count after : "+state.unreadCount);
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
			// get notifications
			.addCase(getNotifications.pending, (state)=>{
				state.isLoading = true;
			})
			.addCase(getNotifications.fulfilled, (state,action)=>{
				state.isLoading = false;
				if (action.payload.pageNo === 0) {
					state.notifications = action.payload.content;
					//state.notifications = [...state.notifications,action.payload.content]
				} else {
					/// always we will have unique notification, so it's safe to do this
					action.payload.content.forEach(newNotif => {
						if (!state.notifications.some(notif => notif.id === newNotif.id)) {
							state.notifications.push(newNotif);
						}
					});
				}
				state.currentPage = action.payload.pageNo;
				state.totalPages = action.payload.totalPages;
				state.last = action.payload.last;
			})
			.addCase(getNotifications.rejected,(state,action)=>{
				state.isLoading = false;
				state.error = action.payload || 'Error occurred when retrieving notifications for actual user.';
			})
			// mark notification as seen
			.addCase(markNotificationSeen.pending, (state)=>{
			})
			.addCase(markNotificationSeen.fulfilled, (state, action)=>{
				state.isLoading = false;
				state.error = null;
				const notificationId = action.meta.arg;
				const notificationIndex = state.notifications.findIndex(n => n.id === notificationId);
				if (notificationIndex !== -1) {
					state.notifications[notificationIndex].seen = true;
					if (state.unreadCount > 0) {
						state.unreadCount--;
					}
				}
			})
			.addCase(markNotificationSeen.rejected,(state,action)=>{
				state.error = action.payload || 'Error occurred when marking notification as seen.';
			})
			// get unread count
			.addCase(getUnreadNotificationsCount.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getUnreadNotificationsCount.fulfilled, (state, action) => {
				state.isLoading = false;
				state.error = null;
				state.unreadCount = action.payload;
			})
			.addCase(getUnreadNotificationsCount.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload;
			})
			// delete notifications
			.addCase(deleteNotification.pending, (state)=>{
				state.isLoading = true;
			})
			.addCase(deleteNotification.fulfilled, (state, action)=>{
				state.isLoading = false;
				state.error = null;
				// Remove the deleted notification from state
				const notificationId = action.meta.arg;
				state.notifications = state.notifications.filter(
					notification => notification.id !== notificationId
				);
			})
			.addCase(deleteNotification.rejected,(state,action)=>{
				state.isLoading = false;
				state.error = action.payload || 'Error occurred when deleting notification.';
			})
	}
})

export const { clearNotifications, incrementReadCount } = NotificationsSlice.actions;
export default NotificationsSlice.reducer;